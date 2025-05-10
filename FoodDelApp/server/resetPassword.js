const mongoose = require("mongoose");
const User = require("./models/User");

const MONGO_URI = "mongodb://localhost:27017/fooddelivery"; // Replace with your actual MongoDB URI

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function resetPassword(username, newPassword) {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log("User not found");
      return;
    }
    user.password = newPassword; // Assign plain password, pre-save hook will hash it
    await user.save();
    console.log(`Password reset for user ${username}`);
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

// Replace "Prince" and "Test1234" with your actual username and desired new password
resetPassword("Arman", "miya");
//   console.log("Account deleted successfully");
//   console.error("Error deleting account:", err);