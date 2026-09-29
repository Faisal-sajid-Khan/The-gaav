import React from 'react';
import Hero from '../components/home/Hero';
import Categories from '../components/home/Categories';
import BestSellers from '../components/home/BestSellers';
import ShopByConcern from '../components/home/ShopByConcern';
import IngredientsSpotlight from '../components/home/IngredientsSpotlight';
import InstagramFeed from '../components/home/InstagramFeed';

function HomePage() {
  return (
    <div>
      <Hero />
      <Categories />
      <BestSellers />
      <ShopByConcern />
      <IngredientsSpotlight />
      <InstagramFeed />
    </div>
  );
}

export default HomePage;
