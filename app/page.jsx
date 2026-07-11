"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight,
  Music,
  Sparkles,
  PlayCircle,
  X,
  User,
  UserPlus,
} from "lucide-react";
import "./globals.css";

// ============================================================
// 1. Floating Particles
// ============================================================
const FloatingParticles = () => {
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    x: (i * 17 + 3) % 100,
    y: (i * 23 + 7) % 100,
    size: (i % 4) + 2,
    delay: (i % 6) * 0.4,
    duration: 12 + (i % 8),
    color: i % 3 === 0 ? "#786BFA" : i % 3 === 1 ? "#29C5FF" : "#FF82C9",
  }));

  return (
    <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: 0.2,
          }}
          animate={{
            y: ["0vh", "-25vh", "0vh"],
            x: ["0vw", "5vw", "0vw"],
            opacity: [0.1, 0.4, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// ============================================================
// 2. Dynamic Island Notification
// ============================================================
const DynamicIsland = ({ notification, onClose }) => {
  useEffect(() => {
    if (notification.show && notification.type !== "loading") {
      const timer = setTimeout(() => onClose(), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  const renderIcon = () => {
    switch (notification.type) {
      case "welcome":
        return <Music className="text-[#786BFA]" size={20} />;
      case "success":
        return <CheckCircle className="text-[#29C5FF]" size={20} />;
      case "error":
        return <XCircle className="text-[#FF453A]" size={20} />;
      case "loading":
        return <Loader2 className="text-[#786BFA] loader-spinner" size={20} />;
      default:
        return <Sparkles className="text-white" size={20} />;
    }
  };

  return (
    <AnimatePresence>
      {notification.show && (
        <motion.div
          className="dynamic-island-wrapper"
          initial={{ y: -100, scale: 0.9, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: -100, scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          style={{ left: "40%" }}
        >
          <div className="dynamic-island">
            <div className="di-icon">{renderIcon()}</div>
            <div className="di-content">
              <div className="di-title">{notification.title}</div>
              <div className="di-message">{notification.message}</div>
            </div>
            <div className="audio-waves">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="wave-bar"></div>
              ))}
            </div>
            <button className="di-close" onClick={onClose}>
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================
// 3. Ripple Effect
// ============================================================
const useRipple = () => {
  const createRipple = (e) => {
    const button = e.currentTarget;
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.classList.add("ripple");
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };
  return createRipple;
};

// ============================================================
// 4. Main Page
// ============================================================
export default function LuxuryLoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMorphing, setIsMorphing] = useState(false);

  const audioRef = useRef(null);
  const createRipple = useRipple();

  const [notification, setNotification] = useState({
    show: false,
    type: "welcome",
    title: "",
    message: "",
  });

  // --- Audio Setup ---
  useEffect(() => {
    audioRef.current = new Audio("/Ost.mp3");
    audioRef.current.loop = false;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // --- Welcome Notification ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotification({
        show: true,
        type: "welcome",
        title: "🎵 Welcome",
        message: "Sign in to continue your journey",
      });
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // --- Play Music ---
  const playMusic = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((err) => console.log("Audio play failed:", err));
    }
  };

  // --- Toggle Auth Mode ---
  const toggleAuthMode = () => {
    if (isMorphing) return;
    setIsMorphing(true);
    setIsLogin(!isLogin);
    setTimeout(() => setIsMorphing(false), 500);
  };

  // --- Handle Login ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setHasError(true);
      setErrorMessage("Please fill in all fields");
      setNotification({
        show: true,
        type: "error",
        title: "❌ Missing Fields",
        message: "Please fill in all fields",
      });
      return;
    }

    setIsSubmitting(true);
    setHasError(false);
    setErrorMessage("");

    setNotification({
      show: true,
      type: "loading",
      title: "🔄 Authenticating...",
      message: "Please wait a moment",
    });

    setTimeout(() => {
      if (password === "error") {
        setHasError(true);
        setErrorMessage("Invalid credentials. Please try again.");
        setIsSubmitting(false);
        setNotification({
          show: true,
          type: "error",
          title: "❌ Invalid Credentials",
          message: "Please check your email and password.",
        });
      } else {
        playMusic();
        setNotification({
          show: true,
          type: "success",
          title: "✅ Login Successful!",
          message: `Welcome back${email ? ", " + email.split("@")[0] : ""}! 🎵`,
        });
        setTimeout(() => setIsSubmitting(false), 2000);
      }
    }, 2500);
  };

  // --- Handle Register ---
  const handleRegister = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setHasError(true);
      setErrorMessage("Please fill in all fields");
      setNotification({
        show: true,
        type: "error",
        title: "❌ Missing Fields",
        message: "Please fill in all fields",
      });
      return;
    }

    setIsSubmitting(true);
    setHasError(false);
    setErrorMessage("");

    setNotification({
      show: true,
      type: "loading",
      title: "🔄 Creating Account...",
      message: "Please wait a moment",
    });

    setTimeout(() => {
      playMusic();
      setNotification({
        show: true,
        type: "success",
        title: "✅ Account Created!",
        message: `Welcome ${name}! 🎵`,
      });
      setTimeout(() => {
        setIsSubmitting(false);
        toggleAuthMode();
      }, 2000);
    }, 2500);
  };

  // --- Animation Variants ---
  const inputVariants = {
    hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { delay: 0.1 * i, duration: 0.4, ease: "easeOut" },
    }),
    exit: (i) => ({
      opacity: 0,
      y: -15,
      filter: "blur(4px)",
      transition: { delay: 0.05 * i, duration: 0.3 },
    }),
  };

  const iconVariants = {
    login: { rotate: 0, scale: 1 },
    register: { rotate: 8, scale: 1.05 },
  };

  // --- Main Content ---
  const quote = "Every beautiful moment deserves a beautiful place.";
  const quoteLetters = quote.split("");
  const subText =
    "Sign in to continue your cinematic journey and explore a world crafted for you.";

  return (
    <>
      {/* Background */}
      <div className="cinematic-bg">
        <div className="glow-orb orb-primary"></div>
        <div className="glow-orb orb-secondary"></div>
        <div className="glow-orb orb-accent"></div>
      </div>
      <div className="noise-overlay"></div>
      <FloatingParticles />

      {/* Notification */}
      <DynamicIsland
        notification={notification}
        onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
      />

      {/* Main Layout */}
      <div className="login-container">
        {/* Left Panel */}
        <div className="left-panel">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              className="brand-logo"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
                  fill="white"
                />
              </svg>
              <span className="brand-text">Sign in</span>
            </motion.div>

            <h1 className="hero-text">
              {quoteLetters.map((letter, index) => (
                <motion.span
                  key={index}
                  style={{ display: "inline-block", whiteSpace: "pre" }}
                  initial={{ opacity: 0, filter: "blur(6px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.3,
                    delay: 0.5 + index * 0.035,
                    ease: "easeOut",
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </h1>

            <motion.p
              className="hero-subtext"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.6 }}
            >
              {subText.split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.02, delay: 2.6 + i * 0.012 }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.p>
          </motion.div>
        </div>

        {/* Right Panel - Card */}
        <div className="right-panel">
          <div className="glass-card">
            {/* Icon - Morphing */}
            <motion.div
              className="icon-wrapper"
              variants={iconVariants}
              animate={isLogin ? "login" : "register"}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 25,
                delay: 0.15,
              }}
            >
              {isLogin ? (
                <PlayCircle size={32} color="white" strokeWidth={1.5} />
              ) : (
                <UserPlus size={32} color="white" strokeWidth={1.5} />
              )}
            </motion.div>

            {/* Title - Morphing */}
            <AnimatePresence mode="wait">
              <motion.h2
                key={isLogin ? "login-title" : "register-title"}
                className="card-title"
                initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {isLogin ? "Sign In" : "Create Account"}
              </motion.h2>
            </AnimatePresence>

            {/* Subtitle */}
            <AnimatePresence mode="wait">
              <motion.p
                key={isLogin ? "login-subtitle" : "register-subtitle"}
                className="card-subtitle"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
              >
                {isLogin ? "Welcome back to your space" : "Create your account"}
              </motion.p>
            </AnimatePresence>

            {/* ===== Login Form ===== */}
            <AnimatePresence mode="popLayout">
              {isLogin ? (
                <motion.form
                  key="login-form"
                  onSubmit={handleLogin}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Email */}
                  <motion.div
                    custom={0}
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="input-group"
                  >
                    <input
                      type="email"
                      className={`glass-input ${hasError ? "error" : ""}`}
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (hasError) {
                          setHasError(false);
                          setErrorMessage("");
                        }
                      }}
                      required
                    />
                    <Mail className="input-icon" size={18} />
                  </motion.div>

                  {/* Password */}
                  <motion.div
                    custom={1}
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="input-group"
                  >
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`glass-input ${hasError ? "error" : ""}`}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (hasError) {
                          setHasError(false);
                          setErrorMessage("");
                        }
                      }}
                      required
                    />
                    <Lock className="input-icon" size={18} />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </motion.div>

                  {/* Error Message */}
                  {errorMessage && (
                    <motion.p
                      className="text-error"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span>⚠️</span> {errorMessage}
                    </motion.p>
                  )}

                  {/* Options */}
                  <motion.div
                    custom={2}
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="options-row"
                  >
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      Remember me
                    </label>
                    <button type="button" className="forgot-link">
                      Forgot Password?
                    </button>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    custom={3}
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <button
                      type="submit"
                      className="btn-primary"
                      onClick={createRipple}
                      disabled={isSubmitting}
                    >
                      <span className="btn-content">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="loader-spinner" size={18} />
                            <span>Signing in...</span>
                          </>
                        ) : (
                          <>
                            <span>Sign In</span>
                            <ArrowRight size={16} />
                          </>
                        )}
                      </span>
                    </button>
                  </motion.div>
                </motion.form>
              ) : (
                /* ===== Register Form ===== */
                <motion.form
                  key="register-form"
                  onSubmit={handleRegister}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Name */}
                  <motion.div
                    custom={0}
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="input-group"
                  >
                    <input
                      type="text"
                      className={`glass-input ${hasError ? "error" : ""}`}
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (hasError) {
                          setHasError(false);
                          setErrorMessage("");
                        }
                      }}
                      required
                    />
                    <User className="input-icon" size={18} />
                  </motion.div>

                  {/* Email */}
                  <motion.div
                    custom={1}
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="input-group"
                  >
                    <input
                      type="email"
                      className={`glass-input ${hasError ? "error" : ""}`}
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (hasError) {
                          setHasError(false);
                          setErrorMessage("");
                        }
                      }}
                      required
                    />
                    <Mail className="input-icon" size={18} />
                  </motion.div>

                  {/* Password */}
                  <motion.div
                    custom={2}
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="input-group"
                  >
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`glass-input ${hasError ? "error" : ""}`}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (hasError) {
                          setHasError(false);
                          setErrorMessage("");
                        }
                      }}
                      required
                    />
                    <Lock className="input-icon" size={18} />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </motion.div>

                  {/* Error Message */}
                  {errorMessage && (
                    <motion.p
                      className="text-error"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span>⚠️</span> {errorMessage}
                    </motion.p>
                  )}

                  {/* Submit Button */}
                  <motion.div
                    custom={3}
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <button
                      type="submit"
                      className="btn-primary"
                      onClick={createRipple}
                      disabled={isSubmitting}
                    >
                      <span className="btn-content">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="loader-spinner" size={18} />
                            <span>Creating Account...</span>
                          </>
                        ) : (
                          <>
                            <span>Create Account</span>
                            <UserPlus size={16} />
                          </>
                        )}
                      </span>
                    </button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* ===== Divider ===== */}
            <div className="divider">Or continue with</div>

            {/* ===== Social Buttons ===== */}
            <div className="social-row">
              <button type="button" className="btn-social">
                <svg width="16" height="16" viewBox="0 0 48 48">
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
                Google
              </button>

              <button type="button" className="btn-social">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Apple
              </button>
            </div>

            {/* ===== Switch Link ===== */}
            <div className="signup-link">
              {isLogin ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={toggleAuthMode}
                    disabled={isMorphing}
                    style={{ opacity: isMorphing ? 0.5 : 1 }}
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={toggleAuthMode}
                    disabled={isMorphing}
                    style={{ opacity: isMorphing ? 0.5 : 1 }}
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ripple style injection */}
    </>
  );
}
