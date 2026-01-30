import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Radar, MessageCircle, Shield, LogOut } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUnreadMessages } from "@/contexts/UnreadMessagesContext";

interface NavItem {
  to: string;
  icon: typeof LayoutDashboard;
  label: string;
}

const navItems: NavItem[] = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard", icon: Radar, label: "Radar" },
  { to: "/messages", icon: MessageCircle, label: "Chat" },
  { to: "/admin", icon: Shield, label: "Admin" },
];

interface BottomNavProps {
  onLogout?: () => void;
}

export const BottomNav = ({ onLogout }: BottomNavProps) => {
  const { language, toggleLanguage } = useLanguage();
  const { unreadCount } = useUnreadMessages();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      {/* Backdrop blur container */}
      <div className="mx-3 mb-3 rounded-2xl overflow-hidden">
        <div className="bg-card/90 backdrop-blur-xl border border-border/50 shadow-lg">
          <div className="flex items-center justify-around px-1 py-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex flex-col items-center justify-center min-w-[48px] min-h-[48px] rounded-xl transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <span className="text-xs font-bold text-primary">{language.toUpperCase()}</span>
              <span className="text-[10px] font-medium">Taal</span>
            </button>

            {/* Nav Items */}
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) => `
                  flex flex-col items-center justify-center
                  min-w-[48px] min-h-[48px] rounded-xl
                  transition-all duration-200
                  relative
                  ${isActive
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <div className="relative">
                      <item.icon className="w-5 h-5 mb-0.5" />
                      {item.label === "Chat" && unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-card animate-in zoom-in">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="bottomNavIndicator"
                        className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}

            {/* Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex flex-col items-center justify-center min-w-[48px] min-h-[48px] rounded-xl transition-all duration-200 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-5 h-5 mb-0.5" />
                <span className="text-[10px] font-medium">Uit</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
