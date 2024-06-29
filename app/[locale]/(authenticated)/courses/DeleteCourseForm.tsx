"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { deleteCourseAction } from "./actions";

const deleteCourseFormSchema = z.object({
  courseId: z.string(),
});

export type deleteCourseFormValues = z.infer<typeof deleteCourseFormSchema>;

export default function DeleteCourseForm({ courseId }: { courseId: string }) {
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<deleteCourseFormValues>({
    resolver: zodResolver(deleteCourseFormSchema),
    defaultValues: {
      courseId: courseId,
    },
  });

  const onSubmit = async (values: deleteCourseFormValues) => {
    const deleteCourseResponse = await deleteCourseAction(values);

    if (!deleteCourseResponse.success) {
      return toast.error(deleteCourseResponse.error?.message);
    }

    toast.success("Course deleted");
    router.push(`/courses`);
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
