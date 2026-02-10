// Map food names to their image paths
export function getFoodImage(name: string): string {
  const lowerName = name.toLowerCase();
  
  // Direct matches
  const imageMap: Record<string, string> = {
    'milk': '/foods/milk.svg',
    'chicken': '/foods/chicken.svg',
    'chicken breast': '/foods/chicken.svg',
    'salmon': '/foods/salmon.svg',
    'fresh salmon': '/foods/salmon.svg',
    'yogurt': '/foods/yogurt.svg',
    'greek yogurt': '/foods/yogurt.svg',
    'eggs': '/foods/eggs.svg',
    'avocado': '/foods/avocado.svg',
    'avocados': '/foods/avocado.svg',
    'tomato': '/foods/tomatoes.svg',
    'tomatoes': '/foods/tomatoes.svg',
    'bread': '/foods/bread.svg',
    'whole wheat bread': '/foods/bread.svg',
    'cheese': '/foods/cheese.svg',
    'cheddar': '/foods/cheese.svg',
    'cheddar cheese': '/foods/cheese.svg',
    'mozzarella': '/foods/mozzarella.svg',
    'fresh mozzarella': '/foods/mozzarella.svg',
    'orange juice': '/foods/orange-juice.svg',
    'juice': '/foods/orange-juice.svg',
    'rice': '/foods/rice.svg',
    'brown rice': '/foods/rice.svg',
    'white rice': '/foods/rice.svg',
    'spinach': '/foods/spinach.svg',
    'fresh spinach': '/foods/spinach.svg',
    'peas': '/foods/peas.svg',
    'frozen peas': '/foods/peas.svg',
    'green peas': '/foods/peas.svg',
  };

  // Check for exact match
  if (imageMap[lowerName]) {
    return imageMap[lowerName];
  }

  // Check for partial matches
  for (const [key, value] of Object.entries(imageMap)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      return value;
    }
  }

  // Default placeholder
  return '/recipe-placeholder.svg';
}

// Get recipe image based on title
export function getRecipeImage(title: string): string {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('pasta')) return '/foods/pasta.svg';
  if (lowerTitle.includes('taco')) return '/foods/tacos.svg';
  if (lowerTitle.includes('stir fry') || lowerTitle.includes('stir-fry')) return '/foods/stir-fry.svg';
  if (lowerTitle.includes('salmon')) return '/foods/salmon.svg';
  if (lowerTitle.includes('yogurt') || lowerTitle.includes('parfait')) return '/foods/yogurt.svg';
  if (lowerTitle.includes('salad') && lowerTitle.includes('chicken')) return '/foods/chicken.svg';
  if (lowerTitle.includes('avocado')) return '/foods/avocado.svg';
  if (lowerTitle.includes('chicken')) return '/foods/chicken.svg';
  if (lowerTitle.includes('egg')) return '/foods/eggs.svg';
  if (lowerTitle.includes('tomato')) return '/foods/tomatoes.svg';
  if (lowerTitle.includes('bread')) return '/foods/bread.svg';
  if (lowerTitle.includes('cheese')) return '/foods/cheese.svg';
  if (lowerTitle.includes('mozzarella')) return '/foods/mozzarella.svg';
  if (lowerTitle.includes('rice')) return '/foods/rice.svg';
  if (lowerTitle.includes('juice') || lowerTitle.includes('orange')) return '/foods/orange-juice.svg';
  if (lowerTitle.includes('spinach')) return '/foods/spinach.svg';
  if (lowerTitle.includes('peas')) return '/foods/peas.svg';
  
  return '/recipe-placeholder.svg';
}
