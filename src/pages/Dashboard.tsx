import { motion } from "framer-motion";
import { SocialRadar } from "@/components/dashboard/SocialRadar";
import { SkillsWidget } from "@/components/dashboard/SkillsWidget";
import { UsersWidget } from "@/components/dashboard/UsersWidget";
import { RecentWidget } from "@/components/dashboard/RecentWidget";
import { TableTent } from "@/components/dashboard/TableTent";
import { SmartMatch } from "@/components/dashboard/SmartMatch";
import { CommonGroundProvider } from "@/contexts/CommonGroundContext";
import cafeBg from "@/assets/cafe-bg.jpg";

const DashboardContent = () => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Blurred Café Background */}
      <div
        className="fixed inset-0 bg-cover bg-center scale-110"
        style={{ 
          backgroundImage: `url(${cafeBg})`,
          filter: "blur(8px)",
        }}
      />
      <div className="fixed inset-0 bg-background/60" />

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-5xl"
        >
          {/* Bento Grid matching reference */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Row 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <SocialRadar />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <SkillsWidget />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <UsersWidget />
            </motion.div>

            {/* Row 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <SocialRadar />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <RecentWidget />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <TableTent />
            </motion.div>

            {/* Row 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <TableTent />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <SmartMatch />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <TableTent />
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

const Dashboard = () => {
  return (
    <CommonGroundProvider>
      <DashboardContent />
    </CommonGroundProvider>
  );
};

export default Dashboard;
