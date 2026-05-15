import { FaStar, FaUser } from "react-icons/fa";
import { RiDoubleQuotesL } from "react-icons/ri";

import "./ReviewCard.css";
function ReviewCard({ name, comment, rating }) {
  return (
    <div className="reh-review-card">
      <h2 className="userName">{name}</h2>
      <p className="content">{comment}</p>
      <div className="rating">
        {Array.from({ length: 5 }).map((_, i) => (
          <FaStar
            key={i}
            size={16}
            color={i < rating ? "var(--orange-color)" : "var(--border-color)"}
          />
        ))}
      </div>
      <div className="userIcon">
        <FaUser size={30} />
      </div>
      <div className="quoteIcon">
        <RiDoubleQuotesL size={30} />
      </div>
    </div>
  );
}

export default ReviewCard;
