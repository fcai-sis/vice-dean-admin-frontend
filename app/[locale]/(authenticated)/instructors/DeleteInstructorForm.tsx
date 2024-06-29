"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { deleteInstructorAction } from "./actions";

const deleteInstructorFormSchema = z.object({
  instructorId: z.string(),
});

export type deleteInstructorFormValues = z.infer<
  typeof deleteInstructorFormSchema
>;

export default function DeleteInstructorForm({
  instructorId,
}: {
  instructorId: string;
}) {
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<deleteInstructorFormValues>({
    resolver: zodResolver(deleteInstructorFormSchema),
    defaultValues: {
      instructorId: instructorId,
    },
  });

  const onSubmit = async (values: deleteInstructorFormValues) => {
    const deleteInstructorResponse = await deleteInstructorAction(values);

    if (!deleteInstructorResponse.success) {
      return toast.error(deleteInstructorResponse.error?.message);
    }

    toast.success("Instructor deleted");
    router.push(`/instructors`);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <button className='btn' type='submit' disabled={isSubmitting}>
          {isSubmitting ? "Deleting..." : "Delete"}
        </button>
      </form>
    </>
  );
}
