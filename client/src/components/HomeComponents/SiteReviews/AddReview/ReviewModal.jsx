import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import "./AddReview.css";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function ReviewModal({ show, handleClose }) {
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");
  const token = localStorage.getItem("token");
  const { t } = useTranslation();
  const currentLang = useSelector((state) => state.language.currentLang);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || comment.length < 4) {
      toast.error(t("Please add a comment with more than 3 characters."));
      return;
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ rating, comment }),
    });

    if (res.status === 401) {
      toast.error(t("Unauthorized token. Please login."));
      return;
    }

    if (!res.ok) {
      toast.error(t("Failed to send review."));
      return;
    }

    toast.success(t("Sent review successfully!"));
    setRating(0);
    setComment("");
    handleClose();
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        dialogClassName="reh-review-modal"
        dir={currentLang === "ar" ? "rtl" : "ltr"}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">{t("Rate and review")}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <small className="reh-rating-label">
            {t("Rating")} ({rating}/5)
          </small>
          <div className="d-flex gap-2 my-2 reh-stars-row">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                onClick={() => setRating(star)}
                className="reh-star"
                color={
                  star <= rating
                    ? "var(--orange-color)"
                    : "var(--gray-color-light)"
                }
              />
            ))}
          </div>

          <Form>
            <Form.Label className="my-2 reh-review-label">
              {t("Review")}
            </Form.Label>

            <Form.Control
              as="textarea"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("Write your review...")}
              className="reh-review-textarea"
            />
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <div className="d-flex justify-content-between w-100">
            <Button
              variant="light"
              onClick={handleClose}
              className="reh-cancel-btn"
            >
              {t("Cancel")}
            </Button>

            <Button onClick={handleSubmit} className="reh-post-btn">
              {t("Post")}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
