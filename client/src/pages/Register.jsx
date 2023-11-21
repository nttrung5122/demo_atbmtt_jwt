import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../api/UserServices";

// import axios from "axios";

const EMAIL_REGEX = /^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

const PWD_REGEX = /^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$/;

const Register = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",

    email: "",

    password: "",

    matchPassword: "",

    focused: {
      username: false,

      email: false,

      password: false,

      matchPassword: false,
    },
  });

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState("");

  const handleFocus = (e) => {
    setValues({
      ...values,

      focused: { ...values.focused, [e.target.name]: true },
    });
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const v1 = EMAIL_REGEX.test(values.email);

    const v2 = PWD_REGEX.test(values.password);

    if (!v1 || !v2) {
      setError(
        "Vui lòng nhập lại mật khẩu phải gồm 6 kí tự trở lên và phải gồm 1 kí tự số"
      );

      return;
    }

    // Check if passwords match

    if (values.password !== values.matchPassword) {
      alert("Mật khẩu không trùng khớp");

      return;
    }
    const { username, password, email } = values;
    try {
      const res = await registerApi(username, password, email);
      if (res.status === 200 || res.status === 201) {
        console.log("Registration successful:", res);
        setSuccess(true);
        setValues({
          username: "",
          email: "",
          password: "",
          matchPassword: "",
        });
      } else {
        console.log("Registration failed with status:", res.status);
        setError("Đăng ký không thành công");
      }
    } catch (error) {
      if (!error.response) {
        // Changed from error?.res to error.response
        setError("Không tìm thấy server");
        console.log(error.response); // Log for debugging
      } else if (error.response.status === 500) {
        setError("Tên username đã tồn tại");
        console.log(error.response);
      } else {
        setError("Đăng ký không thành công");
        console.log(error.response); // Log for debugging
      }
    }

    //this code worked
    // try {
    //   const response = await instance.post(
    //     "http://127.0.0.1:8000/auth/register-jwt",
    //     JSON.stringify({
    //       username,
    //       email,
    //       password,
    //     }),
    //     {
    //       headers: { "Content-Type": "application/json" },
    //       withCredentials: true,
    //     }
    //   );
    //   setSuccess(true);
    //   console.log("registering", response);
    //   // clear state
    //   setValues({
    //     email: " ",
    //     password: "",
    //     matchPassword: "",
    //   });
    // } catch (error) {
    //   if (!error?.response) {
    //     alert("No Server Response");
    //     console.log(error.response);
    //   } else {
    //     alert("Registration Failed");
    //     console.log(error.response);
    //   }
    // }

    /// if else if (error.response?.status === 409) {
    //   alert("Username Taken");
    // }
  };
  useEffect(() => {
    if (success) {
      setTimeout(() => navigate("/login"), 3000);
    }
  }, [success, navigate]);
  return (
    <>
      {success ? (
        <section className="rg-success">
          <h1>Đăng ký thành công! Bạn có thể đăng nhập</h1>
        </section>
      ) : (
        <div className="auth-form-container">
          <h1>Đăng ký</h1>
          <p>{error}</p>
          <form className="register-form" onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              placeholder="Nhập vào username"
              id="username"
              name="username"
              value={values.username}
              onChange={onChange}
              onBlur={handleFocus}
              focused={values.focused.username.toString()}
              required
            ></input>
            {values.focused.username && (
              <span className="errorMsg">Vui lòng nhập vào username</span>
            )}
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              placeholder="Nhập vào email"
              id="email"
              name="email"
              value={values.email}
              onChange={onChange}
              onBlur={handleFocus}
              focused={values.focused.email.toString()}
              required
            ></input>
            {values.focused.email && !EMAIL_REGEX.test(values.email) && (
              <span className="errorMsg">Email không đúng định dạng</span>
            )}
            <label htmlFor="password">Mật khẩu:</label>
            <input
              type="password"
              placeholder="Nhập vào mật khẩu"
              id="password"
              name="password"
              value={values.password}
              onChange={onChange}
              onBlur={handleFocus}
              focused={values.focused.password.toString()}
              required
            ></input>
            {values.focused.password && !PWD_REGEX.test(values.password) && (
              <span className="errorMsg">Vui lòng nhập vào mật khẩu</span>
            )}
            <label htmlFor="password">Nhập lại mật khẩu:</label>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              id="matchPassword"
              name="matchPassword"
              value={values.matchPassword}
              onChange={onChange}
              pattern={values.password}
              onBlur={handleFocus}
              focused={values.focused.matchPassword.toString()}
              required
            ></input>
            {values.focused.matchPassword &&
              values.password !== values.matchPassword && (
                <span className="errorMsg">Mật khẩu không trùng khớp</span>
              )}
            <button type="submit" className="form-button">
              Đăng ký
            </button>
          </form>

          <div>
            <Link to="/Login" className="link-btn">
              Đã có tài khoản? Đăng nhập
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
