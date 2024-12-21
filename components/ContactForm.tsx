// import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addContact } from "@/lib/api/contact";
import { getCookie } from "@/utils/cookies";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
});

const ContactForm = ({ onClose }: { onClose: () => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const token = getCookie("authToken");

  const onSubmit = async (data: any) => {
    console.log("Contact Submitted:", data);
    try {
      await addContact(token as string, data);
      alert("Contact added successfully!");
      onClose();
    } catch (error: any) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to add contact");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Name</label>
        <input
          className="block border p-2 w-full"
          type="text"
          {...register("name")}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <label>Email</label>
        <input
          className="block border p-2 w-full"
          type="email"
          {...register("email")}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>
      <div>
        <label>Phone</label>
        <input
          className="block border p-2 w-full"
          type="text"
          {...register("phone")}
        />
        {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
      </div>
      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </form>
  );
};

export default ContactForm;
