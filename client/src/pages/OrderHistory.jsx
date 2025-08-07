import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { getFoodAsset } from "../utils/foodAssets";

export default function OrderHistory({ token }) {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order history");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token, API_BASE_URL]);

  if (loading) {
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
          <p className="text-emerald-600 text-xl font-medium">Loading your orders...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
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
              Your Order History
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center space-x-2 mt-3 sm:mt-4"
            >
              <span className="text-emerald-600">Total Orders:</span>
              <span className="font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full text-sm sm:text-base">
                {orders?.length || 0}
              </span>
            </motion.div>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-8 py-6 sm:py-8">
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

            {/* Empty State */}
            {!orders?.length && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center py-12"
              >
                <div className="mb-6 text-5xl sm:text-6xl text-emerald-300">📭</div>
                <p className="text-lg sm:text-xl text-emerald-600 font-medium">No orders yet</p>
                <p className="text-emerald-500 mt-2">Your future orders will appear here</p>
              </motion.div>
            )}

            {/* Orders List */}
            {orders?.length > 0 && (
              <div className="space-y-4 sm:space-y-6">
                <AnimatePresence>
                  {orders.map((order) => (
                    <motion.div
                      key={order?._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.01 }}
                      className="bg-white rounded-xl p-4 sm:p-6 border border-emerald-100 hover:border-emerald-200 transition-all duration-300 shadow-sm"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <motion.div 
                            whileHover={{ rotate: 10 }}
                            className="bg-emerald-100 p-2 sm:p-3 rounded-lg"
                          >
                            <img 
                              src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=40&auto=format&fit=crop" 
                              alt="Burger" 
                              className="w-6 h-6 sm:w-8 sm:h-8 object-cover rounded"
                            />
                          </motion.div>
                          <div>
                            <p className="font-semibold text-emerald-800 text-sm sm:text-base">Order #{order?._id?.slice(-8).toUpperCase()}</p>
                            <p className="text-xs sm:text-sm text-emerald-600">
                              {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Date not available'}
                            </p>
                          </div>
                        </div>
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className={`mt-2 sm:mt-0 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
                            order?.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 
                            order?.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                            'bg-yellow-100 text-yellow-600'
                          }`}
                        >
                          {order?.status || 'Processing'}
                        </motion.div>
                      </div>

                      {/* Order Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                        <motion.div 
                          whileHover={{ y: -2 }}
                          className="bg-emerald-50 p-3 sm:p-4 rounded-lg border border-emerald-100"
                        >
                          <p className="text-xs sm:text-sm text-emerald-600 mb-1 flex items-center">
                            <span className="mr-1 sm:mr-2">🏠</span>
                            Delivery Address
                          </p>
                          <p className="font-medium text-emerald-800 text-sm sm:text-base">{order?.address || 'Address not available'}</p>
                        </motion.div>

                        <motion.div 
                          whileHover={{ y: -2 }}
                          className="bg-emerald-50 p-3 sm:p-4 rounded-lg border border-emerald-100"
                        >
                          <p className="text-xs sm:text-sm text-emerald-600 mb-1 flex items-center">
                            <span className="mr-1 sm:mr-2">💰</span>
                            Total Amount
                          </p>
                          <p className="font-bold text-emerald-700 text-lg sm:text-xl">
                            ₹{order?.totalAmount?.toFixed(2) || '00.00'}
                          </p>
                        </motion.div>
                      </div>

                      {/* Order Items */}
                      <div className="border-t border-emerald-100 pt-3 sm:pt-4">
                        <h3 className="text-xs sm:text-sm font-semibold text-emerald-600 mb-2 sm:mb-3">Items Ordered</h3>
                        <div className="space-y-2 sm:space-y-3">
                          {order?.items?.map((item, index) => {
                            const foodItem = item.foodId || {};
                            const asset = getFoodAsset(foodItem);
                            const imageUrl = foodItem.image 
                              ? foodItem.image.startsWith('http') 
                                ? foodItem.image 
                                : `${API_BASE_URL}${foodItem.image}`
                              : asset.defaultImage;
                            
                            return (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ x: 5 }}
                                className="flex items-center justify-between p-2 sm:p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-100"
                              >
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                  <img 
                                    src={imageUrl}
                                    alt={foodItem.name || 'Food Item'} 
                                    className="w-6 h-6 sm:w-8 sm:h-8 object-cover rounded"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = asset.defaultImage;
                                    }}
                                  />
                                  <span className="font-medium text-emerald-800 text-sm sm:text-base">
                                    {foodItem.name || 'Unknown Item'}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <p className="text-emerald-700 text-sm sm:text-base">
                                    ₹{foodItem.price ? foodItem.price.toFixed(2) : '00.00'}
                                  </p>
                                  <p className="text-xs sm:text-sm text-emerald-600">Qty: {item.quantity || 1}</p>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
        {/* Footer */}
            <div className="text-center text-xs text-emerald-500 py-4">
              copyright © 2025 FoodBites. All rights reserved.<br />
              Made with ❤️ by Devansh Jaiswal...
            </div>
      </div>
    </div>
  );
}
