import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../../store/cartSlice';
import { openCartDrawer } from '../../store/uiSlice';
import {
  Minus, Plus, Star, ChevronDown, ShieldCheck,
  Truck, RotateCcw, Leaf, FlaskConical, BookOpen,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────
   SCOPED CSS – Shopify rich-text HTML styling
───────────────────────────────────────────────────────────────── */
const descriptionStyles = `
  .prose-shopify h1,.prose-shopify h2,.prose-shopify h3,.prose-shopify h4 {
    font-family: 'Libre Caslon Text', Georgia, serif;
    color: #603d16; margin-top: 1.1em; margin-bottom: 0.4em;
    line-height: 1.3; font-weight: 700;
  }
  .prose-shopify h2 { font-size: 1.1rem; }
  .prose-shopify h3 { font-size: 1rem; }
  .prose-shopify p {
    color: #50453b; font-size: 0.875rem;
    line-height: 1.75; margin-bottom: 0.75em;
  }
  .prose-shopify ul {
    list-style: none; padding: 0; margin: 0.5em 0 1em;
    display: flex; flex-direction: column; gap: 0.45em;
  }
  .prose-shopify ul li {
    position: relative; padding-left: 1.5em;
    color: #50453b; font-size: 0.875rem; line-height: 1.65;
  }
  .prose-shopify ul li::before {
    content: ''; position: absolute; left: 0; top: 0.58em;
    width: 6px; height: 6px; border-radius: 50%; background: #d9a441;
  }
  .prose-shopify ol {
    padding-left: 1.4em; margin: 0.5em 0 1em;
    display: flex; flex-direction: column; gap: 0.4em;
  }
  .prose-shopify ol li { color: #50453b; font-size: 0.875rem; line-height: 1.65; }
  .prose-shopify strong { color: #603d16; font-weight: 700; }
  .prose-shopify em { color: #7b542b; }
  .prose-shopify a { color: #603d16; text-decoration: underline; text-underline-offset: 2px; }
  .prose-shopify hr { border-color: #efe5d5; margin: 1em 0; }
`;

/* ─────────────────────────────────────────────────────────────────
   renderMetaValue — smart renderer for any Shopify metafield type
   Handles: plain text · multi-line text · JSON list · HTML
───────────────────────────────────────────────────────────────── */
function renderMetaValue(value, type) {
  if (!value) return null;

  // JSON array  →  gold bullet list
  if (value.trimStart().startsWith('[')) {
    try {
      const items = JSON.parse(value);
      if (Array.isArray(items) && items.length > 0) {
        return (
          <ul className="prose-shopify">
            {items.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        );
      }
    } catch { /* fall through */ }
  }

  // HTML string  →  styled prose block
  if (type === 'rich_text_field' || /<\/?[a-z]/i.test(value)) {
    return <div className="prose-shopify" dangerouslySetInnerHTML={{ __html: value }} />;
  }

  // Plain / multi-line text  →  preserve line breaks
  return (
    <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
      {value}
    </p>
  );
}

/* ─────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────── */
const TRUST_ICONS = [
  { Icon: ShieldCheck, label: '100% Authentic'     },
  { Icon: Leaf,        label: 'Cruelty Free'        },
  { Icon: Truck,       label: 'Free Shipping ₹999+' },
  { Icon: RotateCcw,   label: 'Easy Returns'        },
];

import { productCopy } from './productCopy';

/* ─────────────────────────────────────────────────────────────────
   ACCORDION ITEM
───────────────────────────────────────────────────────────────── */
function AccordionItem({ id, title, Icon, children, open, onToggle }) {
  return (
    <div className="border-b border-outline-variant/40">
      <button
        onClick={() => onToggle(id)}
        onMouseDown={(e) => e.preventDefault()}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="flex items-center gap-2.5">
          {Icon && <Icon size={16} strokeWidth={1.5} className="text-primary" />}
          <span className="text-sm font-serif font-bold text-primary group-hover:text-primary-container transition-colors">
            {title}
          </span>
        </span>
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className={`text-outline transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.3s ease',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div className="pb-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   PRODUCT DETAILS
───────────────────────────────────────────────────────────────── */
function ProductDetails({ product }) {
  const dispatch = useDispatch();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity]               = useState(1);
  const [adding, setAdding]                   = useState(false);
  const [openAccordion, setOpenAccordion]     = useState('ingredients');

  const variants = product.variants?.edges?.map((e) => e.node) || [];
  const options  = product.options || [];

  React.useEffect(() => {
    if (variants.length > 0 && !selectedVariant) {
      setSelectedVariant(variants.find((v) => v.availableForSale) || variants[0]);
    }
  }, [variants, selectedVariant]);

  const handleAdd = async () => {
    if (!selectedVariant?.availableForSale) return;
    try {
      setAdding(true);
      await dispatch(addItemToCart({ variantId: selectedVariant.id, quantity })).unwrap();
      dispatch(openCartDrawer());
    } catch (err) { console.error(err); }
    finally { setAdding(false); }
  };

  const price    = parseFloat(selectedVariant?.price?.amount    || product.priceRange?.minVariantPrice?.amount    || 0);
  const compare  = parseFloat(selectedVariant?.compareAtPrice?.amount || product.compareAtPriceRange?.minVariantPrice?.amount || 0);
  const discount = compare > price ? Math.round(((compare - price) / compare) * 100) : 0;

  const toggleAccordion = (id) => setOpenAccordion((prev) => (prev === id ? null : id));

  // Determine which copy to use based on the product handle
  const handleMap = {
    'utane': 'utane',
    'nikhar': 'nikhar',
    'nirmal': 'nirmal',
    'kanti': 'kanti'
  };
  const key = handleMap[product.handle?.toLowerCase()];
  const fallbackCopy = key ? productCopy[key] : null;

  // Helper to get from Shopify metafield OR fallback hardcoded copy
  const getMeta = (metaKey, fallbackKey) => {
    return product[metaKey]?.value || fallbackCopy?.[fallbackKey || metaKey];
  };

  const lidLine = getMeta('lidLine');
  const shortDescription = getMeta('shortDescription');
  const longDescription = product.description || fallbackCopy?.longDescription;
  const story = getMeta('storyBlock', 'story');
  const benefits = getMeta('benefitsList', 'benefits');
  const fragrance = getMeta('fragranceNote', 'fragrance');
  const ingredients = getMeta('fullIngredients', 'ingredients');
  const suitability = getMeta('suitability'); // They might add this later

  return (
    <>
      <style>{descriptionStyles}</style>
      <div className="space-y-6">
        {/* Brand Tagline */}
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-outline">
          Village Wisdom / Modern Care
        </p>

        {/* Title */}
        <div className="pt-1">
          {fallbackCopy?.accentHex && (
            <div className="w-12 h-1.5 rounded-full mb-3" style={{ backgroundColor: fallbackCopy.accentHex }} />
          )}
          <h1 className="font-serif text-3xl sm:text-4xl text-primary font-bold leading-tight -mt-1">
            {product.title}
          </h1>
        </div>

        {/* Short Description (Hero) */}
        {shortDescription && (
          <p className="text-[15px] text-on-surface-variant leading-relaxed whitespace-pre-line">
            {shortDescription}
          </p>
        )}

        {/* Price & Weight */}
        <div>
          <div className="flex items-end gap-3 flex-wrap">
            <span className="font-sans font-semibold text-2xl text-primary">
              ₹{Number(price).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
            </span>
            {discount > 0 && (
              <>
                <span className="text-base text-outline-variant line-through pb-[3px]">
                  ₹{Number(compare).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                </span>
                <span className="text-xs font-medium bg-success/10 text-success px-2 py-1 rounded pb-[4px]">
                  {discount}% OFF
                </span>
              </>
            )}
            <span className="text-sm text-outline-variant font-medium pb-1">| 100 g</span>
          </div>
          <p className="text-[11px] text-outline mt-1 tracking-wide">Inclusive of all taxes</p>
        </div>

        <div className="h-px bg-outline-variant/30" />

        {/* Quantity + CTA */}
        <div className="flex items-center gap-3 pt-2">
          <div className="flex items-center border border-outline-variant rounded-none overflow-hidden h-12">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-full flex items-center justify-center text-primary hover:bg-surface-high transition-colors"
            >
              <Minus size={14} strokeWidth={2} />
            </button>
            <span className="w-8 text-center text-sm font-semibold text-primary select-none">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-12 h-full flex items-center justify-center text-primary hover:bg-surface-high transition-colors"
            >
              <Plus size={14} strokeWidth={2} />
            </button>
          </div>

          <button
            onClick={handleAdd}
            disabled={adding || !selectedVariant?.availableForSale}
            className="flex-1 h-12 bg-primary text-on-primary font-bold text-sm tracking-[0.1em] uppercase hover:bg-primary-container transition-all duration-200 disabled:opacity-40"
          >
            {adding
              ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
              : 'Add to Cart'}
          </button>
        </div>

        {/* Long description (Rich text from Shopify or Fallback) */}
        <div className="pt-6">
          {product.descriptionHtml ? (
            <div 
              className="prose-shopify"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} 
            />
          ) : longDescription ? (
            <p className="text-sm text-on-surface-variant leading-loose whitespace-pre-line">
              {longDescription}
            </p>
          ) : null}
        </div>

      {/* The Story Block */}
      {story && (
        <div className="bg-gaav-cream p-6 my-8 border-l-2 border-primary">
          <p className="text-sm text-primary font-serif leading-relaxed whitespace-pre-line italic">
            "{story}"
          </p>
        </div>
      )}

      {/* Purity Promise */}
      <div className="bg-gaav-sand/40 p-5 rounded-sm my-6">
        <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-primary mb-2">The Purity Promise</p>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          We never use animal fat, synthetic colours, parabens or sulphates.<br />
          Only honest ingredients that are kind to you and the planet.
        </p>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-2 py-4 border-y border-outline-variant/30">
        {[
          'Gentle & Nourishing',
          'Pure Fragrance',
          'Naturally Moisturising',
          'Suitable for all Skin Types'
        ].map((label) => (
          <div key={label} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-outline shrink-0" />
            <span className="text-[11px] font-medium text-on-surface-variant tracking-wide leading-tight">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* ── ACCORDIONS ──────────────────────────────────────────── */}
      <div className="pt-4">
        
        {benefits && (
          <AccordionItem
            id="benefits"
            title="Benefits"
            open={openAccordion === 'benefits'}
            onToggle={toggleAccordion}
          >
            {Array.isArray(benefits) ? (
              <ul className="flex flex-col gap-2">
                {benefits.map((benefit, i) => (
                  <li key={i} className="text-sm text-on-surface-variant leading-relaxed flex items-start gap-2">
                    <span className="text-primary mt-1">•</span> {benefit}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
                {benefits}
              </p>
            )}
          </AccordionItem>
        )}

        {fragrance && (
          <AccordionItem
            id="fragrance"
            title="Fragrance Note"
            open={openAccordion === 'fragrance'}
            onToggle={toggleAccordion}
          >
            <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
              {fragrance}
            </p>
          </AccordionItem>
        )}

        {ingredients && (
          <AccordionItem
            id="ingredients"
            title="Full Ingredients"
            open={openAccordion === 'ingredients'}
            onToggle={toggleAccordion}
          >
            <p className="text-[13px] text-on-surface-variant leading-relaxed whitespace-pre-line">
              {ingredients}
            </p>
          </AccordionItem>
        )}

        {suitability && (
          <AccordionItem
            id="suitability"
            title="Who It's For"
            open={openAccordion === 'suitability'}
            onToggle={toggleAccordion}
          >
            <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
              {suitability}
            </p>
          </AccordionItem>
        )}

        <AccordionItem
          id="specs"
          title="Specifications"
          open={openAccordion === 'specs'}
          onToggle={toggleAccordion}
        >
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
            <div className="text-outline">Net weight</div><div className="text-on-surface-variant">100 g</div>
            <div className="text-outline">MRP</div><div className="text-on-surface-variant">₹149 (inclusive of all taxes)</div>
            <div className="text-outline">Unit sale price</div><div className="text-on-surface-variant">₹1.49 per g</div>
            <div className="text-outline">Shelf life</div><div className="text-on-surface-variant">36 months from date of manufacture</div>
            <div className="text-outline">Soap base</div><div className="text-on-surface-variant">Goat Milk</div>
            <div className="text-outline">Country of origin</div><div className="text-on-surface-variant">India</div>
            <div className="text-outline">Mfg licence</div><div className="text-on-surface-variant">MH/105462</div>
          </div>
        </AccordionItem>

        <AccordionItem
          id="legal"
          title="Legal & Contact"
          open={openAccordion === 'legal'}
          onToggle={toggleAccordion}
        >
          <div className="text-[11px] text-on-surface-variant leading-relaxed space-y-3 font-mono">
            <p>
              <strong>Manufactured by:</strong><br />
              Ketaki Industries, 553 Dhamangaon, Saphale, Palghar 401102, Maharashtra<br />
              Mfg. Lic. No.: MH/105462 | GMP & ISO 9001:2015
            </p>
            <p>
              <strong>Marketed by:</strong><br />
              FN Ayurnidhi Lifescience Company<br />
              Apt. No. 503 B, ANP Retreat, Bhumkar Chowk, Pune 411057, Maharashtra
            </p>
            <p>
              <strong>For feedback and enquiries:</strong><br />
              Customer Care: +91 94527 28268<br />
              Email: fnayurnidhilsc@gmail.com<br />
              Instagram: <a href="https://www.instagram.com/thegaav/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline decoration-outline-variant underline-offset-2">@thegaav</a>
            </p>
            <p className="italic pt-2">Made with Love in India</p>
          </div>
        </AccordionItem>

      </div>
    </div>
    </>
  );
}

export default ProductDetails;
