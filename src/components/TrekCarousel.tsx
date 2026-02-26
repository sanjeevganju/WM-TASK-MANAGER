import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface TrekCarouselProps {
  treks: string[];
  selectedIndex: number;
  onSelectTrek: (index: number) => void;
}

export function TrekCarousel({ treks, selectedIndex, onSelectTrek }: TrekCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.scrollWidth / treks.length;
      scrollRef.current.scrollTo({
        left: itemWidth * index,
        behavior: 'smooth'
      });
    }
    onSelectTrek(index);
  };

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      scrollToIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex < treks.length - 1) {
      scrollToIndex(selectedIndex + 1);
    }
  };

  const handleScroll = () => {
    checkScroll();
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const itemWidth = scrollRef.current.scrollWidth / treks.length;
      const newIndex = Math.round(scrollLeft / itemWidth);
      if (newIndex !== selectedIndex) {
        onSelectTrek(newIndex);
      }
    }
  };

  return (
    <div className="relative w-full">
      {/* Left Arrow */}
      <button
        onClick={handlePrevious}
        disabled={selectedIndex === 0}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg transition-all ${
          selectedIndex === 0
            ? 'opacity-30 cursor-not-allowed'
            : 'opacity-90 hover:opacity-100 hover:scale-110 active:scale-95'
        }`}
        aria-label="Previous trek"
      >
        <ChevronLeft className="size-6 text-emerald-600" />
      </button>

      {/* Carousel Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex gap-4 px-12">
          {treks.map((trek, index) => (
            <div
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`flex-shrink-0 w-[calc(100%-4rem)] snap-center transition-all duration-300 cursor-pointer ${
                index === selectedIndex
                  ? 'scale-100 opacity-100'
                  : 'scale-90 opacity-40'
              }`}
            >
              <div
                className={`p-6 rounded-xl text-center transition-all duration-300 ${
                  index === selectedIndex
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xl'
                    : 'bg-white text-gray-600 shadow-md'
                }`}
              >
                <h3 className={`${index === selectedIndex ? 'text-white' : 'text-gray-800'}`}>
                  {trek}
                </h3>
                {index === selectedIndex && (
                  <div className="mt-2 h-1 w-16 bg-white/50 rounded-full mx-auto" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Arrow */}
      <button
        onClick={handleNext}
        disabled={selectedIndex === treks.length - 1}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg transition-all ${
          selectedIndex === treks.length - 1
            ? 'opacity-30 cursor-not-allowed'
            : 'opacity-90 hover:opacity-100 hover:scale-110 active:scale-95'
        }`}
        aria-label="Next trek"
      >
        <ChevronRight className="size-6 text-emerald-600" />
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {treks.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? 'w-8 bg-emerald-600'
                : 'w-2 bg-gray-300'
            }`}
            aria-label={`Go to ${treks[index]}`}
          />
        ))}
      </div>
    </div>
  );
}
