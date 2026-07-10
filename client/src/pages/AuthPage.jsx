import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { setLogin } from "../redux/state";
import { getApiUrl } from "../config/api";
import { images, roles, site } from "../data/branding";
import "../styles/Auth.scss";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";

  const [step, setStep] = useState("role");
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [profilePreview, setProfilePreview] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      navigate(user.role === "host" ? "/create-listing" : "/", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    return () => {
      if (profilePreview) {
        URL.revokeObjectURL(profilePreview);
      }
    };
  }, [profilePreview]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage" && files?.[0]) {
      setProfilePreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(files[0]);
      });
      setFormData((prev) => ({ ...prev, profileImage: files[0] }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password" || name === "confirmPassword") {
      const nextPassword = name === "password" ? value : formData.password;
      const nextConfirm = name === "confirmPassword" ? value : formData.confirmPassword;
      setPasswordMatch(nextPassword === nextConfirm || nextConfirm === "");
    }
  };

  const redirectAfterAuth = (user) => {
    if (user.role === "host") {
      navigate("/create-listing");
      return;
    }
    navigate("/");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(getApiUrl("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      if (response.status === 200) {
        const loggedIn = await response.json();
        dispatch(setLogin({ user: loggedIn.user, token: loggedIn.token }));
        toast.success("Welcome back!");
        redirectAfterAuth(loggedIn.user);
        return;
      }

      toast.error("Email or password is incorrect");
    } catch (err) {
      toast.error("Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!passwordMatch) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const registerForm = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) registerForm.append(key, value);
      });
      registerForm.append("role", role);

      const response = await fetch(getApiUrl("/auth/register"), {
        method: "POST",
        body: registerForm,
      });

      if (response.ok) {
        toast.success("Account created! Please log in.");
        setMode("login");
        setStep("form");
        return;
      }

      toast.error("Registration failed. Email may already exist.");
    } catch (err) {
      toast.error("Registration failed");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch(getApiUrl("/auth/google-signup"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: tokenResponse.access_token, role }),
        });

        if (res.status === 200 || res.status === 201) {
          const loggedIn = await res.json();
          dispatch(setLogin({ user: loggedIn.user, token: loggedIn.token }));
          toast.success("Signed in with Google");
          redirectAfterAuth(loggedIn.user);
        } else {
          toast.error("Google sign-in failed");
        }
      } catch (err) {
        toast.error("Google sign-in failed");
      }
    },
    onError: () => toast.error("Google sign-in cancelled"),
  });

  const selectRole = (selectedRole) => {
    setRole(selectedRole);
    setStep("form");
  };

  const backgroundImage = mode === "signup" ? images.register : images.auth;

  return (
    <div className="auth-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="auth-page_overlay" />
      <div className="auth-page_content">
        <Link to="/" className="auth-page_logo">
          <img src="/assets/logo.png" alt={`${site.name} logo`} />
          <span>{site.name}</span>
        </Link>

        {step === "role" && (
          <div className="auth-card">
            <h2>{mode === "login" ? "Log in as" : "Sign up as"}</h2>
            <p>Choose how you want to use the platform</p>
            <div className="auth-role-grid">
              {Object.values(roles).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="auth-role-card"
                  onClick={() => selectRole(item.id)}
                >
                  <span className="auth-role-card_icon">{item.icon}</span>
                  <h3>{item.title}</h3>
                  <p>{item.subtitle}</p>
                </button>
              ))}
            </div>
            <Link to="/" className="auth-card_back">
              ← Back to homepage
            </Link>
          </div>
        )}

        {step === "form" && mode === "login" && (
          <div className="auth-card">
            <span className="auth-badge">
              {roles[role]?.icon} {roles[role]?.title}
            </span>
            <h2>Log In</h2>
            <form className="auth-form" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button type="submit">Log In</button>
            </form>
            <button type="button" className="google-btn" onClick={() => googleLogin()}>
              <FcGoogle /> Continue with Google
            </button>
            <p className="auth-switch">
              New here?{" "}
              <button type="button" onClick={() => { setMode("signup"); setStep("role"); }}>
                Create an account
              </button>
            </p>
            <button type="button" className="auth-card_back-btn" onClick={() => setStep("role")}>
              ← Change role
            </button>
          </div>
        )}

        {step === "form" && mode === "signup" && (
          <div className="auth-card auth-card--wide">
            <span className="auth-badge">
              {roles[role]?.icon} {roles[role]?.title}
            </span>
            <h2>Create Account</h2>
            <form className="auth-form" onSubmit={handleRegister}>
              <div className="auth-form_row">
                <input
                  placeholder="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <input
                  placeholder="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <input
                placeholder="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                placeholder="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <input
                placeholder="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {!passwordMatch && <p className="auth-error">Passwords do not match</p>}
              <label className={`auth-upload${profilePreview ? " auth-upload--has-preview" : ""}`}>
                <input
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleChange}
                  required
                />
                {profilePreview ? (
                  <div className="auth-upload_preview">
                    <img src={profilePreview} alt="Profile preview" />
                    <span>Change photo</span>
                  </div>
                ) : (
                  <div className="auth-upload_placeholder">
                    <span className="auth-upload_icon">📷</span>
                    <span>Upload profile photo</span>
                    <small>JPG or PNG, up to 5 MB</small>
                  </div>
                )}
              </label>
              <button type="submit" disabled={!passwordMatch}>
                Sign Up
              </button>
            </form>
            <button type="button" className="google-btn" onClick={() => googleLogin()}>
              <FcGoogle /> Sign up with Google
            </button>
            <p className="auth-switch">
              Already have an account?{" "}
              <button type="button" onClick={() => { setMode("login"); setStep("role"); }}>
                Log in
              </button>
            </p>
            <button type="button" className="auth-card_back-btn" onClick={() => setStep("role")}>
              ← Change role
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
