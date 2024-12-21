import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { getCookie } from "@/utils/cookies";
import { addContactToGroup } from "@/lib/api/contact";

const groupSchema = z.object({
  groupId: z.string().min(1, "Group is required"),
});

const AddContactToGroupForm = ({
  groups,
  contactId,
  onClose,
}: {
  groups: any[];
  contactId: string | null;
  onClose: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(groupSchema),
  });
  const token = getCookie("authToken");
  const onSubmit = async (data: { groupId: string }) => {
    if (!contactId) return;

    try {
      await addContactToGroup(token as string, data.groupId, {
        contact_ids: [contactId],
      });
      alert("Contact successfully added to group!");
      onClose();
    } catch (error) {
      console.error("Failed to add contact to group:", error);
      alert("Failed to add contact to group.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="block mb-2">Select Group</label>
        <select className="block border p-2 w-full" {...register("groupId")}>
          <option value="">-- Select a group --</option>
          {groups.map((group) => (
            <option key={group._id} value={group._id}>
              {group.group_name}
            </option>
          ))}
        </select>
        {errors.groupId && (
          <p className="text-red-500">{errors.groupId.message}</p>
        )}
      </div>
      <div className="mt-4 flex justify-end">
        <button type="button" className="text-gray-500 px-4" onClick={onClose}>
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default AddContactToGroupForm;
