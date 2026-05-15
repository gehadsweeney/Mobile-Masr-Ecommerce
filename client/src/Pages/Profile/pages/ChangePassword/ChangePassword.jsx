import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../../../../services/api";
import "./ChangePassword.css";
import { useTranslation } from "react-i18next";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const oldPassword = e.target.oldPassword.value;
    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      toast.error(t("Passwords do not match"));
      return;
    }

    if (newPassword.length < 6) {
      toast.error(t("Password must be at least 6 characters"));
      return;
    }

    try {
      setLoading(true);
      await api.put("/change-password", { oldPassword, newPassword });
      toast.success(t("Password changed successfully!"));
      navigate("/profile/account");
    } catch (error) {
      toast.error(
        error.response?.data?.message || t("Failed to change password")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-info-container">
      <h2 className="account-info-title">{t("Change Password")}</h2>

      <div className="account-edit-form-card">
        <form onSubmit={handlePasswordChange}>
          <div className="form-group position-relative">
            <label>{t("Current Password")}</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              name="oldPassword"
              required
            />
          </div>

          <div className="form-group position-relative">
            <label>{t("New Password")}</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              name="newPassword"
              required
              minLength={6}
            />
          </div>

          <div className="form-group position-relative">
            <label>{t("Confirm New Password")}</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              name="confirmPassword"
              required
            />
            <span
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-geh" disabled={loading}>
              {loading ? t("Changing...") : t("Change Password")}
            </button>
            <button
              type="button"
              className="btn btn-outline-geh"
              onClick={() => navigate("/profile/account")}
            >
              {t("Cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
