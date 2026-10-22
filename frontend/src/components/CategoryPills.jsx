import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CategoryPills({
  categories,
  selectedCategory,
  onSelectCategory
}) {
  const containerRef = useRef(null);

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="category-pills-bar">
      <button
        className="pill-scroll-btn left"
        onClick={() => scroll('left')}
        aria-label="Scroll categories left"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="pills-scroll-container" ref={containerRef}>
        {categories.map((category) => (
          <button
            key={category}
            className={`pill-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <button
        className="pill-scroll-btn right"
        onClick={() => scroll('right')}
        aria-label="Scroll categories right"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
