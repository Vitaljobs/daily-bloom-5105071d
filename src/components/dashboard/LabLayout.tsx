import { motion, AnimatePresence, Variants } from "framer-motion";
import { ReactNode } from "react";
import { SocialRadar } from "@/components/dashboard/SocialRadar";
import { SkillsWidget } from "@/components/dashboard/SkillsWidget";
import { SmartMatch } from "@/components/dashboard/SmartMatch";
import { RecentWidget } from "@/components/dashboard/RecentWidget";
import { TableTent } from "@/components/dashboard/TableTent";
import { MyNetworkWidget } from "@/components/dashboard/MyNetworkWidget";
import { SkillsInRoomWidget } from "@/components/dashboard/SkillsInRoomWidget";
import { LabAtmosphere } from "@/components/dashboard/LabAtmosphere";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { ProfileCompleteness } from "@/components/dashboard/ProfileCompleteness";

// Lab-specific components
import { SilentModeIndicator } from "@/components/dashboard/labs/SilentModeIndicator";
import { NetworkingHotspot } from "@/components/dashboard/labs/NetworkingHotspot";
import { CreativeCanvas } from "@/components/dashboard/labs/CreativeCanvas";
import { ProductivityPulse } from "@/components/dashboard/labs/ProductivityPulse";
import { SpeedNetworking } from "@/components/dashboard/labs/SpeedNetworking";

interface LabLayoutProps {
  labId: string;
  itemVariants: Variants;
}

const MotionItem = ({ children, variants }: { children: ReactNode; variants: Variants }) => (
  <motion.div variants={variants}>
    {children}
  </motion.div>
);

// Roastery Layout: Productivity-focused Bento Grid
const RoasteryLayout = ({ itemVariants }: { itemVariants: Variants }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    {/* Row 1: Focus on productivity tools */}
    <MotionItem variants={itemVariants}>
      <ProfileCompleteness />
      <ProductivityPulse />
    </MotionItem>
    <MotionItem variants={itemVariants}>
      <SocialRadar />
    </MotionItem>
    <MotionItem variants={itemVariants}>
      <SkillsWidget />
    </MotionItem>

    {/* Row 2: Matching and networking */}
    <MotionItem variants={itemVariants}>
      <SmartMatch />
    </MotionItem>
    <MotionItem variants={itemVariants}>
      <SkillsInRoomWidget />
    </MotionItem>
    <MotionItem variants={itemVariants}>
      <TableTent />
    </MotionItem>

    {/* Row 3: Network overview */}
    <MotionItem variants={itemVariants}>
      <ProfileCard />
    </MotionItem>
    <motion.div variants={itemVariants} className="lg:col-span-2">
      <MyNetworkWidget />
    </motion.div>
    <MotionItem variants={itemVariants}>
      <RecentWidget />
    </MotionItem>
  </div>
);

// Library Layout: Quiet, focused, minimal
const LibraryLayout = ({ itemVariants }: { itemVariants: Variants }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    {/* Row 1: Silent mode prominently displayed */}
    <motion.div variants={itemVariants} className="lg:col-span-1">
      <SilentModeIndicator />
    </motion.div>
    <MotionItem variants={itemVariants}>
      <LabAtmosphere />
    </MotionItem>
    <MotionItem variants={itemVariants}>
      <TableTent />
    </MotionItem>

    {/* Row 2: Minimal interaction tools */}
    <MotionItem variants={itemVariants}>
      <SkillsWidget />
    </MotionItem>
    <MotionItem variants={itemVariants}>
      <SmartMatch />
    </MotionItem>
    <MotionItem variants={itemVariants}>
      <SkillsInRoomWidget />
    </MotionItem>

    {/* Row 3: Focus on deep work */}
    <MotionItem variants={itemVariants}>
      <ProfileCard />
    </MotionItem>
    <motion.div variants={itemVariants} className="lg:col-span-2">
      <MyNetworkWidget />
    </motion.div>
  </div>
);

