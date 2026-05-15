import React from "react";
import "./Register.css";
import RegisterForm from "../../../components/RegisterForm/RegisterForm";
import PagePath from "../../../components/GlobalComponents/PagePath/PagePath";
import { useTranslation } from "react-i18next";

function Register() {
  const { t } = useTranslation();
  return (
    <div className="container">
      <div className=" pt-5">
        <PagePath path={t("Register")} />
      </div>
      <RegisterForm />
    </div>
  );
}

export default Register;
