import React from "react";
import "./Button.css";

const Button = ({ btnTitle, btnColor = "var(--orange-color)", onClick }) => {
  return (
    <button
      className="button"
      style={{ "--button-color": btnColor }}
      onClick={onClick}
    >
      {btnTitle}
    </button>
  );
};

export default Button;
