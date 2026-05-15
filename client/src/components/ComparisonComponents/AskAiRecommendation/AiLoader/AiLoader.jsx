import React from "react";
import "./AiLoader.css";
function AiLoader() {
  return (
    <div className="center gap-5 my-5">
      {/* ----------------------------- */}
      <div className="abd-askAiBestItem-body-image-container center">
        <img
          src="https://res.cloudinary.com/dj1omur11/image/upload/v1766742181/machine-learning_lmirdr.png"
          alt="AI Analysis"
          className="abd-askAiBestItem-body-image"
        />
      </div>
      {/* ----------------------------- */}
      <div className="abd-ai-loader center flex-column">
        <div className="abd-ai-spinner"></div>
        <span style={{ marginTop: 12 }}>Analyzing...</span>
      </div>
      {/* ----------------------------- */}
    </div>
  );
}

export default AiLoader;
