import { motion } from "framer-motion";
import { User, MessageCircle } from "lucide-react";

const users = [
  { id: 1, name: "Emma van Dijk", role: "Developer", avatar: "ED", online: true },
  { id: 2, name: "Marc Bakker", role: "Designer", avatar: "MB", online: true },
];

export const UsersWidget = () => {
  return (
    <div className="wood-card p-5 h-full relative">
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <User className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-base font-serif text-foreground">Users</h3>
          <p className="text-xs text-muted-foreground">Recent actief</p>
        </div>
      </div>

      <div className="space-y-3 relative z-10">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-inner p-3 flex items-center gap-3"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center text-xs font-medium text-primary-foreground">
                {user.avatar}
              </div>
              {user.online && (
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-[#1a1310]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.role}</p>
            </div>
            <button className="p-1.5 rounded-lg hover:bg-muted/30 transition-colors">
              <MessageCircle className="w-4 h-4 text-muted-foreground" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
