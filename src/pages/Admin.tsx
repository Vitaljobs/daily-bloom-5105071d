import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Settings, 
  Building2, 
  TrendingUp, 
  Coffee, 
  Users, 
  Crown,
  Activity,
  FileText,
  BarChart3,
  Zap
} from "lucide-react";
import { LabMonitor } from "@/components/admin/LabMonitor";
import { RevenueTracker } from "@/components/admin/RevenueTracker";
import { EngagementPulse } from "@/components/admin/EngagementPulse";
import { ProjectSummary } from "@/components/admin/ProjectSummary";
import { AdminHeader } from "@/components/admin/AdminHeader";

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
        className="fixed inset-0 opacity-[0.03]"
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
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div variants={itemVariants}>
                <EngagementPulse />
              </motion.div>
              
              <motion.div variants={itemVariants} className="md:col-span-2">
                <RevenueTracker />
              </motion.div>
            </div>

            {/* Lab Monitor - Full Width */}
            <motion.div variants={itemVariants}>
              <LabMonitor />
            </motion.div>

            {/* Project Summary */}
            <motion.div variants={itemVariants}>
              <ProjectSummary />
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
