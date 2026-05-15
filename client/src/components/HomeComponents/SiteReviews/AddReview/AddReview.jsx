import React, { useContext, useState } from "react";
// import { Button } from "react-bootstrap";
import ButtonGlobal from "../../../GlobalComponents/Button/Button"; // اسم مختلف للتفريق
// import { Link } from "react-router-dom";
import IsLoginContext from "../../../../context/IsLoginContext";
import { toast } from "react-toastify";
import ReviewModal from "./ReviewModal";
import { useTranslation } from "react-i18next";
function AddReview() {
  const [show, setShow] = useState(false);
  const { isLoggedIn } = useContext(IsLoginContext);
  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);
  const { t } = useTranslation();

  return (
    <>
      <ButtonGlobal
        btnTitle={t("Add Review")}
        btnColor="var(--orange-color)"
        onClick={() => {
          if (isLoggedIn) {
            handleOpen();
          } else {
            toast.info(t("Please login first to add a review"));
          }
        }}
      />
      {isLoggedIn && <ReviewModal show={show} handleClose={handleClose} />}
    </>
  );
}

export default AddReview;
