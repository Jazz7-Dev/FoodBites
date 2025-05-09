import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const API_BASE_URL = "http://localhost:5000/api";

export default function Profile({ token }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Form state variables
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setUsername(res.data.username);
        setEmail(res.data.email);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    try {
      const res = await axios.put(
        `${API_BASE_URL}/users/profile/password`,
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormSuccess(res.data.message);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to change password");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    try {
      const res = await axios.put(
        `${API_BASE_URL}/users/profile`,
        { username, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormSuccess(res.data.message);
      setUser({ ...user, username, email });
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }
    setFormError("");
    setFormSuccess("");
    try {
      const res = await axios.delete(`${API_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormSuccess(res.data.message);
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to delete account");
    }
  };

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
          <p className="text-emerald-600 text-xl font-medium">Loading your profile...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-emerald-100"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-100 to-emerald-200 px-10 py-8 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-emerald-800"
            >
              My Profile
            </motion.h1>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* Error Message */}
            {(error || formError) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-4 bg-red-50 rounded-xl border border-red-100 flex items-center space-x-3"
              >
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <span className="text-red-600 font-medium">{error || formError}</span>
              </motion.div>
            )}

            {/* Success Message */}
            {formSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-4 bg-green-50 rounded-xl border border-green-100 flex items-center space-x-3"
              >
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span className="text-green-600 font-medium">{formSuccess}</span>
              </motion.div>
            )}

            {/* Profile Info */}
            {user && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-emerald-50 p-6 rounded-xl border border-emerald-100"
                >
                  <h2 className="text-xl font-semibold text-emerald-800 mb-4 flex items-center">
                    <span className="mr-2">👤</span>
                    Personal Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-emerald-600">Username</p>
                      <p className="font-medium text-emerald-800">{user.username}</p>
                    </div>
                    <div>
                      <p className="text-sm text-emerald-600">Email</p>
                      <p className="font-medium text-emerald-800">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-emerald-600">Member Since</p>
                      <p className="font-medium text-emerald-800">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-emerald-50 p-6 rounded-xl border border-emerald-100"
                >
                  <h2 className="text-xl font-semibold text-emerald-800 mb-4 flex items-center">
                    <span className="mr-2">⚙️</span>
                    Account Settings
                  </h2>
                  <div className="space-y-4">
                    <form onSubmit={handleChangePassword} className="space-y-4 mb-6">
                      <h3 className="text-lg font-semibold text-emerald-800 mb-2">Change Password</h3>
                      <input
                        type="password"
                        placeholder="Old Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-emerald-200 rounded-lg"
                        required
                      />
                      <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-emerald-200 rounded-lg"
                        required
                      />
                      <button
                        type="submit"
                        className="w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-2 rounded-lg font-medium transition-all"
                      >
                        Change Password
                      </button>
                    </form>

                    <form onSubmit={handleUpdateProfile} className="space-y-4 mb-6">
                      <h3 className="text-lg font-semibold text-emerald-800 mb-2">Update Profile</h3>
                      <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border border-emerald-200 rounded-lg"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-emerald-200 rounded-lg"
                        required
                      />
                      <button
                        type="submit"
                        className="w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-4 py-2 rounded-lg font-medium transition-all"
                      >
                        Update Profile
                      </button>
                    </form>

                    <button
                      onClick={handleDeleteAccount}
                      className="w-full bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-all"
                    >
                      Delete Account
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
