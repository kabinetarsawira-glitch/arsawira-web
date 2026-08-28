import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const letters = "ARSAWIRA".split("");

export default function OpeningScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShow(false);
    }, 3200);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="opening-screen"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: "-4%",
          }}
          transition={{
            duration: 0.7,
            ease: [0.76, 0, 0.24, 1],
          }}
        >
          <div
            className="opening-orbit"
            aria-hidden="true"
          />

          <motion.div
            className="opening-logo-wrapper"
            initial={{
              scale: 0.5,
              opacity: 0,
              rotate: -10,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              rotate: 0,
            }}
            transition={{
              duration: 0.9,
              ease: "easeOut",
            }}
          >
            <img
              src="/branding/logo-arsawira.png"
              alt="ARSAWIRA"
              className="opening-logo"
            />
          </motion.div>

          <div
            className="opening-word"
            aria-label="ARSAWIRA"
          >
            {letters.map((letter, index) => (
              <motion.span
                key={`${letter}-${index}`}
                initial={{
                  y: 28,
                  opacity: 0,
                  filter: "blur(8px)",
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                  filter: "blur(0px)",
                }}
                transition={{
                  delay: 0.58 + index * 0.08,
                  duration: 0.55,
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          <motion.p
            className="opening-subtitle"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 1.45,
              duration: 0.6,
            }}
          >
            CREATIVE SERVICE • KOMINFO
          </motion.p>

          <div className="opening-progress">
            <motion.div
              className="opening-progress-bar"
              initial={{
                scaleX: 0,
              }}
              animate={{
                scaleX: 1,
              }}
              transition={{
                delay: 1.2,
                duration: 1.55,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}