"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface CarouselItem {
  id: number
  title: string
  description?: string
  isCorrect?: boolean
}

interface CarouselProps {
  items: CarouselItem[]
  autoRotate?: boolean
  onSelect?: (item: CarouselItem) => void
  showAura?: boolean
  className?: string;
}

export function Carousel({ items, autoRotate = true, onSelect, showAura = false, className }: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(1)
  const [visibleItems, setVisibleItems] = useState<CarouselItem[]>([])

  const updateVisibleItems = useCallback(() => {
    const itemCount = items.length
    const prev = (activeIndex - 1 + itemCount) % itemCount
    const next = (activeIndex + 1) % itemCount
    setVisibleItems([items[prev], items[activeIndex], items[next]])
  }, [activeIndex, items])

  useEffect(() => {
    updateVisibleItems()
  }, [updateVisibleItems])

  useEffect(() => {
    if (autoRotate) {
      let rotationTimer: NodeJS.Timeout;

      const resetTimer = () => {
        clearTimeout(rotationTimer);
        rotationTimer = setTimeout(() => {
          setActiveIndex((current) => (current + 1) % items.length);
        }, 5000);
      };

      resetTimer(); // Initial timer setup on component mount

      const nextButton = document.querySelector('.carousel-container button:nth-of-type(2)'); // Select next button
      const prevButton = document.querySelector('.carousel-container button:nth-of-type(1)'); // Select prev button


      const handleUserActivity = () => {
        resetTimer();
      };

      nextButton?.addEventListener('click', handleUserActivity);
      prevButton?.addEventListener('click', handleUserActivity);


      return () => {
        clearTimeout(rotationTimer);
        nextButton?.removeEventListener('click', handleUserActivity);
        prevButton?.removeEventListener('click', handleUserActivity);
      };
    }
  }, [autoRotate, items.length]);


  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % items.length);
  }

  const handlePrev = () => {
    setActiveIndex((current) => (current - 1 + items.length) % items.length);
  }

  return (
    <div className="carousel-container relative w-full mx-auto h-64">
      <div className="flex justify-center items-center h-full">
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
        >
          ←
        </button>
        <div className="flex gap-4 items-center" style={{ gap: '40px' }}> {/* Increased gap */}
          <AnimatePresence initial={false}>
            {visibleItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  zIndex: index === 1 ? 1 : 0,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 60,
                  damping: 10,
                }}
                className={`carousel-item p-6 rounded-xl bg-white/80 border border-white/50 shadow-2xl backdrop-blur-sm flex flex-col items-center justify-around drop-shadow-md \${
                  index === 1 ? "active" : ""
                } \${
                  showAura && item.isCorrect !== undefined
                    ? item.isCorrect
                      ? "ring-2 ring-green-500/50"
                      : "ring-2 ring-red-500/50"
                    : ""
                }`}
              >
                <h3 className="text-xl font-bold text-black text-center drop-shadow-md">{item.title}</h3>
                {item.description && <p className="mt-2 text-sm text-black/80 text-center">{item.description}</p>}
                {index === 1 && onSelect && (
                  <button
                    onClick={() => onSelect(item)}
                    className="mt-4 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-black"
                  >
                    Select
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
        >
          →
        </button>
      </div>
    </div>
  )
}
