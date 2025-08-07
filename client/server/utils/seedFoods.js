require('dotenv').config({ path: '../.env' });

const mongoose = require('mongoose');
const Food = require('../models/Food');

const foods = [
  // Italian
  {
    name: 'Pizza Margherita',
    price: 10,
    description: 'Classic pizza with tomato, mozzarella, and basil',
    image: 'https://example.com/images/pizza-margherita.jpg',
    cuisine: 'Italian',
    restaurant: 'Pizza Palace',
  },
  {
    name: 'Lasagna',
    price: 12,
    description: 'Layered pasta with meat sauce and cheese',
    image: 'https://example.com/images/lasagna.jpg',
    cuisine: 'Italian',
    restaurant: 'Pasta House',
  },
  {
    name: 'Risotto',
    price: 11,
    description: 'Creamy risotto with mushrooms',
    image: 'https://example.com/images/risotto.jpg',
    cuisine: 'Italian',
    restaurant: 'Trattoria Roma',
  },

  // American
  {
    name: 'Cheeseburger',
    price: 8,
    description: 'Juicy beef burger with cheese, lettuce, and tomato',
    image: 'https://example.com/images/cheeseburger.jpg',
    cuisine: 'American',
    restaurant: 'Burger Barn',
  },
  {
    name: 'BBQ Ribs',
    price: 15,
    description: 'Slow-cooked ribs with BBQ sauce',
    image: 'https://example.com/images/bbq-ribs.jpg',
    cuisine: 'American',
    restaurant: 'Grill House',
  },
  {
    name: 'Fried Chicken',
    price: 9,
    description: 'Crispy fried chicken with spices',
    image: 'https://example.com/images/fried-chicken.jpg',
    cuisine: 'American',
    restaurant: 'Chicken Shack',
  },

  // Mexican
  {
    name: 'Tacos Al Pastor',
    price: 7,
    description: 'Marinated pork tacos with pineapple',
    image: 'https://example.com/images/tacos-al-pastor.jpg',
    cuisine: 'Mexican',
    restaurant: 'Taco Town',
  },
  {
    name: 'Enchiladas',
    price: 9,
    description: 'Corn tortillas rolled with chicken and covered in chili sauce',
    image: 'https://example.com/images/enchiladas.jpg',
    cuisine: 'Mexican',
    restaurant: 'Casa Mexicana',
  },
  {
    name: 'Guacamole',
    price: 5,
    description: 'Fresh avocado dip with lime and cilantro',
    image: 'https://example.com/images/guacamole.jpg',
    cuisine: 'Mexican',
    restaurant: 'Taco Town',
  },

  // Japanese
  {
    name: 'Salmon Sushi',
    price: 12,
    description: 'Fresh salmon sushi rolls',
    image: 'https://example.com/images/salmon-sushi.jpg',
    cuisine: 'Japanese',
    restaurant: 'Sushi Central',
  },
  {
    name: 'Ramen',
    price: 10,
    description: 'Noodle soup with pork and vegetables',
    image: 'https://example.com/images/ramen.jpg',
    cuisine: 'Japanese',
    restaurant: 'Ramen House',
  },
  {
    name: 'Tempura',
    price: 9,
    description: 'Battered and fried shrimp and vegetables',
    image: 'https://example.com/images/tempura.jpg',
    cuisine: 'Japanese',
    restaurant: 'Sushi Central',
  },

  // Indian
  {
    name: 'Butter Chicken',
    price: 11,
    description: 'Creamy butter chicken with spices',
    image: 'https://example.com/images/butter-chicken.jpg',
    cuisine: 'Indian',
    restaurant: 'Curry House',
  },
  {
    name: 'Palak Paneer',
    price: 9,
    description: 'Spinach and cottage cheese curry',
    image: 'https://example.com/images/palak-paneer.jpg',
    cuisine: 'Indian',
    restaurant: 'Spice Villa',
  },
  {
    name: 'Biryani',
    price: 13,
    description: 'Spiced rice with meat and vegetables',
    image: 'https://example.com/images/biryani.jpg',
    cuisine: 'Indian',
    restaurant: 'Biryani House',
  },
];

async function seedFoods() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB for seeding foods');

    await Food.deleteMany({});
    console.log('Cleared existing foods');

    await Food.insertMany(foods);
    console.log('Seeded foods successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding foods:', error);
    process.exit(1);
  }
}

seedFoods();
