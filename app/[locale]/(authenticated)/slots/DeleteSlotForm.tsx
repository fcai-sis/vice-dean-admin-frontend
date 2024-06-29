"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { deleteSlotAction } from "./actions";

const deleteSlotFormSchema = z.object({
  slotId: z.string(),
});

export type deleteSlotFormValues = z.infer<typeof deleteSlotFormSchema>;

export default function DeleteSlotForm({ slotId }: { slotId: string }) {
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<deleteSlotFormValues>({
    resolver: zodResolver(deleteSlotFormSchema),
    defaultValues: {
      slotId: slotId,
    },
  });

  const onSubmit = async (values: deleteSlotFormValues) => {
    const deleteSlotResponse = await deleteSlotAction(values);

    if (!deleteSlotResponse.success) {
      return toast.error(deleteSlotResponse.error?.message);
    }

    toast.success("Slot deleted");
    router.push(`/slots`);
  };

  return (
    <>
      <h2>Delete Slot</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <button className='btn' type='submit' disabled={isSubmitting}>
          {isSubmitting ? "Deleting..." : "Delete"}
        </button>
      </form>
    </>
  );
}
