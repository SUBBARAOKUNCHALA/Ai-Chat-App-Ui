import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { login } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await login({ email, password });
      loginUser(res.data);
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #020617, #000)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {/* Animated Card */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "35px",
          borderRadius: "18px",
          background: "rgba(2,6,23,0.9)",
          border: "1px solid #1e293b",
          boxShadow: "0 0 40px rgba(99,102,241,0.25)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "26px",
            fontWeight: "700",
            color: "#e5e7eb",
          }}
        >
          Welcome Back
        </motion.h2>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <InputField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Error */}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                color: "#f87171",
                fontSize: "14px",
                marginTop: "10px",
              }}
            >
              {error}
            </motion.p>
          )}

          {/* Button */}
          <motion.button
            type="submit"
            whileHover={{
              y: -3,
              boxShadow: "0 0 25px rgba(99,102,241,0.6)",
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "20px",
              borderRadius: "12px",
              border: "1px solid #334155",
              background: "#020617",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>

          {/* Register Link */}
          <p
            style={{
              marginTop: "18px",
              fontSize: "14px",
              textAlign: "center",
              color: "#94a3b8",
            }}
          >
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/")}
              style={{
                color: "#6366f1",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Create one
            </span>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

/* ===========================
   Animated Input Component
=========================== */

function InputField({ label, type, value, onChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      style={{ marginBottom: "15px" }}
    >
      <label
        style={{
          fontSize: "14px",
          color: "#94a3b8",
          marginBottom: "5px",
          display: "block",
        }}
      >
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        required
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          background: "#020617",
          border: "1px solid #334155",
          color: "#fff",
          outline: "none",
        }}
      />
    </motion.div>
  );
}
