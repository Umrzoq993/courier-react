import React from "react";
import "../style/login.scss";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { BsInstagram, BsTelegram } from "react-icons/bs";
import { toast } from "react-toastify";
import axios from "axios";

export default function Login() {
  const [loginData, setLoginData] = React.useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loginData.username === "" || loginData.password === "") {
      toast.error("Iltimos, barcha maydonlarni to'ldiring!", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }
    try {
      await axios({
        method: "post",
        url: "http://localhost:8000/api/accounts/login/",
        data: loginData,
      })
        .then((res) => {
          console.log(res.data);
          if (res.data?.access) {
            localStorage.setItem("access", res.data.access);
            toast.success("Logged in successfully!", {
              position: "top-center",
              autoClose: 2000,
            });
            navigate("/main", { replace: true });
          }
        })
        .catch((err) => {
          toast.error(`Username or password is incorrect! \n${err}`, {
            position: "top-center",
            autoClose: 2000,
          });
        });
    } catch (error) {
      toast.error("Foydalanuvchi nomi yoki paroli noto'g'ri!");
    }
  };

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  return (
    <div className="login">
      <div className="left">
        <div className="login-content">
          <h1>User authorization</h1>
          <form onChange={handleChange} onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="Username" />
            <input type="password" name="password" placeholder="Password" />
            <button type="submit">Log in</button>
          </form>
        </div>
      </div>
      <div className="right">
        <div className="top">
          <img src="/tujjor_logo.png" alt="" />
        </div>
        <div className="bottom">
          <h2>
            Welcome to <strong>Tujjor</strong>
          </h2>
          <p>Everything is convenient and easy with us!</p>
          <div className="social-media">
            <Link to="#">
              <FaFacebook />
            </Link>
            <Link to="#">
              <BsInstagram />
            </Link>
            <Link to="#">
              <BsTelegram />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
