import 'react-tooltip/dist/react-tooltip.css'
import { useState } from "react";
import { CartProvider } from "./context/CartContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import OrderHistory from "./pages/OrderHistory";
import Foods from "./pages/Foods";
import Navbar from "./components/Navbar";
import OAuthSuccess from "./pages/OAuthSuccess";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <CartProvider>
      <Router>
        {token && <Navbar />}
        <Routes>
          <Route
            path="/login"
            element={!token ? <Login setToken={setToken} /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!token ? <Register /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={token ? <Home token={token} setToken={setToken} /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={token ? <Profile token={token} /> : <Navigate to="/login" />}
          />
          <Route
            path="/cart"
            element={token ? <Cart token={token} /> : <Navigate to="/login" />}
          />
          <Route
            path="/orders"
            element={token ? <OrderHistory token={token} /> : <Navigate to="/login" />}
          />
          <Route
            path="/foods"
            element={token ? <Foods /> : <Navigate to="/login" />}
          />
          <Route
            path="/oauth-success"
            element={<OAuthSuccess setToken={setToken} />}
          />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
