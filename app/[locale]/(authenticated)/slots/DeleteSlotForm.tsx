"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { deleteSlotAction } from "./actions";
import { Trash } from "iconoir-react";

export default function DeleteSlotForm({ slotId }: { slotId: string }) {
  const router = useRouter();

  const onSubmit = async () => {
    const deleteSlotResponse = await deleteSlotAction({ slotId });

    if (!deleteSlotResponse.success) {
      return toast.error(deleteSlotResponse.error?.message);
    }

    toast.success("Slot deleted");
    router.push(`/slots`);
  };

  return (
    <>
      <div
        className="rounded-lg table-cell p-2 bg-red-50 border border-red-100 cursor-pointer hover:bg-red-100 transition-colors duration-300 [&_*]:stroke-red-500"
        onClick={onSubmit}
      >
        <p className="flex justify-center items-center">
          <Trash />
        </p>
      </div>
    </>
  );
}
