import React from 'react';
import { Truck, CreditCard, ShieldCheck, MessageCircle } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: Truck,
    title: 'Free shipping above ₹499',
    desc: '₹50 flat below that',
  },
  {
    icon: CreditCard,
    title: 'Cash on delivery',
    desc: 'Available across India',
  },
  {
    icon: ShieldCheck,
    title: 'Handmade in Maharashtra',
    desc: 'Cold-processed, small batches',
  },
  {
    icon: MessageCircle,
    title: 'Order on WhatsApp',
    desc: 'A real person replies',
  },
];

function TrustStrip() {
  return (
    <section className="bg-[#F5EDE0] border-t border-[#E3D6C4]">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TRUST_ITEMS.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.title} className="flex items-start gap-4">
                <IconComponent
                  size={24}
                  strokeWidth={1.5}
                  className="text-[#8B6B4A] shrink-0 mt-0.5"
                />
                <div>
                  <div className="font-serif text-base font-semibold text-[#3B2314] mb-1">
                    {item.title}
                  </div>
                  <div className="font-serif text-sm text-[#6B4F35]">
                    {item.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TrustStrip;
