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

/* ─────────────────────────────────────────────────────────────────
   ACCORDION ITEM
───────────────────────────────────────────────────────────────── */
function AccordionItem({ id, title, Icon, children, open, onToggle }) {
  return (
    <div className="border-b border-outline-variant">
      <button
        onClick={() => onToggle(id)}
        onMouseDown={(e) => e.preventDefault()}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="flex items-center gap-2.5">
          <Icon size={15} strokeWidth={1.75} className="text-gold" />
          <span className="label-sm text-primary group-hover:text-gold transition-colors">
            {title}
          </span>
        </span>
        <ChevronDown
          size={15}
          strokeWidth={2}
          className={`text-outline transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* CSS grid-rows trick: animates height without layout-reflow scroll */}
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
  const [openAccordion, setOpenAccordion]     = useState('description');

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

  /* ── Read metafields from product ── */
  const ingredientMeta = product.ingredient_meta;   // custom / ingredient
  const directionMeta  = product.direction_meta;    // custom / direction_to_use

  const toggleAccordion = (id) =>
    setOpenAccordion((prev) => (prev === id ? null : id));

  return (
    <>
      <style>{descriptionStyles}</style>

      <div className="space-y-5">

        {/* Vendor / Product Type */}
        {(product.vendor || product.productType) && (
          <div className="flex items-center gap-2 flex-wrap">
            {product.vendor && (
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-outline">
                {product.vendor}
              </span>
            )}
            {product.vendor && product.productType && (
              <span className="text-outline-variant">·</span>
            )}
            {product.productType && (
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-outline">
                {product.productType}
              </span>
            )}
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={13} className="text-gold fill-gold" />
            ))}
          </div>
          <span className="text-xs text-on-surface-variant font-medium">4.9</span>
          <span className="text-xs text-outline">(124 reviews)</span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl text-primary font-bold leading-tight">
          {product.title}
        </h1>

        {/* Short tagline — first sentence */}
        {product.description && (
          <p className="text-sm text-on-surface-variant leading-relaxed border-l-2 border-gold pl-3 italic">
            {product.description.split('.')[0]}.
          </p>
        )}

        {/* Price */}
        <div>
          <div className="flex items-end gap-3 flex-wrap">
            <span className="font-sans font-bold text-3xl text-primary">
              ₹{Number(price).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
            </span>
            {compare > price && (
              <>
                <span className="text-base text-outline line-through pb-0.5">
                  ₹{Number(compare).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                </span>
                <span className="text-xs font-black bg-success/10 text-success px-2.5 py-1 rounded-full">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>
          <p className="text-xs text-outline mt-1">Inclusive of all taxes</p>
        </div>

        {/* Tags */}
        {product.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 border border-outline-variant rounded-full text-[11px] font-semibold text-on-surface-variant tracking-wide"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="h-px bg-outline-variant/50" />

        {/* Variant Options */}
        {options.filter((o) => o.values.length > 1).map((option) => (
          <div key={option.name}>
            <p className="text-sm font-semibold text-primary mb-3">
              {option.name}:&nbsp;
              <span className="text-on-surface-variant font-normal">
                {selectedVariant?.selectedOptions?.find((o2) => o2.name === option.name)?.value}
              </span>
            </p>
            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const v          = variants.find((vr) => vr.selectedOptions?.some((o2) => o2.name === option.name && o2.value === value));
                const isSelected = selectedVariant?.selectedOptions?.some((o2) => o2.name === option.name && o2.value === value);
                const available  = v?.availableForSale;
                return (
                  <button
                    key={value}
                    onClick={() => available && setSelectedVariant(v)}
                    disabled={!available}
                    className={`min-w-[56px] px-4 py-2.5 text-sm rounded-lg border transition-all duration-200 ${
                      isSelected
                        ? 'border-primary bg-primary text-on-primary font-semibold shadow-sm'
                        : available
                        ? 'border-outline-variant text-on-surface hover:border-primary hover:text-primary'
                        : 'border-outline-variant/40 text-outline/50 cursor-not-allowed line-through bg-surface-low'
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Quantity + CTA */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-outline-variant rounded-xl overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-11 h-12 flex items-center justify-center text-primary hover:bg-surface-high transition-colors"
            >
              <Minus size={14} strokeWidth={2.5} />
            </button>
            <span className="w-10 text-center text-sm font-bold text-primary select-none">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-11 h-12 flex items-center justify-center text-primary hover:bg-surface-high transition-colors"
            >
              <Plus size={14} strokeWidth={2.5} />
            </button>
          </div>

          <button
            onClick={handleAdd}
            disabled={adding || !selectedVariant?.availableForSale}
            className="flex-1 h-12 border-2 border-primary text-primary font-bold text-sm tracking-[0.1em] uppercase rounded-xl hover:bg-primary hover:text-on-primary transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {adding
              ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
              : 'Add to Cart'}
          </button>

          <button
            onClick={handleAdd}
            disabled={adding || !selectedVariant?.availableForSale}
            className="flex-1 h-12 bg-primary text-on-primary font-bold text-sm tracking-[0.1em] uppercase rounded-xl hover:bg-[#4a2e10] transition-all duration-200 disabled:opacity-40 shadow-md shadow-primary/20"
          >
            Buy Now
          </button>
        </div>

        {/* Stock indicator */}
        {selectedVariant && (
          <p className={`text-xs font-semibold flex items-center gap-1.5 -mt-1 ${
            selectedVariant.availableForSale ? 'text-success' : 'text-error'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              selectedVariant.availableForSale ? 'bg-success' : 'bg-error'
            }`} />
            {selectedVariant.availableForSale ? 'In stock' : 'Currently out of stock'}
          </p>
        )}

        {/* Trust strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-outline-variant/50">
          {TRUST_ICONS.map(({ Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 text-center">
              <Icon size={18} strokeWidth={1.5} className="text-primary" />
              <span className="text-[10px] font-semibold text-outline tracking-wide uppercase leading-tight">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* ── ACCORDIONS ──────────────────────────────────────────── */}
        <div>

          {/* 1. Description — full Shopify descriptionHtml */}
          <AccordionItem
            id="description"
            title="Description"
            Icon={BookOpen}
            open={openAccordion === 'description'}
            onToggle={toggleAccordion}
          >
            {product.descriptionHtml ? (
              <div
                className="prose-shopify"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            ) : (
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {product.description || 'No description available.'}
              </p>
            )}
          </AccordionItem>

          {/* 2. Ingredients — from custom / ingredient metafield */}
          <AccordionItem
            id="ingredients"
            title="Ingredients"
            Icon={FlaskConical}
            open={openAccordion === 'ingredients'}
            onToggle={toggleAccordion}
          >
            {ingredientMeta?.value
              ? renderMetaValue(ingredientMeta.value, ingredientMeta.type)
              : (
                <p className="text-sm text-outline italic">
                  Ingredients not added yet. Go to Shopify Admin → Products → [this product] → Metafields → Ingredient.
                </p>
              )
            }
          </AccordionItem>

          {/* 3. Directions to Use — from custom / direction_to_use metafield */}
          <AccordionItem
            id="directions"
            title="Directions to Use"
            Icon={Leaf}
            open={openAccordion === 'directions'}
            onToggle={toggleAccordion}
          >
            {directionMeta?.value
              ? renderMetaValue(directionMeta.value, directionMeta.type)
              : (
                <p className="text-sm text-outline italic">
                  Directions not added yet. Go to Shopify Admin → Products → [this product] → Metafields → Direction to use.
                </p>
              )
            }
          </AccordionItem>

        </div>
      </div>
    </>
  );
}

export default ProductDetails;
