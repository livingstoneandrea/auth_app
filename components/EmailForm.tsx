import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { getCookie } from "@/utils/cookies";

const emailSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
});

const EmailForm = ({
  sentEmail,
  onClose,
}: {
  sentEmail: string;
  onClose: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(emailSchema),
  });

  const token = getCookie("authToken");

  const onSubmit = async (data: {
    to: string;
    subject: string;
    body: string;
  }) => {
    try {
      await axios.post(
        `http://localhost:4000/api/emails/send/`,
        {
          to: sentEmail,
          subject: data.subject,
          body: data.body,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Email sent successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to send email.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-4">
        <label className="block mb-2">Subject</label>
        <input
          className="block border p-2 w-full"
          type="text"
          {...register("subject")}
        />
        {errors.subject && (
          <p className="text-red-500">{errors.subject.message}</p>
        )}
      </div>

      <div className="mt-4">
        <label className="block mb-2">Body</label>
        <textarea
          className="block border p-2 w-full"
          rows={5}
          {...register("body")}
        />
        {errors.body && <p className="text-red-500">{errors.body.message}</p>}
      </div>

      <div className="mt-4 flex justify-end">
        <button type="button" className="text-gray-500 px-4" onClick={onClose}>
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send Email
        </button>
      </div>
    </form>
  );
};

export default EmailForm;
