import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";

interface ConversationListProps {
    onSelectConversation: (id: string) => void;
    selectedId: string | null;
}

interface Message {
    id: string;
    content: string;
    created_at: string;
    sender_id: string;
    receiver_id: string;
    read: boolean;
}

interface ConversationProfile {
    id: string; // The *other* user's ID
    name: string;
    avatar_url: string | null;
    lastMessage: Message;
}

export const ConversationList = ({ onSelectConversation, selectedId }: ConversationListProps) => {
    const { user } = useAuth();

    const { data: conversations, isLoading } = useQuery({
        queryKey: ['conversations', user?.id],
        queryFn: async () => {
            if (!user?.id) return [];

            // 1. Fetch all messages sent to or received by the current user
            const { data, error } = await supabase
                .from('messages' as any)
                .select('*')
                .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const messages = data as unknown as Message[];

            // 2. Group messages by the "other" user to form unique conversations
            const conversationMap = new Map<string, Message>();
            messages.forEach((msg) => {
                const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
                if (!conversationMap.has(otherUserId)) {
                    conversationMap.set(otherUserId, msg);
                }
            });

            // 3. Fetch profile details for each conversation partner
            const userIds = Array.from(conversationMap.keys());
            if (userIds.length === 0) return [];

            const { data: profiles, error: profileError } = await supabase
                .from('profiles')
                .select('id, name, avatar_url, user_id')
                .in('user_id', userIds);

            if (profileError) throw profileError;

            // 4. Combine profile data with last message
            const fullConversations: ConversationProfile[] = profiles.map(profile => {
                // The profile object from Supabase might be typed, but we need to ensure we access properties safely
                const p = profile as any;
                return {
                    id: p.user_id, // Use the user_id from the profile
                    name: p.name,
                    avatar_url: p.avatar_url,
                    lastMessage: conversationMap.get(p.user_id)!
                };
            }).sort((a, b) =>
                new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime()
            );

            return fullConversations;
        },
        enabled: !!user?.id
    });

    if (isLoading) {
        return <div className="p-4 text-center text-muted-foreground">Loading chats...</div>;
    }

    return (
        <div className="flex flex-col h-full bg-muted/10">
            <div className="p-4 border-b bg-card">
                <h2 className="text-xl font-serif font-medium mb-4">Messages</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search messages..." className="pl-9 bg-background" />
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="flex flex-col">
                    {conversations?.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground text-sm mt-10">
                            No conversations yet
                        </div>
                    ) : (
                        conversations?.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => onSelectConversation(conv.id)}
                                className={`flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left border-b border-border/40 ${selectedId === conv.id ? "bg-muted relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary" : ""
                                    }`}
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-gold/20 flex items-center justify-center overflow-hidden border border-border">
                                        {conv.avatar_url ? (
                                            <img src={conv.avatar_url} alt={conv.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-lg font-medium text-foreground/60">
                                                {conv.name.substring(0, 2).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-medium truncate text-foreground">{conv.name}</h3>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                            {formatDistanceToNow(new Date(conv.lastMessage.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className={`text-sm truncate ${!conv.lastMessage.read && conv.lastMessage.receiver_id === user?.id ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                                        {conv.lastMessage.sender_id === user?.id && "You: "}
                                        {conv.lastMessage.content}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};
