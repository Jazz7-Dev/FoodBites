import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home({ token, setToken }) {
  const [user, setUser] = useState(null);
  const [ordersCount, setOrdersCount] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { cart } = useContext(CartContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, ordersRes] = await Promise.all([
          axios.get("http://localhost:5000/api/users/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/orders/my-orders", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUser(profileRes.data);
        setOrdersCount(ordersRes.data.length);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:5000/api/foods?search=${encodeURIComponent(searchTerm)}`);
        setSearchResults(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch search results");
      }
    };
    fetchSearchResults();
  }, [searchTerm]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
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
          <p className="text-emerald-600 text-xl font-medium">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 pt-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden border border-emerald-100"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 px-10 py-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-emerald-800"
            >
              Welcome{user ? `, ${user.username}` : ""}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-emerald-600 mt-2"
            >
              Discover fresh, healthy meals delivered to you
            </motion.p>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-4 bg-red-50 rounded-xl border border-red-100 flex items-center space-x-3"
              >
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span className="text-red-600 font-medium">{error}</span>
              </motion.div>
            )}

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for restaurants or cuisines..."
                  className="w-full px-4 py-3 bg-white border border-emerald-100 rounded-xl focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all placeholder-emerald-300 text-emerald-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute right-3 top-3 text-emerald-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Search Results */}
            {searchTerm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <h3 className="text-xl font-semibold text-emerald-800 mb-4">
                  Search Results
                </h3>
                {searchResults.length === 0 ? (
                  <p className="text-emerald-600">No results found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {searchResults.map((food) => (
                      <Link
                        key={food._id}
                        to={`/foods?search=${encodeURIComponent(food.name)}`}
                        className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm block"
                      >
                        <h4 className="font-semibold text-emerald-700 mb-2">
                          {food.name}
                        </h4>
                        <p className="text-emerald-600 mb-1">
                          Cuisine: {food.cuisine}
                        </p>
                        <p className="text-emerald-600 mb-1">
                          Restaurant: {food.restaurant}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Navigation Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/foods"
                  className="group relative block bg-white p-6 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-all duration-300 shadow-sm"
                >
                  <div className="text-center">
                    <span className="text-2xl font-bold block mb-2 text-emerald-600">
                      🍽️
                    </span>
                    <span className="font-semibold text-emerald-700">
                      Browse Menu
                    </span>
                  </div>
                  <div className="absolute top-2 right-2 bg-emerald-100 px-2 py-1 rounded-full text-xs text-emerald-700">
                    New Items
                  </div>
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/cart"
                  className="group relative block bg-white p-6 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-all duration-300 shadow-sm"
                >
                  <div className="text-center">
                    <span className="text-2xl font-bold block mb-2 text-emerald-600">
                      🛒
                    </span>
                    <span className="font-semibold text-emerald-700">
                      Your Cart
                    </span>
                    <div className="absolute top-2 right-2 bg-emerald-100 px-2.5 py-1 rounded-full text-sm text-emerald-700">
                      {cart.length}
                    </div>
                  </div>
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/orders"
                  className="group relative block bg-white p-6 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-all duration-300 shadow-sm"
                >
                  <div className="text-center">
                    <span className="text-2xl font-bold block mb-2 text-emerald-600">
                      📦
                    </span>
                    <span className="font-semibold text-emerald-700">
                      Order History
                    </span>
                    <div className="absolute top-2 right-2 bg-emerald-100 px-2.5 py-1 rounded-full text-sm text-emerald-700">
                      {ordersCount}
                    </div>
                  </div>
                </Link>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/profile"
                  className="group relative block bg-white p-6 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-all duration-300 shadow-sm"
                >
                  <div className="text-center">
                    <span className="text-2xl font-bold block mb-2 text-emerald-600">
                      👤
                    </span>
                    <span className="font-semibold text-emerald-700">Profile</span>
                  </div>
                </Link>
              </motion.div>
            </motion.div>

            {/* Popular Categories */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <h3 className="text-xl font-semibold text-emerald-800 mb-4">
                Popular Categories
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Italian', 'Mexican', 'Japanese', 'Indian'].map((cuisine) => (
                  <motion.div
                    key={cuisine}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white p-4 rounded-xl border border-emerald-100 text-center shadow-sm cursor-pointer"
                    onClick={() => {
                      window.location.href = `/foods?cuisine=${encodeURIComponent(cuisine)}`;
                    }}
                  >
                    <span className="text-3xl mb-2 inline-block">
                      {cuisine === 'Italian'
                        ? '🍕'
                        : cuisine === 'Mexican'
                        ? '🌮'
                        : cuisine === 'Japanese'
                        ? '🍣'
                        : '🍛'}
                    </span>
                    <p className="font-medium text-emerald-700">{cuisine}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Logout Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex justify-end"
            >
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-sm"
              >
                Logout
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
