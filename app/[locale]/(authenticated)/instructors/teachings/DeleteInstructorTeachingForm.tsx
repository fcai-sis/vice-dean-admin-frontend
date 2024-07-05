"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { deleteInstructorTeachingAction } from "./actions";
import { Button } from "@/components/Buttons";

const deleteInstructorTeachingFormSchema = z.object({
  instructorTeachingId: z.string(),
});

export type DeleteInstructorTeachingFormValues = z.infer<
  typeof deleteInstructorTeachingFormSchema
>;

export default function DeleteInstructorTeachingForm({
  instructorTeachingId,
}: {
  instructorTeachingId: string;
}) {
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DeleteInstructorTeachingFormValues>({
    resolver: zodResolver(deleteInstructorTeachingFormSchema),
    defaultValues: {
      instructorTeachingId: instructorTeachingId,
    },
  });

  const onSubmit = async (values: DeleteInstructorTeachingFormValues) => {
    const deleteInstructorTeachingResponse =
      await deleteInstructorTeachingAction(values);

    if (!deleteInstructorTeachingResponse.success) {
      for (const error of deleteInstructorTeachingResponse.errors) {
        toast.error(error.message);
      }
      return;
    }

    toast.success("Instructor teaching deleted");
    router.push(`/instructors/teachings`);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Deleting..." : "Delete"}
        </Button>
      </form>
    </>
  );
}
