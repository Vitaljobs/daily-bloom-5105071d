import { motion } from "framer-motion";
import { LabMonitor } from "@/components/admin/LabMonitor";
import { RevenueTracker } from "@/components/admin/RevenueTracker";
import { EngagementPulse } from "@/components/admin/EngagementPulse";
import { UserManagement } from "@/components/admin/UserManagement";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { QRCodeGenerator } from "@/components/admin/QRCodeGenerator";
import { PageViewsTracker } from "@/components/admin/PageViewsTracker";
import { OnlineUsersMonitor } from "@/components/admin/OnlineUsersMonitor";
import { LabAnalytics } from "@/components/admin/LabAnalytics";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 25,
    },
  },
};

const Admin = () => {
  return (
    <div className="admin-theme min-h-screen bg-background">
      {/* Subtle grid background */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(185 100% 50% / 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(185 100% 50% / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Gradient orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 rounded-full bg-neon-cyan/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 rounded-full bg-neon-purple/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10">
        <AdminHeader />

        <main className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Top Stats Row - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div variants={itemVariants}>
                <PageViewsTracker />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <EngagementPulse />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <RevenueTracker />
              </motion.div>
            </div>

            {/* Lab Analytics + Online Users Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div variants={itemVariants}>
                <LabAnalytics />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <OnlineUsersMonitor />
              </motion.div>
            </div>

            {/* Lab Monitor - Full Width */}
            <motion.div variants={itemVariants}>
              <LabMonitor />
            </motion.div>

            {/* User Management */}
            <motion.div variants={itemVariants}>
              <UserManagement />
            </motion.div>

            {/* QR Code Generator */}
            <motion.div variants={itemVariants}>
              <QRCodeGenerator />
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
