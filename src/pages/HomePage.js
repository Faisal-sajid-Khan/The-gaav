import React from 'react';
import Hero from '../components/home/Hero';
import FourBars from '../components/home/FourBars';
import DiscoverySet from '../components/home/DiscoverySet';
import WhatsInside from '../components/home/WhatsInside';
import TheFragrance from '../components/home/TheFragrance';
import HowItsMade from '../components/home/HowItsMade';
import OurStory from '../components/home/OurStory';
import Reviews from '../components/home/Reviews';
import TrustStrip from '../components/home/TrustStrip';

function HomePage() {
  return (
    <div className="bg-[#F5EDE0] min-h-screen text-[#3B2314]">
      {/* 1. Hero: "This is not what soap smells like." */}
      <Hero />

      {/* 2. The Four Bars: "Four bars. Four fragrances." */}
      <FourBars />

      {/* 3. Discovery Set: "Try all four. Then pick your one." */}
      <DiscoverySet />

      {/* 4. What's Inside: "No mystery ingredients." */}
      <WhatsInside />

      {/* 5. The Fragrance: "You can't photograph a smell." */}
      <TheFragrance />

      {/* 6. How It's Made: "The slow way, on purpose." */}
      <HowItsMade />

      {/* 7. Our Story: "The woman of the house knew this already." */}
      <OurStory />

      {/* 8. Reviews: "We're new. You'd be among the first." */}
      <Reviews />

      {/* 9. Trust Strip: Free shipping, Cash on delivery, Handmade, WhatsApp */}
      <TrustStrip />
    </div>
  );
}

export default HomePage;
