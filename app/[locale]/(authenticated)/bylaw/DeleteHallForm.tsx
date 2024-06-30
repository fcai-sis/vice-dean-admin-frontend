"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { deleteHallAction } from "./actions";

const deleteHallFormSchema = z.object({
  hallId: z.string(),
});

export type deleteHallFormValues = z.infer<typeof deleteHallFormSchema>;

export default function DeleteHallForm({ hallId }: { hallId: string }) {
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<deleteHallFormValues>({
    resolver: zodResolver(deleteHallFormSchema),
    defaultValues: {
      hallId: hallId,
    },
  });

  const onSubmit = async (values: deleteHallFormValues) => {
    const deleteHallResponse = await deleteHallAction(values);

    if (!deleteHallResponse.success) {
      return toast.error(deleteHallResponse.error?.message);
    }

    toast.success("Hall deleted");
    router.push(`/halls`);
  };

  return (
    <>
      <h2>Delete Hall</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <button className='btn' type='submit' disabled={isSubmitting}>
          {isSubmitting ? "Deleting..." : "Delete"}
        </button>
      </form>
    </>
  );
}
