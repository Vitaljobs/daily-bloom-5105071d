import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LocalGuideBadgeProps {
  labVisits: number;
  size?: "sm" | "md";
  className?: string;
}

// Threshold for Local Guide status (30+ visits)
const LOCAL_GUIDE_THRESHOLD = 30;

export const isLocalGuide = (labVisits: number = 0): boolean => {
  return labVisits >= LOCAL_GUIDE_THRESHOLD;
};

export const LocalGuideBadge = ({ labVisits, size = "sm", className = "" }: LocalGuideBadgeProps) => {
  const { language } = useLanguage();
  
  if (!isLocalGuide(labVisits)) return null;

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
  };

  const iconSizes = {
    sm: "w-2.5 h-2.5",
    md: "w-3 h-3",
  };

  const label = language === "nl" ? "Local Guide" : "Local Guide";
  const tooltip = language === "nl" 
    ? `${labVisits} bezoeken aan dit Lab` 
    : `${labVisits} visits to this Lab`;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.2 }}
      title={tooltip}
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md cursor-help ${className}`}
    >
      <MapPin className={`${iconSizes[size]} text-white`} />
    </motion.div>
  );
};
