import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ChatWindowSkeleton } from "@/components/skeletons/ChatSkeleton";

interface ChatWindowProps {
    conversationId: string | null;
    onBack?: () => void;
}

interface Message {
    id: string;
    content: string;
    created_at: string;
    sender_id: string;
    receiver_id: string;
    read: boolean;
}

export const ChatWindow = ({ conversationId, onBack }: ChatWindowProps) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [newMessage, setNewMessage] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch conversation partner profile
    const { data: partnerProfile } = useQuery({
        queryKey: ['profile', conversationId],
        queryFn: async () => {
            if (!conversationId) return null;
            const { data } = await supabase
                .from('profiles')
                .select('name, avatar_url')
                .eq('user_id', conversationId)
                .single();
            return data;
        },
        enabled: !!conversationId
    });

    // Fetch messages
    const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
        queryKey: ['messages', conversationId],
        queryFn: async () => {
            if (!user?.id || !conversationId) return [];

            const { data, error } = await supabase
                .from('messages' as any)
                .select('*')
                .or(`and(sender_id.eq.${user.id},receiver_id.eq.${conversationId}),and(sender_id.eq.${conversationId},receiver_id.eq.${user.id})`)
                .order('created_at', { ascending: true }); // Oldest first for chat history

            if (error) throw error;
            return data as unknown as Message[];
        },
        enabled: !!user?.id && !!conversationId,
    });

    // Realtime subscription
    useEffect(() => {
        if (!user?.id || !conversationId) return;

        const channel = supabase
            .channel(`chat:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `or(and(sender_id.eq.${conversationId},receiver_id.eq.${user.id}),and(sender_id.eq.${user.id},receiver_id.eq.${conversationId}))`
                },
                (payload) => {
                    const newMsg = payload.new as Message;
                    queryClient.setQueryData(['messages', conversationId], (old: Message[] = []) => [...old, newMsg]);

                    // Also invalidate conversation list to update preview
                    queryClient.invalidateQueries({ queryKey: ['conversations'] });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversationId, user?.id, queryClient]);

    // Mark messages as read when conversation opens or new messages arrive
    useEffect(() => {
        const markAsRead = async () => {
            if (!user?.id || !conversationId || messages.length === 0) return;

            const unreadMessages = messages.filter(
                (msg) => msg.receiver_id === user.id && !msg.read
            );

            if (unreadMessages.length > 0) {
                await supabase
                    .from("messages")
                    .update({ read: true })
                    .in("id", unreadMessages.map((msg) => msg.id));

                // Refresh global counter
                queryClient.invalidateQueries({ queryKey: ['conversations'] });
                // We could also refresh the context if we exposed a refresh function, 
                // but the realtime listener in context might catch the UPDATE event automatically.
            }
        };

        markAsRead();
    }, [conversationId, messages, user?.id, queryClient]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user?.id || !conversationId) return;

        try {
            const { error } = await supabase
                .from('messages' as any)
                .insert({
                    sender_id: user.id,
                    receiver_id: conversationId,
                    content: newMessage.trim(),
                    read: false
                });

            if (error) throw error;
            setNewMessage("");
            // Optimistic update handled by subscription or we can do it here manually if subscription is slow
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error("Failed to send message");
        }
    };

    if (isLoadingMessages && conversationId) {
        return <ChatWindowSkeleton />;
    }

    if (!conversationId) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-muted/5">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Send className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-medium mb-2">Your Messages</h3>
                <p>Select a conversation to start chatting</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b flex items-center gap-3 bg-card shadow-sm z-10">
                {onBack && (
                    <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                )}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-gold/20 flex items-center justify-center overflow-hidden border border-border">
                    {partnerProfile?.avatar_url ? (
                        <img src={partnerProfile.avatar_url} alt={partnerProfile.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="font-medium text-primary">
                            {partnerProfile?.name?.substring(0, 2).toUpperCase() || "??"}
                        </span>
                    )}
                </div>
                <div>
                    <h3 className="font-medium">{partnerProfile?.name || "Unknown User"}</h3>
                    <p className="text-xs text-muted-foreground">Online</p>
                </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 bg-muted/5" ref={scrollRef}>
                <div className="space-y-4 flex flex-col pb-4 h-full overflow-y-auto">
                    {/* 
                     Note: ScrollArea from shadcn might handle ref differently. 
                     If auto-scroll fails, fall back to a simple div with overflow-auto.
                     For now, applying ref to ScrollArea's viewport if possible, or wrapping content.
                   */}
                    {messages.map((msg) => {
                        const isMe = msg.sender_id === user?.id;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${isMe
                                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                                    : "bg-card border text-foreground rounded-tl-sm"
                                    } shadow-sm`}>
                                    <p className="text-sm">{msg.content}</p>
                                    <div className="flex items-center justify-end gap-1 mt-1">
                                        <span className="text-[10px] opacity-70">
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {isMe && (
                                            <span className="text-xs">
                                                {msg.read ? (
                                                    <span className="text-blue-100 font-bold">✓✓</span>
                                                ) : (
                                                    <span className="opacity-70">✓</span>
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t bg-card mt-auto">
                <form className="flex gap-2" onSubmit={handleSendMessage}>
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                    />
                    <Button type="submit" size="icon" className="btn-gold" disabled={!newMessage.trim()}>
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
};
