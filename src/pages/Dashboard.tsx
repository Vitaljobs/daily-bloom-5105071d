import { motion } from "framer-motion";
import { SocialRadar } from "@/components/dashboard/SocialRadar";
import { TableTent } from "@/components/dashboard/TableTent";
import { SmartMatch } from "@/components/dashboard/SmartMatch";
import { HelpWall } from "@/components/dashboard/HelpWall";
import { LocationCard } from "@/components/dashboard/LocationCard";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { Coffee, Bell, Search } from "lucide-react";
import cafeBg from "@/assets/cafe-bg.jpg";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${cafeBg})` }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />

      {/* Header */}
      <header className="relative z-20 border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Coffee className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-serif text-foreground">Common Ground</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-muted transition-colors">
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="p-2 rounded-lg hover:bg-muted transition-colors relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center text-sm font-medium text-primary-foreground">
              JD
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-2">
            Good afternoon, <span className="text-gradient-gold">Jan</span>
          </h1>
          <p className="text-muted-foreground">
            23 professionals are working nearby at The Coffee Lab
          </p>
        </motion.div>

        {/* Bento Grid - Desktop */}
        <div className="hidden lg:grid grid-cols-4 gap-6">
          {/* Row 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-2 row-span-2"
          >
            <SocialRadar />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TableTent />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <SmartMatch />
          </motion.div>

          {/* Row 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <LocationCard />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ProfileCard />
          </motion.div>

          {/* Row 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="col-span-4"
          >
            <HelpWall />
          </motion.div>
        </div>

        {/* Masonry Grid - Mobile/Tablet */}
        <div className="lg:hidden space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <TableTent />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SmartMatch />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <SocialRadar />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <LocationCard />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ProfileCard />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <HelpWall />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