// Espresso Layout: Fast-paced, social
const EspressoLayout = ({ itemVariants }: { itemVariants: Variants }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    {/* Row 1: Speed networking first */}
    <MotionItem variants={itemVariants}>
      <SpeedNetworking />
    </MotionItem>
    <MotionItem variants={itemVariants}>
      <SocialRadar />
    </MotionItem>
    <MotionItem variants={itemVariants}>
      <SmartMatch />
    </MotionItem>

    {/* Row 2: Quick connections */}
    <MotionItem variants={itemVariants}>
      <SkillsInRoomWidget />
    </MotionItem>
    <MotionItem variants={itemVariants}>
      <LabAtmosphere />
    </MotionItem>
    <MotionItem variants={itemVariants}>
      <SkillsWidget />
    </MotionItem>

    {/* Row 3: Recent activity */}
    <MotionItem variants={itemVariants}>
      <ProfileCard />
    </MotionItem>
    <motion.div variants={itemVariants} className="lg:col-span-2">
      <MyNetworkWidget />
    </motion.div>
    <MotionItem variants={itemVariants}>
      <RecentWidget />
    </MotionItem>
  </div>
);

// Rooftop Layout: Networking-focused, panoramic feel
const RooftopLayout = ({ itemVariants }: { itemVariants: Variants }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
    {/* Row 1: Wide panoramic view with networking hotspot */}
    <motion.div variants={itemVariants} className="lg:col-span-2">
      <NetworkingHotspot />
    </motion.div>
    <MotionItem variants={itemVariants}>
      <SocialRadar />
    </MotionItem>
    <MotionItem variants={itemVariants}>
      <SmartMatch />
    </MotionItem>

    {/* Row 2: Connection tools */}
    <MotionItem variants={itemVariants}>
      <SkillsWidget />
    </MotionItem>
    <MotionItem variants={itemVariants}>
      <SkillsInRoomWidget />
    </MotionItem>
    <MotionItem variants={itemVariants}>
      <TableTent />
    </MotionItem>
    <MotionItem variants={itemVariants}>
      <LabAtmosphere />
    </MotionItem>

    {/* Row 3: Full width network */}
    <MotionItem variants={itemVariants}>
      <ProfileCard />
    </MotionItem>
    <motion.div variants={itemVariants} className="lg:col-span-3">
      <MyNetworkWidget />
    </motion.div>
  </div>
);

// Greenhouse Layout: Creative, asymmetric, organic
const GreenhouseLayout = ({ itemVariants }: { itemVariants: Variants }) => (
  <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
    {/* Asymmetric creative layout */}
    <motion.div variants={itemVariants} className="md:col-span-4">
      <CreativeCanvas />
    </motion.div>
    <motion.div variants={itemVariants} className="md:col-span-2">
      <LabAtmosphere />
    </motion.div>

    {/* Row 2: Mixed sizes for organic feel */}
    <motion.div variants={itemVariants} className="md:col-span-2">
      <SocialRadar />
    </motion.div>
    <motion.div variants={itemVariants} className="md:col-span-2">
      <SmartMatch />
    </motion.div>
    <motion.div variants={itemVariants} className="md:col-span-2">
      <SkillsWidget />
    </motion.div>

    {/* Row 3: Varied widget sizes */}
    <motion.div variants={itemVariants} className="md:col-span-3">
      <SkillsInRoomWidget />
    </motion.div>
    <motion.div variants={itemVariants} className="md:col-span-3">
      <TableTent />
    </motion.div>

    {/* Row 4: Full width for connections */}
    <motion.div variants={itemVariants} className="md:col-span-2">
      <ProfileCard />
    </motion.div>
    <motion.div variants={itemVariants} className="md:col-span-4">
      <MyNetworkWidget />
    </motion.div>
  </div>
);

export const LabLayout = ({ labId, itemVariants }: LabLayoutProps) => {
  switch (labId) {
    case "roastery":
      return <RoasteryLayout itemVariants={itemVariants} />;
    case "library":
      return <LibraryLayout itemVariants={itemVariants} />;
    case "espresso":
      return <EspressoLayout itemVariants={itemVariants} />;
    case "rooftop":
      return <RooftopLayout itemVariants={itemVariants} />;
    case "greenhouse":
      return <GreenhouseLayout itemVariants={itemVariants} />;
    default:
      return <RoasteryLayout itemVariants={itemVariants} />;
  }
};
