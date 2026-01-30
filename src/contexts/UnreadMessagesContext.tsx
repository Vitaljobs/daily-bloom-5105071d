import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface UnreadMessagesContextType {
    unreadCount: number;
    refreshUnreadCount: () => Promise<void>;
}

const UnreadMessagesContext = createContext<UnreadMessagesContextType | undefined>(undefined);

export const UnreadMessagesProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    const refreshUnreadCount = async () => {
        if (!user) return;
        const { count, error } = await supabase
            .from("messages" as any)
            .select("*", { count: 'exact', head: true })
            .eq("receiver_id", user.id)
            .eq("read", false);

        if (!error && count !== null) {
            setUnreadCount(count);
        }
    };

    useEffect(() => {
        if (!user) {
            setUnreadCount(0);
            return;
        }

        // Initial fetch
        refreshUnreadCount();

        // Subscribe to changes
        const channel = supabase
            .channel('unread-messages-count')
            .on(
                'postgres_changes',
                {
                    event: '*', // INSERT to increase, UPDATE to decrease (when marked read)
                    schema: 'public',
                    table: 'messages',
                    filter: `receiver_id.eq.${user.id}`
                },
                () => {
                    refreshUnreadCount();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    return (
        <UnreadMessagesContext.Provider value={{ unreadCount, refreshUnreadCount }}>
            {children}
        </UnreadMessagesContext.Provider>
    );
};

export const useUnreadMessages = () => {
    const context = useContext(UnreadMessagesContext);
    if (context === undefined) {
        throw new Error("useUnreadMessages must be used within a UnreadMessagesProvider");
    }
    return context;
};
