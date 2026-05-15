import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, googleLogin } from "../../store/slices/usersSlice";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineFacebook } from "react-icons/md";
import "./LoginForm.css";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function LoginForm() {
  const { t } = useTranslation();
  const currentLang = useSelector((state) => state.language.currentLang);
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((s) => s.users);
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({ mode: "onChange" });

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setGoogleLoading(true);
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );

        const { sub: googleId, email, name, picture } = res.data;
        dispatch(
          googleLogin({ googleId, email, name, profilePicture: picture })
        );
      } catch (err) {
        toast.error("Google login failed");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => toast.error("Google login failed"),
  });

  const onSubmit = (data) => {
    dispatch(loginUser({ email: data.email, password: data.password }));
  };

  useEffect(() => {
    if (error) {
      const msg =
        typeof error === "string" ? error : "Invalid email or password";
      toast.error(msg);
    }
  }, [error]);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="login-center" dir={currentLang === "ar" ? "rtl" : "ltr"}>
      <div className="login-card">
        <div className="text-center mb-5">
          <p>{t("Sign In with email")}</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ==========email===========  */}
          <div className="mb-3">
            <label className="form-label ">{t("Email")}</label>
            <input
              type="text"
              className={`form-control geh-form-control ps-4 mb-4 ${
                errors.email ? "is-invalid" : ""
              }`}
              placeholder="you@example.com"
              {...register("email", {
                required: { value: true, message: t("Email is required") },
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: t("Invalid email address"),
                },
              })}
            />
            {errors.email && (
              <small className="text-danger">{errors.email.message}</small>
            )}
          </div>

          {/* ==========password=========== */}
          <div className="mb-3 position-relative">
            <label className="form-label">{t("Password")}</label>

            <input
              type={showPassword ? "text" : "password"}
              className={`form-control geh-form-control ps-4 pe-5 mb-4 ${
                errors.password ? "is-invalid" : ""
              }`}
              placeholder={t("Enter your password")}
              {...register("password", {
                required: { value: true, message: t("Password is required") },
                minLength: {
                  value: 6,
                  message: t("Password must be at least 6 characters long"),
                },
              })}
            />

            {/* زر إظهار / إخفاء الباسورد */}
            <span
              className="geh-password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>

            {errors.password && (
              <small className="text-danger">{errors.password.message}</small>
            )}
          </div>

          {/* ======forgot password link=========== */}

          <div className="d-flex justify-content-start mb-3">
            <small>
              <Link
                to="/forgot-password"
                className="text-decoration-none geh-link "
              >
                {t("Forgot Password?")}
              </Link>
            </small>
          </div>

          {/* ======button=========== */}
          <button
            className="btn btn-geh w-100 mb-5"
            type="submit"
            disabled={loading || !isValid || isSubmitting}
            aria-disabled={loading || !isValid || isSubmitting}
          >
            {loading
              ? t("Logging in...")
              : isSubmitting
              ? t("Submitting...")
              : t("Submit")}
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-muted">{t("Or")}</span>
        </div>

        <button
          type="button"
          className="btn btn-google-custom w-100"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
        >
          <FcGoogle className="google-icon" />
          {googleLoading ? t("Signing in...") : t("Sign in with Google")}
        </button>

        <div className="text-center mt-4">
          <p className="text-muted">
            {t("Don't have an account?")}{" "}
            <Link to="/register" className="geh-link text-decoration-none ">
              {t("Sign Up")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
