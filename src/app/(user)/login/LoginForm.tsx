"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { DOMAIN } from "@/utils/constats";
import ButtonSpinner from "@/components/ButtonSpinner";

const LoginForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(false);

  const formSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "") return toast.error("Email is required");
    if (password === "") return toast.error("Password is required");

    try {
      setloading(true);
      await axios.post(`${DOMAIN}/api/users/login`, { email, password });
      router.replace("/");
      setloading(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error?.response?.data.message);
      console.log(error);
      setloading(false);
    }
  };

  return (
    <form onSubmit={formSubmitHandler} className="flex flex-col">
      <input
        className="mb-4 border rounded p-2 text-xl "
        type="email"
        placeholder="Enter Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="mb-4 border rounded p-2 text-xl"
        type="password"
        placeholder="Enter Your Passward"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        disabled={loading}
        type="submit"
        className="text-2xl text-white bg-blue-800 p-2 rounded-lg font-bold"
      >
        {loading ? <ButtonSpinner /> : "login"}
      </button>
    </form>
  );
};

export default LoginForm;
