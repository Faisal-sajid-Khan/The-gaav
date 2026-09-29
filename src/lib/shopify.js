const DOMAIN = process.env.REACT_APP_SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.REACT_APP_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = process.env.REACT_APP_SHOPIFY_API_VERSION || '2026-04';
const ENDPOINT = `https://${DOMAIN}/api/${API_VERSION}/graphql.json`;

async function shopifyFetch(query, variables = {}) {
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();
    if (json.errors) throw new Error(json.errors[0].message);
    return json;
  } catch (error) { console.error('Shopify Error:', error); throw error; }
}

export async function getAllProducts(first = 50) {
  const query = `query GetProducts($first: Int!) @inContext(country: IN) {
    products(first: $first) {
      edges {
        node {
          id title handle description descriptionHtml
          availableForSale
          priceRange {
            minVariantPrice { amount currencyCode }
            maxVariantPrice { amount currencyCode }
          }
          compareAtPriceRange {
            minVariantPrice { amount currencyCode }
          }
          images(first: 5) {
            edges { node { url altText width height } }
          }
          variants(first: 10) {
            edges {
              node {
                id title availableForSale
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
                image { url altText }
              }
            }
          }
          tags vendor productType
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }`;
  return shopifyFetch(query, { first });
}

export async function getProductByHandle(handle) {
  const query = `query GetProduct($handle: String!) @inContext(country: IN) {
    product(handle: $handle) {
      id title handle description descriptionHtml
      availableForSale
      priceRange {
        minVariantPrice { amount currencyCode }
        maxVariantPrice { amount currencyCode }
      }
      compareAtPriceRange {
        minVariantPrice { amount currencyCode }
      }
      images(first: 10) {
        edges { node { url altText width height } }
      }
      variants(first: 20) {
        edges {
          node {
            id title availableForSale
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            image { url altText }
            selectedOptions { name value }
          }
        }
      }
      options { name values }
      collections(first: 5) {
        edges { node { title handle } }
      }
      tags vendor productType
      seo { title description }

      # ── Metafields (custom namespace, keys set in Shopify Admin) ──
      ingredient_meta: metafield(namespace: "custom", key: "ingredient") {
        value type
      }
      direction_meta: metafield(namespace: "custom", key: "direction_to_use") {
        value type
      }
    }
  }`;
  return shopifyFetch(query, { handle });
}

export async function getAllCollections(first = 20) {
  const query = `query GetCollections($first: Int!) @inContext(country: IN) {
    collections(first: $first) {
      edges {
        node {
          id title handle description descriptionHtml
          image { url altText }
          isConcern: metafield(namespace: "custom", key: "is_concern") {
            value
          }
          products(first: 4) {
            edges {
              node {
                id title handle
                priceRange { minVariantPrice { amount currencyCode } }
                images(first: 1) { edges { node { url altText } } }
              }
            }
          }
        }
      }
    }
  }`;
  return shopifyFetch(query, { first });
}

export async function getProductsByCollection(handle, first = 50) {
  const query = `query GetCollectionProducts($handle: String!, $first: Int!) @inContext(country: IN) {
    collection(handle: $handle) {
      id title description descriptionHtml
      image { url altText }
      products(first: $first) {
        edges {
          node {
            id title handle description
            availableForSale
            priceRange { minVariantPrice { amount currencyCode } }
            compareAtPriceRange { minVariantPrice { amount currencyCode } }
            images(first: 3) { edges { node { url altText } } }
            variants(first: 5) {
              edges { node { id title availableForSale price { amount currencyCode } } }
            }
          }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  }`;
  return shopifyFetch(query, { handle, first });
}

export async function createCart(items = []) {
  const query = `mutation cartCreate($input: CartInput!) @inContext(country: IN) {
    cartCreate(input: $input) {
      cart {
        id checkoutUrl createdAt updatedAt
        lines(first: 50) {
          edges {
            node {
              id quantity
              merchandise {
                ... on ProductVariant {
                  id title
                  product { id title handle featuredImage { url altText } }
                  price { amount currencyCode }
                }
              }
              cost { totalAmount { amount currencyCode } }
            }
          }
        }
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount { amount currencyCode }
          totalTaxAmount { amount currencyCode }
        }
      }
      userErrors { field message }
    }
  }`;
  return shopifyFetch(query, {
    input: {
      buyerIdentity: { countryCode: 'IN' },
      lines: items.map(item => ({ merchandiseId: item.variantId, quantity: item.quantity }))
    }
  });
}

