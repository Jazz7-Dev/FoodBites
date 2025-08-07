import { useContext, useState } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getFoodAsset } from "../utils/foodAssets";

export default function Cart({ token }) {
  const { 
    cart, 
    clearCart, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal 
  } = useContext(CartContext);
  
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [removingItem, setRemovingItem] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const handleRemoveItem = async (itemId) => {
    setRemovingItem(itemId);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      removeFromCart(itemId);
      toast.success("Item removed from cart");
    } finally {
      setRemovingItem(null);
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    const quantity = Math.max(1, Math.min(99, newQuantity));
    updateQuantity(itemId, quantity);
  };

  const handleClearCart = () => {
    setShowClearModal(true);
  };

  const confirmClearCart = () => {
    clearCart();
    setShowClearModal(false);
    toast.success("Cart cleared successfully");
  };

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      setError("Please enter a valid delivery address");
      return;
    }
    
    setError("");
    setLoading(true);

    try {
      const orderPayload = {
        items: cart.map(item => ({
          foodId: item.id ? item.id.toString() : null,
          quantity: Number(item.quantity)
        })),
        totalAmount: parseFloat(getCartTotal().toFixed(2)),
        address: address.trim()
      };

      await axios.post(
        `${API_BASE_URL}/api/orders`,
        orderPayload,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          } 
        }
      );

      toast.success("Order placed successfully!");
      clearCart();
      setAddress("");
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
        "Failed to place order. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="bottom-right" theme="light" />
      
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-emerald-100"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-100 to-emerald-200 px-6 sm:px-10 py-6 sm:py-8 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-3xl font-bold text-emerald-800"
            >
              Your Shopping Cart
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center space-x-2 mt-3 sm:mt-4"
            >
              <span className="text-emerald-600">Items:</span>
              <span className="font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full text-sm sm:text-base">
                {cart.length}
              </span>
            </motion.div>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-8 py-6 sm:py-8">
            {/* Empty State */}
            {cart.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center py-12"
              >
                <div className="mb-6 text-5xl sm:text-6xl text-emerald-300">🛒</div>
                <p className="text-lg sm:text-xl text-emerald-600 font-medium">Your cart is empty</p>
                <p className="text-emerald-500 mt-2">
                  Explore our <Link to="/foods" className="text-emerald-600 hover:underline">delicious menu</Link>
                </p>
              </motion.div>
            )}

            {/* Cart Items */}
            {cart.length > 0 && (
              <>
                <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                  <AnimatePresence>
                    {cart.map((item) => {
                      const asset = getFoodAsset(item);
                      const imageUrl = item.image 
                        ? item.image.startsWith('http') 
                          ? item.image 
                          : `${API_BASE_URL}${item.image}`
                        : asset.defaultImage;

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white rounded-xl p-4 sm:p-6 border border-emerald-200 hover:border-emerald-300 transition-all duration-300 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                        >
                          {/* Item Image */}
                          <div className="flex items-center space-x-4 flex-1">
                            <motion.img
                              src={imageUrl}
                              alt={item.name}
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
                              loading="lazy"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = asset.defaultImage;
                              }}
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-emerald-800 text-base sm:text-lg">{item.name}</h3>
                              <div className="flex items-center gap-2 mt-2 sm:mt-3">
                                <motion.button
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-100 rounded flex items-center justify-center border border-emerald-200 text-emerald-700"
                                  disabled={item.quantity <= 1}
                                >
                                  -
                                </motion.button>
                                <input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                  className="w-14 sm:w-16 text-center bg-white border border-emerald-200 rounded py-1 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                                  min="1"
                                />
                                <motion.button
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-100 rounded flex items-center justify-center border border-emerald-200 text-emerald-700"
                                >
                                  +
                                </motion.button>
                              </div>
                            </div>
                          </div>

                          {/* Price and Remove */}
                          <div className="text-right ml-0 sm:ml-4 mt-4 sm:mt-0 w-full sm:w-auto">
                            <p className="font-bold text-emerald-700 text-lg sm:text-xl">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                            <motion.button
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={removingItem === item.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-sm text-red-500 hover:text-red-600 mt-2 flex items-center gap-1 justify-end"
                            >
                              {removingItem === item.id ? (
                                <div className="w-4 h-4 border-2 border-red-500/30 rounded-full animate-spin border-t-red-500" />
                              ) : 'Remove'}
                            </motion.button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Total Amount */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex justify-end mb-6 sm:mb-8"
                >
                  <div className="text-right bg-emerald-100 p-4 rounded-xl border border-emerald-200 w-full sm:w-auto">
                    <p className="text-sm text-emerald-600 mb-1">Total Amount</p>
                    <p className="text-2xl sm:text-3xl font-bold text-emerald-800">
                      ₹{getCartTotal().toFixed(2)}
                    </p>
                  </div>
                </motion.div>

                {/* Delivery Address */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mb-6 sm:mb-8"
                >
                  <label className="block text-sm font-medium text-emerald-700 mb-2 sm:mb-3">
                    Delivery Address
                  </label>
                  <textarea
                    placeholder="Enter your delivery address..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-emerald-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all placeholder-emerald-300 text-emerald-700 disabled:bg-emerald-50"
                    rows={3}
                    disabled={loading}
                  />
                </motion.div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 sm:mb-8 p-4 bg-red-50 rounded-xl border border-red-100 flex items-center space-x-3"
                  >
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    <span className="text-red-600 font-medium">{error}</span>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <motion.button
                    onClick={handleClearCart}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-6 py-2.5 border-2 border-emerald-300 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-all w-full sm:w-auto text-center"
                  >
                    Clear Cart
                  </motion.button>
                  <motion.button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.03 }}
                    whileTap={{ scale: loading ? 1 : 0.97 }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 px-6 rounded-xl transition-all relative overflow-hidden disabled:opacity-50 w-full sm:w-auto text-center"
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-20 transition-opacity" />
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin border-t-white" />
                        Processing Order...
                      </div>
                    ) : (
                      "Place Order"
                    )}
                  </motion.button>
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Clear Cart Modal */}
      <AnimatePresence>
        {showClearModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 border border-emerald-100 shadow-xl"
            >
              <h3 className="text-xl font-bold text-emerald-800 mb-4">Clear Cart?</h3>
              <p className="text-emerald-600 mb-6">This will remove all items from your cart.</p>
              <div className="flex justify-end gap-3">
                <motion.button
                  onClick={() => setShowClearModal(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-emerald-600 hover:text-emerald-800"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={confirmClearCart}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Clear All
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Footer */}
            <div className="text-center text-xs text-emerald-500 py-4">
              copyright © 2025 FoodBites. All rights reserved.<br />
              Made with ❤️ by Devansh Jaiswal...
            </div>
    </div>
  );
}
