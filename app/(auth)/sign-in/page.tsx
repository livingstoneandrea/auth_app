"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/auth";
import { setCookie } from "@/utils/cookies";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  loginType: z.string().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      loginType: "frontend", // Set default value for loginType
    },
  });
  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const { token, user } = await login(data);
      setCookie("authToken", token);
      setCookie("user", JSON.stringify(user));
      router.push("/dashboard");
    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl text-center mb-3">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <label>Email</label>
          <input
            className="mb-4 border black p-2"
            type="email"
            {...register("email")}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div className="flex flex-col">
          <label>Password</label>
          <input
            className="mb-4 border black p-2"
            type="password"
            {...register("password")}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <div className="flex flex-col mb-4">
          <label>Login Type</label>
          <select
            className="mb-4 border black p-2"
            {...register("loginType")}
          >
            <option value="frontend">Frontend</option>
            <option value="admin">Admin</option>
          </select>
          {errors.loginType && <p>{errors.loginType.message}</p>}
        </div>
        <button
          className="bg-black text-white rounded-full px-4 py-2"
          type="submit"
        >
          Login
        </button>
        <p>
          Don't have an account? <Link href={"/sign-up"}>Register</Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
