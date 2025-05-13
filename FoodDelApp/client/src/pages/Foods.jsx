import React, { useState, useEffect, useContext, useRef, useMemo, useCallback } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import { 
  FOOD_ASSETS, 
  KEYWORDS, 
  CUISINES, 
  VARIANTS, 
  getFoodAsset 
} from "../utils/foodAssets";

const FoodCard = React.memo(({ food, index, highlightedId, loadingId, handleAddToCart }) => (
  <motion.div
    key={food.id}
    initial={{ opacity: 0, y: 50 }}
    animate={{ 
      opacity: 1, 
      y: 0,
      borderColor: highlightedId === food.id ? '#059669' : '#d1fae5'
    }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ y: -10 }}
    id={`food-${food.id}`}
    className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 transition-colors duration-300 ${
      highlightedId === food.id ? 'border-emerald-400' : 'border-emerald-100'
    }`}
  >
    <div className="h-64 bg-emerald-50 flex items-center justify-center overflow-hidden relative">
      <motion.img 
        src={food.image} 
        alt={food.name}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-full w-full object-cover"
        loading="lazy"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = getFoodAsset(food).defaultImage;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-100/70 via-transparent to-transparent" />
      <div className="absolute top-4 right-4 bg-white/90 rounded-full p-2 shadow-md">
        <span className="text-2xl">{food.emoji}</span>
      </div>
    </div>
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <motion.h3 whileHover={{ x: 2 }} className="text-xl font-semibold text-emerald-800">
            {food.name}
          </motion.h3>
          <p className="text-emerald-600 text-sm mt-2">{food.description || "Delicious food item"}</p>
        </div>
        <motion.span whileHover={{ scale: 1.1 }} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
          ₹{food.price}
        </motion.span>
      </div>
      <motion.button
        onClick={() => handleAddToCart(food)}
        disabled={loadingId === food.id}
        whileHover={{ scale: loadingId === food.id ? 1 : 1.05 }}
        whileTap={{ scale: loadingId === food.id ? 1 : 0.95 }}
        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all relative overflow-hidden disabled:opacity-50"
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-20 transition-opacity" />
        {loadingId === food.id ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin border-t-white" />
            <span>Adding...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <span>+</span>
            <span>Add to Cart</span>
          </div>
        )}
      </motion.button>
    </div>
  </motion.div>
));

function Foods() {
  const [foods, setFoods] = useState([]);
  const [error, setError] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [flyingItem, setFlyingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [highlightedId, setHighlightedId] = useState(null);
  const cartRef = useRef(null);
  const navigate = useNavigate();
  const { cart, addToCart } = useContext(CartContext);
  const location = useLocation();

  const fetchFoods = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams(location.search);
      const cuisine = params.get("cuisine");
      const searchName = params.get("search");
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      
      let url = `${API_BASE_URL}/api/foods`;
      const queryParams = [];
      if (cuisine) queryParams.push(`search=${encodeURIComponent(cuisine)}`);
      if (searchName) queryParams.push(`search=${encodeURIComponent(searchName)}`);
      if (queryParams.length) url += `?${queryParams.join("&")}`;

      const res = await axios.get(url, {
        timeout: 10000,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });

      if (!res.data || !Array.isArray(res.data)) {
        throw new Error("Invalid data format received from server");
      }

      const foodsWithAssets = res.data.map(food => {
        const asset = getFoodAsset(food);
        return {
          ...food,
          id: food._id,
          image: food.image ? `${API_BASE_URL}${food.image}` : asset.defaultImage,
          emoji: asset.emoji
        };
      });

      setFoods(foodsWithAssets);

      if (searchName) {
        const matchedFood = foodsWithAssets.find(food => food.name.toLowerCase() === searchName.toLowerCase());
        if (matchedFood) {
          setHighlightedId(matchedFood.id);
          setTimeout(() => {
            const element = document.getElementById(`food-${matchedFood.id}`);
            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 500);
        }
      }
    } catch (err) {
      let errorMessage = "Failed to load the menu";
      if (err.response) {
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = "Network error - could not connect to server";
      } else {
        errorMessage = err.message || "Request setup error";
      }
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "bottom-right",
        theme: "colored",
        className: "bg-red-500 text-white"
      });
      setFoods([]);
    } finally {
      setIsLoading(false);
    }
  }, [location.search]);

  useEffect(() => {
    fetchFoods();
  }, [location.search, fetchFoods]);

  const handleAddToCart = useCallback(async (food) => {
    setLoadingId(food.id);
    try {
      const itemElement = document.getElementById(`food-${food.id}`);
      if (itemElement) {
        const rect = itemElement.getBoundingClientRect();
        setFlyingItem({
          id: food.id,
          emoji: food.emoji,
          startX: rect.left + rect.width / 2,
          startY: rect.top + rect.height / 2,
          endX: cartRef.current?.getBoundingClientRect().left || 0,
          endY: cartRef.current?.getBoundingClientRect().top || 0
        });
      }
      await new Promise(resolve => setTimeout(resolve, 300));
      addToCart({ ...food, image: food.image });
      toast.success(`${food.name} added to cart!`, {
        position: "bottom-right",
        theme: "colored",
        className: "bg-emerald-500 text-white"
      });
    } catch {
      toast.error("Failed to add item to cart", {
        position: "bottom-right",
        theme: "colored",
        className: "bg-red-500 text-white"
      });
    } finally {
      setTimeout(() => setFlyingItem(null), 800);
      setLoadingId(null);
    }
  }, [addToCart]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center space-y-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-100 rounded-full"
          />
          <p className="text-emerald-600 text-xl font-medium">Loading menu...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div className="fixed top-16 right-6 z-50" ref={cartRef}>
        <Link to="/cart" className="relative group">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white p-3 rounded-full shadow-lg border border-emerald-200"
          >
            <span className="text-emerald-600">🛒</span>
            {cart.length > 0 && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full"
              >
                {cart.length}
              </motion.div>
            )}
          </motion.div>
        </Link>
      </div>
      <AnimatePresence>
        {flyingItem && (
          <motion.div 
            key={`flying-${flyingItem.id}`}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ 
              x: flyingItem.endX - flyingItem.startX,
              y: flyingItem.endY - flyingItem.startY,
              opacity: 0,
              scale: 0.5
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-50 text-3xl pointer-events-none"
            style={{ left: `${flyingItem.startX}px`, top: `${flyingItem.startY}px` }}
          >
            {flyingItem.emoji}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-emerald-800 mb-4">Our Delicious Menu</h1>
          <p className="text-emerald-600 text-lg max-w-2xl mx-auto">
            Discover fresh, healthy meals prepared with love by our expert chefs
          </p>
        </motion.div>
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {foods.map((food, i) => (
            <FoodCard
              key={food.id}
              food={food}
              index={i}
              highlightedId={highlightedId}
              loadingId={loadingId}
              handleAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Foods;