export async function getCart(cartId) {
  const query = `query getCart($cartId: ID!) @inContext(country: IN) {
    cart(id: $cartId) {
      id checkoutUrl createdAt updatedAt
      lines(first: 50) {
        edges {
          node {
            id quantity
            merchandise {
              ... on ProductVariant {
                id title
                product { id title handle featuredImage { url altText } }
                price { amount currencyCode }
              }
            }
            cost { totalAmount { amount currencyCode } }
            attributes { key value }
          }
        }
      }
      cost {
        subtotalAmount { amount currencyCode }
        totalAmount { amount currencyCode }
        totalTaxAmount { amount currencyCode }
      }
    }
  }`;
  return shopifyFetch(query, { cartId });
}

export async function addToCart(cartId, items) {
  const query = `mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) @inContext(country: IN) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id checkoutUrl
        lines(first: 50) {
          edges {
            node {
              id quantity
              merchandise {
                ... on ProductVariant {
                  id title
                  product { id title handle featuredImage { url altText } }
                  price { amount currencyCode }
                }
              }
              cost { totalAmount { amount currencyCode } }
            }
          }
        }
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount { amount currencyCode }
        }
      }
      userErrors { field message }
    }
  }`;
  return shopifyFetch(query, {
    cartId,
    lines: items.map(item => ({ merchandiseId: item.variantId, quantity: item.quantity }))
  });
}

export async function updateCartLine(cartId, lineId, quantity) {
  const query = `mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) @inContext(country: IN) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 50) {
          edges {
            node {
              id quantity
              merchandise {
                ... on ProductVariant {
                  id title
                  product { id title handle featuredImage { url altText } }
                  price { amount currencyCode }
                }
              }
              cost { totalAmount { amount currencyCode } }
            }
          }
        }
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount { amount currencyCode }
        }
      }
      userErrors { field message }
    }
  }`;
  return shopifyFetch(query, { cartId, lines: [{ id: lineId, quantity }] });
}

export async function removeFromCart(cartId, lineIds) {
  const query = `mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) @inContext(country: IN) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        lines(first: 50) {
          edges {
            node {
              id quantity
              merchandise {
                ... on ProductVariant {
                  id title
                  product { id title handle featuredImage { url altText } }
                  price { amount currencyCode }
                }
              }
              cost { totalAmount { amount currencyCode } }
            }
          }
        }
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount { amount currencyCode }
        }
      }
      userErrors { field message }
    }
  }`;
  return shopifyFetch(query, { cartId, lineIds });
}

/* ──────────────────────────────────────────────────────────────────
   CUSTOMER & ACCOUNTS
────────────────────────────────────────────────────────────────── */

export async function customerCreate(firstName, lastName, email, password) {
  const mutation = `mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer { id firstName lastName email }
      customerUserErrors { code field message }
    }
  }`;
  return shopifyFetch(mutation, { input: { firstName, lastName, email, password } });
}

export async function customerAccessTokenCreate(email, password) {
  const mutation = `mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken { accessToken expiresAt }
      customerUserErrors { code field message }
    }
  }`;
  return shopifyFetch(mutation, { input: { email, password } });
}

export async function getCustomerData(customerAccessToken) {
  const query = `query getCustomerData($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id firstName lastName email phone
      defaultAddress { address1 address2 city province zip country }
      orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id orderNumber processedAt fulfillmentStatus financialStatus
            currentTotalPrice { amount currencyCode }
            lineItems(first: 10) {
              edges {
                node {
                  title quantity
                  variant { image { url altText } }
                }
              }
            }
          }
        }
      }
    }
  }`;
  return shopifyFetch(query, { customerAccessToken });
}

export async function customerUpdate(customerAccessToken, customer) {
  const mutation = `mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer { id firstName lastName email phone }
      customerUserErrors { code field message }
    }
  }`;
  return shopifyFetch(mutation, { customerAccessToken, customer });
}

export default shopifyFetch;
