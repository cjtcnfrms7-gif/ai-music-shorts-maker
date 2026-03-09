import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
}

export const usePageTransition = () => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetPath, setTargetPath] = useState("");

  const navigateWithTransition = useCallback((path: string) => {
    setTargetPath(path);
    setIsTransitioning(true);
  }, []);

  const handleMidpoint = useCallback(() => {
    navigate(targetPath);
  }, [navigate, targetPath]);

  const handleComplete = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  return { isTransitioning, navigateWithTransition, handleMidpoint, handleComplete };
};

export const PageTransitionOverlay = ({
  isActive,
  onMidpoint,
  onComplete,
}: {
  isActive: boolean;
  onMidpoint: () => void;
  onComplete: () => void;
}) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[100] bg-primary"
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={() => {
            onMidpoint();
            // Small delay then slide out
            setTimeout(() => {
              // trigger exit by setting a flag or calling onComplete
            }, 50);
          }}
        />
      )}
    </AnimatePresence>
  );
};
