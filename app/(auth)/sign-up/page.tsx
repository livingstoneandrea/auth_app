"use client";

import React from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { register as registerUser } from "@/lib/api/auth";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters long"),
  last_name: z.string().min(2, "Last name must be at least 2 characters long"),
  msisdn: z.string().min(3, "Msisdn must be at least 2 characters long"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  const router = useRouter();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      console.log(data);
      await registerUser(data);
      router.push("/sign-in");
    } catch (error: any) {
      console.log(error);
      alert(error.response?.data?.message || "Registration failed");
    }
  };
  return (
    <div>
      <h1 className="text-3xl text-center mb-3">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <label>Email</label>
          <input
            className="mb-4 border black p-2 rounded-full"
            type="email"
            {...register("email")}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div className="flex flex-col">
          <label>Password</label>
          <input
            className="mb-4 border black p-2 rounded-full"
            type="password"
            {...register("password")}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <div className="flex flex-col">
          <label>first name</label>
          <input
            className="mb-4 border black p-2 rounded-full"
            type="first_name"
            {...register("first_name")}
          />
          {errors.first_name && <p>{errors.first_name.message}</p>}
        </div>
        <div className="flex flex-col">
          <label>last name</label>
          <input
            className="mb-4 border black p-2 rounded-full"
            type="last_name"
            {...register("last_name")}
          />
          {errors.last_name && <p>{errors.last_name.message}</p>}
        </div>
        <div className="flex flex-col">
          <label>msisdn</label>
          <input
            className="mb-4 border black p-2 rounded-full"
            type="msisdn"
            {...register("msisdn")}
          />
          {errors.msisdn && <p>{errors.msisdn.message}</p>}
        </div>
        <button
          className="bg-black text-white rounded-full px-4 py-2"
          type="submit"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default SignUp;
