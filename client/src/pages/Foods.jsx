import React, { useState, useEffect, useContext, useRef, useMemo, useCallback } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import { getFoodAsset } from "../utils/foodAssets";

const FoodCard = React.memo(({ food, index, highlightedId, loadingId, handleAddToCart }) => (
  <motion.div
    key={food.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: 1, 
      y: 0,
      borderColor: highlightedId === food.id ? '#059669' : '#d1fae5'
    }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    className={`bg-white rounded-xl shadow-md overflow-hidden border-2 ${
      highlightedId === food.id ? 'border-emerald-400' : 'border-emerald-100'
    }`}
  >
    <div className="h-40 xs:h-48 sm:h-56 md:h-60 bg-emerald-50 flex items-center justify-center overflow-hidden relative">
      <motion.img 
        src={food.image} 
        alt={food.name}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full w-full object-cover"
        loading="lazy"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = getFoodAsset(food).defaultImage;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-100/70 via-transparent to-transparent" />
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 rounded-full p-1.5 sm:p-2 shadow-sm">
        <span className="text-xl sm:text-2xl">{food.emoji}</span>
      </div>
    </div>
    <div className="p-3 sm:p-4 md:p-5">
      <div className="flex justify-between items-start mb-2 sm:mb-3">
        <div className="flex-1 min-w-0 mr-2">
          <h3 className="text-base sm:text-lg font-semibold text-emerald-800 truncate">
            {food.name}
          </h3>
          <p className="text-emerald-600 text-xs sm:text-sm mt-1 line-clamp-2">
            {food.description || "Delicious food item"}
          </p>
        </div>
        <span className="bg-emerald-100 text-emerald-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
          ₹{food.price}
        </span>
      </div>
      <motion.button
        onClick={() => handleAddToCart(food)}
        disabled={loadingId === food.id}
        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium sm:font-semibold py-2 px-4 rounded-lg text-sm sm:text-base min-h-[44px]"
        whileTap={{ scale: loadingId === food.id ? 1 : 0.95 }}
      >
        {loadingId === food.id ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 rounded-full animate-spin border-t-white" />
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

const FoodList = React.memo(({ foods, highlightedId, loadingId, handleAddToCart, isInitialLoad }) => {
  return (
    <AnimatePresence mode="wait">
      {isInitialLoad ? (
        <div className="col-span-full flex justify-center py-8 sm:py-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full"
          />
        </div>
      ) : foods.length > 0 ? (
        foods.map((food, i) => (
          <FoodCard
            key={food.id}
            food={food}
            index={i}
            highlightedId={highlightedId}
            loadingId={loadingId}
            handleAddToCart={handleAddToCart}
          />
        ))
      ) : (
        <div className="col-span-full text-center py-10">
          <p className="text-emerald-600">No items found. Try a different search.</p>
        </div>
      )}
    </AnimatePresence>
  );
});

const SearchInput = React.memo(({ searchInput, setSearchInput }) => {
  return (
    <div className="mt-3 sm:mt-4 w-full max-w-md mx-auto px-2 sm:px-0">
      <input
        type="text"
        placeholder="Search dishes..."
        className="w-full px-4 py-2.5 rounded-lg border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm sm:text-base text-emerald-700 min-h-[44px]"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
    </div>
  );
});

function Foods() {
  const [foods, setFoods] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [flyingItem, setFlyingItem] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [highlightedId, setHighlightedId] = useState(null);
  const location = useLocation();
  const [searchInput, setSearchInput] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("search") || "";
  });
  const cartRef = useRef(null);
  const navigate = useNavigate();
  const { cart, addToCart } = useContext(CartContext);

  const fetchFoods = useCallback(async () => {
    setIsInitialLoad(true);
    try {
      const params = new URLSearchParams(location.search);
      const cuisine = params.get("cuisine");
      const searchName = params.get("search");
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

      console.log("Fetching foods with cuisine:", cuisine, "search:", searchName);
      
      let url = `${API_BASE_URL}/api/foods`;
      const queryParams = [];
      if (cuisine) queryParams.push(`cuisine=${encodeURIComponent(cuisine)}`);
      if (searchName) queryParams.push(`search=${encodeURIComponent(searchName)}`);
      if (queryParams.length) url += `?${queryParams.join("&")}`;

      console.log("API URL:", url);

      const res = await axios.get(url, {
        timeout: 10000,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });

      const foodsWithAssets = res.data.map(food => {
        const asset = getFoodAsset(food);
        return {
          ...food,
          id: food._id,
          image: food.image ? `${API_BASE_URL}${food.image}` : asset.defaultImage,
          emoji: asset.emoji
        };
      });

      setTimeout(() => {
        setFoods(foodsWithAssets);
        setIsInitialLoad(false);
        
        if (searchName) {
          const matchedFood = foodsWithAssets.find(food => 
            food.name.toLowerCase() === searchName.toLowerCase()
          );
          if (matchedFood) {
            setHighlightedId(matchedFood.id);
            setTimeout(() => {
              document.getElementById(`food-${matchedFood.id}`)?.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
              });
            }, 300);
          }
        }
      }, 300);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to load menu");
      setIsInitialLoad(false);
    }
  }, [location.search]);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

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
      toast.error("Failed to add item to cart");
    } finally {
      setTimeout(() => setFlyingItem(null), 800);
      setLoadingId(null);
    }
  }, [addToCart]);

  const filteredFoods = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const cuisine = params.get("cuisine")?.toLowerCase();

    let filtered = foods;

    if (cuisine) {
      filtered = filtered.filter(food => food.cuisine?.toLowerCase() === cuisine);
    }

    if (!searchInput) return filtered;

    const searchTerm = searchInput.toLowerCase();
    return filtered.filter(food => 
      food.name.toLowerCase().includes(searchTerm) ||
      food.description?.toLowerCase().includes(searchTerm) ||
      food.category?.toLowerCase().includes(searchTerm)
    );
  }, [foods, searchInput, location.search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(location.search);
      if (searchInput) {
        params.set("search", searchInput);
      } else {
        params.delete("search");
      }
      navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput, location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-emerald-50 py-6 sm:py-8 md:py-10 px-3 sm:px-4 md:px-6 lg:px-8 relative">
      <ToastContainer position="bottom-right" autoClose={3000} />
      
      <div className="fixed top-10 sm:top-12 right-3 sm:right-4 z-50" ref={cartRef}>
        <Link to="/cart" className="block p-2">
          <motion.div 
            className="bg-white p-2 sm:p-2.5 rounded-full shadow-md border border-emerald-200"
          >
            <span className="text-lg sm:text-xl">🛒</span>
            {cart.length > 0 && (
              <motion.div 
                className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] xs:text-xs px-1.5 py-0.5 rounded-full"
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
            className="fixed z-50 text-2xl pointer-events-none"
            style={{ left: `${flyingItem.startX}px`, top: `${flyingItem.startY}px` }}
          >
            {flyingItem.emoji}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-4 sm:mb-5 md:mb-6 px-2"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-800 mb-2 sm:mb-3">
            Our Delicious Menu
          </h1>
          <p className="text-emerald-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Discover fresh, healthy meals prepared with love
          </p>
          <SearchInput searchInput={searchInput} setSearchInput={setSearchInput} />
        </motion.div>

        <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-2 sm:px-0">
          <FoodList
            foods={filteredFoods}
            highlightedId={highlightedId}
            loadingId={loadingId}
            handleAddToCart={handleAddToCart}
            isInitialLoad={isInitialLoad && foods.length === 0}
          />
        </div>
      </div>
      {/* Footer */}
            <div className="text-center text-xs text-emerald-500 py-4">
              copyright © 2025 FoodBites. All rights reserved.<br />
              Made with ❤️ by Devansh Jaiswal...
            </div>
    </div>
    
  );
}

export default Foods;