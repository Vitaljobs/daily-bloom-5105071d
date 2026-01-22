import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Radar, Coffee, ArrowRight, X, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface OnboardingFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingFlow = ({ isOpen, onClose }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useLanguage();

  const onboardingSteps = [
    {
      icon: MapPin,
      title: t.onboarding.step1Title,
      description: t.onboarding.step1Desc,
      tip: t.onboarding.step1Tip,
      illustration: "🏛️",
    },
    {
      icon: Radar,
      title: t.onboarding.step2Title,
      description: t.onboarding.step2Desc,
      tip: t.onboarding.step2Tip,
      illustration: "📡",
    },
    {
      icon: Coffee,
      title: t.onboarding.step3Title,
      description: t.onboarding.step3Desc,
      tip: t.onboarding.step3Tip,
      illustration: "☕",
    },
  ];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const step = onboardingSteps[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === onboardingSteps.length - 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 100 }}
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                  y: -100,
                  x: Math.sin(i) * 50,
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
                className="absolute text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              >
                ☕
              </motion.div>
            ))}
          </div>

          {/* Card */}
          <motion.div
            key={currentStep}
            initial={{ rotateY: -90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative w-full max-w-md"
          >
            <div className="wood-card p-8 text-center">
              {/* Skip button */}
              <button
                onClick={handleSkip}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Step indicator */}
              <div className="flex justify-center gap-2 mb-6">
                {onboardingSteps.map((_, index) => (
                  <motion.div
                    key={index}
                    animate={{
                      scale: index === currentStep ? 1.2 : 1,
                      backgroundColor: index === currentStep
                        ? "hsl(35 85% 58%)"
                        : index < currentStep
                        ? "hsl(35 85% 58% / 0.5)"
                        : "hsl(0 0% 50% / 0.3)",
                    }}
                    className="w-2 h-2 rounded-full"
                  />
                ))}
              </div>

              {/* Illustration */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                className="relative w-24 h-24 mx-auto mb-6"
              >
                {/* Glow ring */}
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 20px hsl(35 85% 58% / 0.3)",
                      "0 0 40px hsl(35 85% 58% / 0.5)",
                      "0 0 20px hsl(35 85% 58% / 0.3)",
                    ],
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-gold-dark/20 border-2 border-primary/50"
                />
                
                {/* Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon className="w-10 h-10 text-primary" />
                </div>
                
                {/* Illustration emoji */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -bottom-2 -right-2 text-3xl"
                >
                  {step.illustration}
                </motion.div>
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-serif text-2xl text-foreground mb-3"
              >
                {step.title}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground mb-4 leading-relaxed"
              >
                {step.description}
              </motion.p>

              {/* Tip box */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-3 rounded-xl bg-primary/10 border border-primary/30 mb-6"
              >
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                  <p className="text-foreground/80 text-left">{step.tip}</p>
                </div>
              </motion.div>

              {/* Navigation buttons */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-gold-dark text-primary-foreground font-medium flex items-center justify-center gap-2"
              >
                {isLastStep ? (
                  <>
                    <Coffee className="w-4 h-4" />
                    {t.onboarding.startNetworking}
                  </>
                ) : (
                  <>
                    {t.onboarding.next}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>

              {/* Step counter */}
              <p className="text-xs text-muted-foreground mt-4">
                {t.onboarding.stepOf.replace("{current}", String(currentStep + 1)).replace("{total}", String(onboardingSteps.length))}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
