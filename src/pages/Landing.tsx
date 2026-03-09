import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const [transitioning, setTransitioning] = useState(false);

  const handleGetStarted = () => {
    setTransitioning(true);
    // Slide in takes 0.3s, then navigate, then slide out
    setTimeout(() => {
      navigate("/dashboard");
    }, 350);
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Purple slide transition overlay */}
      {transitioning && (
        <motion.div
          className="fixed inset-0 z-[100]"
          style={{ backgroundColor: "hsl(263 84% 58%)" }}
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
        />
      )}

      {/* Grain texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle purple glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full bg-primary/[0.04] blur-[200px] pointer-events-none" />

      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 md:px-16 py-6">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.6 }}
          className="text-sm tracking-[0.3em] font-bold text-white/70"
        >
          ENTIUS
        </motion.span>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 0.6 }}
          className="text-sm tracking-[0.15em] font-medium text-white/50 hover:text-white/80 transition-colors"
        >
          [ MENU ]
        </motion.button>
      </header>

      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 relative">
        <div className="max-w-[1400px] w-full">
          {/* ENTIUS letter-by-letter */}
          <div className="mb-12 md:mb-20 overflow-hidden">
            <div className="flex">
              {"ENTIUS".split("").map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 0.3, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.15, duration: 0.5, ease: "easeOut" }}
                  className="text-xs md:text-sm tracking-[0.5em] font-medium text-white/30"
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Main headline */}
          <div className="space-y-2 md:space-y-4">
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-[clamp(2.5rem,8vw,9rem)] font-black leading-[0.95] tracking-[-0.03em] text-white"
              >
                CONTENT
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ delay: 1.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-[clamp(2.5rem,8vw,9rem)] font-black leading-[0.95] tracking-[-0.03em] text-white"
              >
                AUTOMATION
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ delay: 1.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-[clamp(2.5rem,8vw,9rem)] font-black leading-[0.95] tracking-[-0.03em] text-primary"
              >
                POWERED BY AI
              </motion.h1>
            </div>
          </div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0, duration: 0.8 }}
            className="mt-10 md:mt-16 text-base md:text-lg text-muted-foreground font-light max-w-md leading-relaxed"
          >
            Entertainment content, automated end-to-end.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.6 }}
            className="mt-12 md:mt-16"
          >
            <button
              onClick={handleGetStarted}
              className="group inline-flex items-center gap-4 text-sm tracking-[0.15em] font-medium text-white/60 hover:text-white transition-colors duration-300"
            >
              <span className="border border-white/20 group-hover:border-primary group-hover:bg-primary/10 px-8 py-4 rounded-full transition-all duration-300">
                GET STARTED
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>

        {/* Bottom info line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8, duration: 0.6 }}
          className="absolute bottom-8 left-8 md:left-16 right-8 md:right-16 flex items-end justify-between"
        >
          <div className="flex gap-12 text-[10px] md:text-xs tracking-[0.2em] text-muted-foreground font-medium">
            <span>SHORTS</span>
            <span>ANALYTICS</span>
            <span>DOCS</span>
          </div>
          <div className="text-[10px] md:text-xs tracking-[0.2em] text-muted-foreground font-medium">
            © 2026
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;
