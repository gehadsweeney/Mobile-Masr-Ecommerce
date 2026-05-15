import React, { useContext } from "react";
import CompareContext from "../../../context/CompareContext";
import { AiOutlineDelete } from "react-icons/ai";
import { IoGitCompareOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import "./Card.css";
import { useTranslation } from "react-i18next";
function CardCompareBtn({ product }) {
  // ============compare context ============
  const { compareItems, setCompareItems } = useContext(CompareContext);
  const { t } = useTranslation();
  //   const [isCompered, setIsCompered] = useState(false);
  //   console.log("compared items", compareItems);
  function handleCompareClick() {
    if (compareItems.some((prod) => prod._id === product._id)) {
      setCompareItems(compareItems.filter((prod) => prod._id !== product._id));
      localStorage.setItem(
        "compareItems",
        JSON.stringify(compareItems.filter((prod) => prod._id !== product._id))
      );
      toast.info(t("Removed from compare"));
    } else if (compareItems.length < 3) {
      if (
        compareItems.length > 0 &&
        compareItems[0].category._id !== product.category._id
      ) {
        toast.error(t("You can only compare products from the same category"));
        return;
      }
      setCompareItems([...compareItems, product]);
      localStorage.setItem(
        "compareItems",
        JSON.stringify([...compareItems, product])
      );
      toast.success(t("Added to compare"));
    } else {
      toast.error(t("You can only compare up to 3 items"));
    }
  }

  return (
    <button
      className="abd-CompareBtn p-2"
      onClick={() => {
        handleCompareClick();
      }}
    >
      {compareItems.some((prod) => prod._id === product._id) ? (
        <AiOutlineDelete size={20} />
      ) : (
        <IoGitCompareOutline size={20} />
      )}
      <div className="abd-TextCompareBtn ms-2">
        {compareItems.some((prod) => prod._id === product._id)
          ? t("remove")
          : t("compare")}
      </div>
    </button>
  );
}

export default React.memo(CardCompareBtn);
