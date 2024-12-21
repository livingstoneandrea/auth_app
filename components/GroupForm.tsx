import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getCookie } from "@/utils/cookies";
import { createGroup } from "@/lib/api/group";

const groupSchema = z.object({
  group_name: z.string().min(1, "Name is required"),
  contacts: z.array(z.string()).optional(),
});

const GroupForm = ({ onClose }: { onClose: () => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(groupSchema),
  });

  const token = getCookie("authToken");

  const onSubmit = async (data: any) => {
    console.log("Group Submitted:", data);

    const payload = {
      ...data,
      contacts: data.contacts || [],
    };

    try {
      await createGroup(token as string, payload);
      alert("Group created successfully!");
      onClose();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create new group");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Group Name</label>
        <input
          className="block border p-2 w-full"
          type="text"
          {...register("group_name")}
        />
        {errors.name && (
          <p className="text-red-500">{errors.group_name.message}</p>
        )}
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

export default GroupForm;
