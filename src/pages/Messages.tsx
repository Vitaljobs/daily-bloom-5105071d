import { useState, useEffect } from "react";
import { ConversationList } from "@/components/messages/ConversationList";
import { ChatWindow } from "@/components/messages/ChatWindow";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSearchParams } from "react-router-dom";

const Messages = () => {
    const isMobile = useIsMobile();
    const [searchParams] = useSearchParams();
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

    useEffect(() => {
        const userId = searchParams.get("userId");
        if (userId) {
            setSelectedConversationId(userId);
        }
    }, [searchParams]);

    return (
        <div className="container max-w-7xl mx-auto py-6 h-[calc(100vh-80px)]">
            <div className="bg-card border rounded-xl shadow-sm overflow-hidden h-full flex">
                {isMobile ? (
                    selectedConversationId ? (
                        <ChatWindow
                            conversationId={selectedConversationId}
                            onBack={() => setSelectedConversationId(null)}
                        />
                    ) : (
                        <ConversationList
                            onSelectConversation={setSelectedConversationId}
                            selectedId={selectedConversationId}
                        />
                    )
                ) : (
                    <>
                        <div className="w-1/3 border-r min-w-[300px]">
                            <ConversationList
                                onSelectConversation={setSelectedConversationId}
                                selectedId={selectedConversationId}
                            />
                        </div>
                        <div className="flex-1">
                            <ChatWindow
                                conversationId={selectedConversationId}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Messages;
