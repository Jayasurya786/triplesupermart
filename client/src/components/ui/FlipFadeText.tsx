import { useEffect, useState, useMemo, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/utils/cn"

interface FlipFadeTextProps {
  words?: string[]
  interval?: number
  className?: string
  textClassName?: string
  letterDuration?: number
  staggerDelay?: number
  exitStaggerDelay?: number
  size?: "sm" | "md" | "lg" | "xl"
}

const defaultWords = ["LOYALTY", "REWARDS", "SAVINGS", "ENGAGEMENT", "EXPERIENCE"]

const sizeClasses = {
  sm: "text-2xl md:text-3xl",
  md: "text-3xl md:text-4xl",
  lg: "text-4xl md:text-5xl",
  xl: "text-5xl md:text-6xl lg:text-7xl",
}

const Letter = memo(function Letter({ 
  char, 
  letterDuration 
}: { 
  char: string
  letterDuration: number 
}) {
  return (
    <motion.span
      style={{ transformStyle: "preserve-3d" }}
      variants={{
        initial: {
          rotateX: 90,
          y: 20,
          opacity: 0,
          filter: "blur(8px)",
        },
        animate: {
          rotateX: 0,
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          transition: {
            duration: letterDuration,
            ease: [0.2, 0.65, 0.3, 0.9],
          },
        },
        exit: {
          rotateX: -90,
          y: -20,
          opacity: 0,
          filter: "blur(8px)",
          transition: {
            duration: letterDuration * 0.67,
            ease: "easeIn",
          },
        },
      }}
      className="inline-block"
    >
      {char}
    </motion.span>
  )
})

const Word = memo(function Word({ 
  text, 
  staggerDelay, 
  exitStaggerDelay, 
  letterDuration,
  textClassName,
  sizeClass
}: { 
  text: string
  staggerDelay: number
  exitStaggerDelay: number
  letterDuration: number
  textClassName?: string
  sizeClass: string
}) {
  const letters = useMemo(() => text.split(""), [text])

  return (
    <motion.div
      className={cn(
        "flex gap-[0.15em] font-display font-bold uppercase tracking-wider",
        sizeClass,
        textClassName
      )}
      style={{
        color: "#2aa369",
      }}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        initial: { opacity: 1 },
        animate: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
        exit: {
          opacity: 1,
          transition: {
            staggerChildren: exitStaggerDelay,
          },
        },
      }}
    >
      {letters.map((char, i) => (
        <Letter 
          key={`${text}-${i}`} 
          char={char} 
          letterDuration={letterDuration} 
        />
      ))}
    </motion.div>
  )
})

export function FlipFadeText({
  words = defaultWords,
  interval = 2500,
  className,
  textClassName,
  letterDuration = 0.6,
  staggerDelay = 0.08,
  exitStaggerDelay = 0.05,
  size = "lg",
}: FlipFadeTextProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length)
    }, interval)
    return () => clearInterval(timer)
  }, [interval, words.length])

  const currentWord = words[index]
  const sizeClass = sizeClasses[size]

  return (
    <div className={cn("flex items-center justify-center min-h-[100px] md:min-h-[120px]", className)}>
      <div style={{ perspective: "1000px", width: "100%" }}>
        <AnimatePresence mode="wait">
          <Word 
            key={currentWord} 
            text={currentWord} 
            staggerDelay={staggerDelay}
            exitStaggerDelay={exitStaggerDelay}
            letterDuration={letterDuration}
            textClassName={textClassName}
            sizeClass={sizeClass}
          />
        </AnimatePresence>
      </div>
    </div>
  )
}

export default FlipFadeText
