import { useAuth } from "@/contexts/AuthContext";

export const useIsAdmin = () => {
    const { user } = useAuth();

    // List of allowed admin emails
    const allowedEmails = ["james@live.nl", "privemail@gmail.com"];

    const isAdmin = user && user.email && allowedEmails.includes(user.email);

    return { isAdmin, user };
};
