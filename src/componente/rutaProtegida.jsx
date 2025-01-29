import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  
  // Aquí puedes añadir validación del token
  const isAuthenticated = token && validateToken(token); // Implementa `validateToken`

  return isAuthenticated ? children : <Navigate to="/" />;
};

// Opcional: función para validar el token (ejemplo para JWT)
const validateToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const isExpired = payload.exp * 1000 < Date.now();
    return !isExpired;
  } catch (e) {
    return false;
  }
};

export default ProtectedRoute;