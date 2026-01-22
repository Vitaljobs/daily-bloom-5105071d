import { motion, AnimatePresence } from "framer-motion";
import { SocialRadar } from "@/components/dashboard/SocialRadar";
import { SkillsWidget } from "@/components/dashboard/SkillsWidget";
import { UsersWidget } from "@/components/dashboard/UsersWidget";
import { RecentWidget } from "@/components/dashboard/RecentWidget";
import { TableTent } from "@/components/dashboard/TableTent";
import { SmartMatch } from "@/components/dashboard/SmartMatch";
import { LocationSelector } from "@/components/dashboard/LocationSelector";
import { MatchRevealOverlay } from "@/components/dashboard/MatchRevealOverlay";
import { WelcomeOverlay } from "@/components/dashboard/WelcomeOverlay";
import { ChatOverlay } from "@/components/chat/ChatOverlay";
import { CommonGroundProvider, useCommonGround } from "@/contexts/CommonGroundContext";

// Staggered animation for grid items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

const DashboardContent = () => {
  const { 
    currentLocation, 
    setCurrentLocation, 
    isChangingLocation,
    showMatchReveal,
    matchedUser,
    closeMatchReveal,
    currentLab,
    usersPerLab,
    showWelcome,
    closeWelcome,
    openUsers,
    isChatOpen,
    chatPartner,
    closeChat,
  } = useCommonGround();

  // Current user mock data
  const currentUser = {
    name: "Jij",
    avatar: "JIJ",
    role: "Developer",
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Dynamic Lab Background with cross-fade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLocation}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 bg-cover bg-center scale-110"
          style={{ 
            backgroundImage: currentLab ? `url(${currentLab.background})` : undefined,
            filter: showMatchReveal ? "blur(24px)" : "blur(8px)",
          }}
        />
      </AnimatePresence>
      <div className="fixed inset-0 bg-background/60" />

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        {/* Location Selector */}
        <LocationSelector 
          currentLocation={currentLocation}
          onLocationChange={setCurrentLocation}
          usersPerLab={usersPerLab}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentLocation}
            variants={containerVariants}
            initial="hidden"
            animate={isChangingLocation ? "exit" : "visible"}
            exit="exit"
            className="w-full max-w-5xl"
          >
            {/* Bento Grid matching reference */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Row 1 */}
              <motion.div variants={itemVariants}>
                <SocialRadar />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <SkillsWidget />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <UsersWidget />
              </motion.div>

              {/* Row 2 */}
              <motion.div variants={itemVariants}>
                <SocialRadar />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <RecentWidget />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <TableTent />
              </motion.div>

              {/* Row 3 */}
              <motion.div variants={itemVariants}>
                <TableTent />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <SmartMatch />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <TableTent />
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Welcome Overlay */}
      <WelcomeOverlay
        isVisible={showWelcome}
        lab={currentLab || null}
        openUsersCount={openUsers.length}
        onClose={closeWelcome}
      />

      {/* Match Reveal Overlay */}
      <MatchRevealOverlay
        isVisible={showMatchReveal}
        currentUser={currentUser}
        matchedUser={matchedUser}
        onClose={closeMatchReveal}
      />

      {/* Chat Overlay */}
      <ChatOverlay
        isOpen={isChatOpen}
        onClose={closeChat}
        chatPartner={chatPartner}
        currentLabName={currentLab?.name}
      />
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
