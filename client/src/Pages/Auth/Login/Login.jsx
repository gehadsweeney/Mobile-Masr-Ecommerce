import React from "react";
import LoginForm from "../../../components/LoginForm/LoginForm";
import PagePath from "../../../components/GlobalComponents/PagePath/PagePath";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  return (
    <div className="container">
      <div className=" pt-5">
        <PagePath path={t("Login")} />
      </div>
      <LoginForm />
    </div>
  );
};

export default Login;
