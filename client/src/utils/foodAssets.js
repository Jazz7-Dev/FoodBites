export const FOOD_ASSETS = {
  burger: {
    emoji: "🍔",
    defaultImage: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop",
    variants: {
      cheese: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&auto=format&fit=crop",
      veg: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop",
      chicken: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop",
      gourmet: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop"
    }
  },
  pizza: {
    emoji: "🍕",
    defaultImage: "https://images.unsplash.com/photo-1613564834361-9436948817d1?q=80&w=1943&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    variants: {
      cheese: "https://images.unsplash.com/photo-1601924582975-1a1a1a1a1a1a?w=800&auto=format&fit=crop",
      veg: "https://images.unsplash.com/photo-1601924582976-2b2b2b2b2b2b?w=800&auto=format&fit=crop",
      chicken: "https://images.unsplash.com/photo-1601924582977-3c3c3c3c3c3c?w=800&auto=format&fit=crop",
      gourmet: "https://images.unsplash.com/photo-1601924582978-4d4d4d4d4d4d?w=800&auto=format&fit=crop"
    }
  },
  sushi: {
    emoji: "🍣",
    defaultImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop",
    variants: {
      classic: "https://images.unsplash.com/photo-1546069902-ba9599a7e63d?w=800&auto=format&fit=crop",
      spicy: "https://images.unsplash.com/photo-1546069903-ba9599a7e63e?w=800&auto=format&fit=crop"
    }
  },
  pasta: {
    emoji: "🍝",
    defaultImage: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&auto=format&fit=crop"
  },
  salad: {
    emoji: "🥗",
    defaultImage: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&auto=format&fit=crop"
  },
  dessert: {
    emoji: "🍰",
    defaultImage: "https://images.unsplash.com/photo-1505253210343-1a1a1a1a1a1a?w=800&auto=format&fit=crop"
  },
  drink: {
    emoji: "🍹",
    defaultImage: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop"
  },
  default: {
    emoji: "🍽️",
    defaultImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop"
  }
};

export const KEYWORDS = [
  'burger', 'pizza', 'sushi', 'pasta', 'salad', 
  'dessert', 'drink', 'vegan', 'spicy', 'breakfast',
  'taco', 'burrito', 'curry', 'ramen', 'steak',
  'sandwich', 'noodle', 'rice', 'cake', 'ice cream',
  'smoothie', 'coffee', 'tea', 'seafood', 'fish',
  'soup', 'grill', 'bake', 'fried', 'roast'
];

export const CUISINES = ['indian', 'mexican', 'italian', 'japanese', 'chinese', 'thai', 'french', 'american'];

export const VARIANTS = [
  'cheese', 'chicken', 'veg', 'chocolate', 'vanilla', 
  'spicy', 'sweet', 'sour', 'grilled', 'fried', 
  'baked', 'steamed', 'special', 'classic', 'house',
  'paneer', 'tofu', 'mushroom', 'vegan', 'organic'
];

export function getFoodAsset(food) {
  const category = (food.category || '').toLowerCase();
  const name = (food.name || '').toLowerCase();
  const description = (food.description || '').toLowerCase();

  const findVariantMatch = (assetObj) => {
    if (!assetObj?.variants) return null;
    for (const [variantKey, variantImg] of Object.entries(assetObj.variants)) {
      if (name.includes(variantKey) || description.includes(variantKey)) {
        return { ...assetObj, defaultImage: variantImg };
      }
    }
    return null;
  };

  if (FOOD_ASSETS[category]) {
    const variantMatch = findVariantMatch(FOOD_ASSETS[category]);
    if (variantMatch) return variantMatch;
    return FOOD_ASSETS[category];
  }

  const matchedKeyword = KEYWORDS.find(keyword => name.includes(keyword));
  if (matchedKeyword && FOOD_ASSETS[matchedKeyword]) {
    const variantMatch = findVariantMatch(FOOD_ASSETS[matchedKeyword]);
    if (variantMatch) return variantMatch;
    return FOOD_ASSETS[matchedKeyword];
  }

  const matchedCuisine = CUISINES.find(cuisine =>
    name.includes(cuisine) || category.includes(cuisine) || description.includes(cuisine)
  );
  if (matchedCuisine && FOOD_ASSETS[matchedCuisine]) {
    const variantMatch = findVariantMatch(FOOD_ASSETS[matchedCuisine]);
    if (variantMatch) return variantMatch;
    return FOOD_ASSETS[matchedCuisine];
  }

  const matchedVariant = VARIANTS.find(variant =>
    name.includes(variant) || description.includes(variant)
  );
  if (matchedVariant) {
    for (const [, catAsset] of Object.entries(FOOD_ASSETS)) {
      if (catAsset.variants?.[matchedVariant]) {
        return {
          ...catAsset,
          defaultImage: catAsset.variants[matchedVariant]
        };
      }
    }
  }

  return FOOD_ASSETS.default;
}
