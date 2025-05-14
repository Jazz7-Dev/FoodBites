import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess({ setToken }) {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      setToken(token);
      navigate("/profile");
    } else {
      navigate("/login");
    }
  }, [navigate, setToken]);

  return <div>Logging you in...</div>;
}
