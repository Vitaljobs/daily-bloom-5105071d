import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, Radar, MessageCircle, Shield } from "lucide-react";

interface NavItem {
  to: string;
  icon: typeof LayoutDashboard;
  label: string;
}

const navItems: NavItem[] = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard", icon: Radar, label: "Radar" },
  { to: "/dashboard", icon: MessageCircle, label: "Chat" },
  { to: "/admin", icon: Shield, label: "Admin" },
];

export const BottomNav = () => {
  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      {/* Backdrop blur container */}
      <div className="mx-3 mb-3 rounded-2xl overflow-hidden">
        <div className="bg-card/90 backdrop-blur-xl border border-border/50 shadow-lg">
          <div className="flex items-center justify-around px-2 py-2">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) => `
                  flex flex-col items-center justify-center
                  min-w-[56px] min-h-[56px] rounded-xl
                  transition-all duration-200
                  ${isActive 
                    ? "bg-primary/20 text-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <item.icon className="w-5 h-5 mb-1" />
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
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
