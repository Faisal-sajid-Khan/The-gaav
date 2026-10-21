import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function ProductGallery({ images }) {
  const [current, setCurrent] = useState(0);
  const [zoomPos, setZoomPos] = useState(null);
  const imageList = images?.edges?.map((e) => e.node) || [];

  if (imageList.length === 0) {
    return (
      <div className="aspect-square bg-surface-high rounded-xl flex items-center justify-center">
        <span className="text-on-surface-variant">No image</span>
      </div>
    );
  }

  const next = () => {
    setZoomPos(null);
    setCurrent((prev) => (prev + 1) % imageList.length);
  };

  const prev = () => {
    setZoomPos(null);
    setCurrent((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const handleSelectImage = (index) => {
    setZoomPos(null);
    setCurrent(index);
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomPos({ x, y });
  };

  return (
    <>
      <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-6">
        {imageList.length > 1 && (
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto no-scrollbar lg:w-20 shrink-0">
            {imageList.map((img, i) => (
              <button 
                key={i} 
                onClick={() => handleSelectImage(i)} 
                className={`shrink-0 w-16 h-16 lg:w-full lg:aspect-square rounded-lg overflow-hidden border-2 transition-colors ${i === current ? 'border-primary' : 'border-transparent'}`}
              >
                <img src={img.url} alt={img.altText || `Thumb ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        )}

        <div 
          className="relative flex-1 aspect-square bg-surface-high rounded-xl overflow-hidden cursor-default group"
          onMouseEnter={handleMouseMove}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setZoomPos(null)}
        >
          {/* Base image */}
          <img 
            src={imageList[current].url} 
            alt={imageList[current].altText || 'Product'} 
            className="w-full h-full object-cover" 
            loading="eager" 
          />

          {imageList.length > 1 && (
            <>
              <button 
                onClick={prev} 
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-surface/80 rounded-full flex items-center justify-center text-primary hover:bg-surface transition-colors opacity-0 group-hover:opacity-100 z-10"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={next} 
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-surface/80 rounded-full flex items-center justify-center text-primary hover:bg-surface transition-colors opacity-0 group-hover:opacity-100 z-10"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            {imageList.map((_, i) => (
              <button 
                key={i} 
                onClick={() => handleSelectImage(i)} 
                aria-label={`Go to image ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-primary w-4' : 'bg-outline-variant'}`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Nike-style Full Height Zoom Overlay (Desktop only) */}
      {zoomPos && (
        <div 
          className="hidden lg:block fixed top-24 bottom-8 right-20 z-40 bg-surface rounded-xl overflow-hidden shadow-2xl pointer-events-none transition-opacity duration-200"
          style={{
            left: 'calc(50% + 24px)', // Covers the entire right column area
            backgroundImage: `url(${imageList[current].url})`,
            backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
            backgroundSize: '250%',
            backgroundRepeat: 'no-repeat'
          }}
        />
      )}
    </>
  );
}

export default ProductGallery;
