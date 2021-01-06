import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { doRequest, errors, success } = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    await doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign In</h1>
      <div className='form-group'>
        <label htmlFor=''>Email Address</label>
        <input
          type='email'
          className='form-control'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors &&
          errors.map(
            (err) => err.field === "email" && <small key={err.message}>{err.message}</small>
          )}
      </div>
      <div className='form-group'>
        <label htmlFor=''>Password</label>
        <input
          type='password'
          className='form-control'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors &&
          errors.map(
            (err) => err.field === "password" && <small key={err.message}>{err.message}</small>
          )}
      </div>
      <button className='btn btn-primary'>Sign In</button>
    </form>
  );
};

export default Signin;
