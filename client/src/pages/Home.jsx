import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

export default function Home({ token, setToken }) {
  const [user, setUser] = useState(null);
  const [ordersCount, setOrdersCount] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("food"); // new state for search type
  const [searchResults, setSearchResults] = useState([]);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, ordersRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/orders/my-orders`, {
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
        // Adjust API call based on searchType
        let url = `${import.meta.env.VITE_API_BASE_URL}/api/foods?search=${encodeURIComponent(searchTerm)}`;
        if (searchType === "restaurant") {
          url = `${import.meta.env.VITE_API_BASE_URL}/api/restaurants?search=${encodeURIComponent(searchTerm)}`;
        }
        const res = await axios.get(url);
        setSearchResults(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch search results");
      }
    };
    fetchSearchResults();
  }, [searchTerm, searchType]);

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-100 rounded-full animate-spin" />
          <p className="text-emerald-600 text-base font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm) return;
    // Navigate to Foods page with search and type params
    navigate(`/foods?search=${encodeURIComponent(searchTerm)}&type=${encodeURIComponent(searchType)}`);
  };

  return (
    <div className="min-h-screen bg-green-50 pt-16 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-emerald-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 px-10 py-8 text-center">
            <h1 className="text-2xl font-bold text-emerald-800">
              Welcome{user ? `, ${user.username}` : ""}
            </h1>
            <p className="text-emerald-600 mt-2 text-sm">
              Discover fresh, healthy meals delivered to you
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* Error Message */}
            {error && (
              <div className="mb-8 p-4 bg-red-50 rounded-xl border border-red-100 flex items-center space-x-3">
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
                <span className="text-red-600 font-medium text-sm">{error}</span>
              </div>
            )}

            {/* Search Bar with type selector */}
            <form onSubmit={handleSearchSubmit} className="mb-8">
              <div className="flex flex-col space-y-2 max-w-md mx-auto sm:flex-row sm:space-y-0 sm:space-x-2">
                <input
                  type="text"
                  placeholder="Search for restaurants or cuisines..."
                  className="flex-grow px-4 py-3 bg-white border border-emerald-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-300 transition-all placeholder-emerald-300 text-emerald-700 text-base truncate"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="px-4 py-3 bg-white border border-emerald-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-300 text-emerald-700 text-base"
                >
                  <option value="food">Food</option>
                  <option value="restaurant">Restaurant</option>
                </select> */}
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-all"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Search Results */}
            {searchTerm && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-emerald-800 mb-4">
                  Search Results
                </h3>
                {searchResults.length === 0 ? (
                  <p className="text-emerald-600 text-sm">No results found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {searchResults.map((item) => (
                      <Link
                        key={item._id}
                        to={
                          searchType === "food"
                            ? `/foods?search=${encodeURIComponent(item.name)}&type=food`
                            : `/foods?search=${encodeURIComponent(item.name)}&type=restaurant`
                        }
                        className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm block text-center"
                      >
                        <h4 className="font-semibold text-emerald-700 mb-2 text-sm">
                          {item.name}
                        </h4>
                        {searchType === "food" ? (
                          <>
                            <p className="text-emerald-600 mb-1 text-xs">
                              Cuisine: {item.cuisine}
                            </p>
                            <p className="text-emerald-600 mb-1 text-xs">
                              Restaurant: {item.restaurant}
                            </p>
                          </>
                        ) : (
                          <p className="text-emerald-600 mb-1 text-xs">
                            Location: {item.location || "N/A"}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Navigation Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-sm">
              <div className="group relative block bg-white p-4 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-all duration-300 shadow-sm text-center">
                <Link to="/foods" className="block">
                  <span className="text-4xl font-bold block mb-2 text-emerald-600">
                    🍽️
                  </span>
                  <span className="font-semibold text-emerald-700">Browse Menu</span>
                </Link>
                <div className="absolute top-2 right-2 bg-emerald-100 px-1 py-0.5 rounded-full text-xs text-emerald-700">
                  New Items
                </div>
              </div>

              <div className="group relative block bg-white p-4 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-all duration-300 shadow-sm text-center">
                <Link to="/cart" className="block">
                  <span className="text-4xl font-bold block mb-2 text-emerald-600">
                    🛒
                  </span>
                  <span className="font-semibold text-emerald-700">Your Cart</span>
                  <div className="absolute top-2 right-2 bg-emerald-100 px-1.5 py-0.5 rounded-full text-xs text-emerald-700">
                    {cart.length}
                  </div>
                </Link>
              </div>

              <div className="group relative block bg-white p-4 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-all duration-300 shadow-sm text-center">
                <Link to="/orders" className="block">
                  <span className="text-4xl font-bold block mb-2 text-emerald-600">
                    📦
                  </span>
                  <span className="font-semibold text-emerald-700">Order History</span>
                  <div className="absolute top-2 right-2 bg-emerald-100 px-1.5 py-0.5 rounded-full text-xs text-emerald-700">
                    {ordersCount}
                  </div>
                </Link>
              </div>

              <div className="group relative block bg-white p-4 rounded-xl border border-emerald-100 hover:border-emerald-200 transition-all duration-300 shadow-sm text-center">
                <Link to="/profile" className="block">
                  <span className="text-4xl font-bold block mb-2 text-emerald-600">👤</span>
                  <span className="font-semibold text-emerald-700">Profile</span>
                </Link>
              </div>
            </div>

            {/* Popular Categories */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-emerald-800 mb-4">Popular Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Italian', 'Mexican', 'Japanese', 'Indian'].map((cuisine) => (
                  <div
                    key={cuisine}
                    className="bg-white p-4 rounded-xl border border-emerald-100 text-center shadow-sm cursor-pointer"
                    onClick={() => {
                      window.location.href = `/foods?cuisine=${encodeURIComponent(cuisine)}`;
                    }}
                  >
                    <span className="text-4xl mb-2 inline-block">
                      {cuisine === 'Italian'
                        ? '🍕'
                        : cuisine === 'Mexican'
                        ? '🌮'
                        : cuisine === 'Japanese'
                        ? '🍣'
                        : '🍛'}
                    </span>
                    <p className="font-medium text-emerald-700 text-sm">{cuisine}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-xs text-emerald-500 py-4">
              copyright © 2025 FoodBites. All rights reserved.<br />
              Made with ❤️ by Devansh Jaiswal...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 