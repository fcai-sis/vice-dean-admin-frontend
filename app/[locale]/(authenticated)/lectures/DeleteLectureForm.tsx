"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { deleteLectureAction } from "./actions";
import { Button } from "@/components/Buttons";

const deleteLectureFormSchema = z.object({
  lectureId: z.string(),
});

export type deleteLectureFormValues = z.infer<typeof deleteLectureFormSchema>;

export default function DeleteLectureForm({
  lectureId,
}: {
  lectureId: string;
}) {
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<deleteLectureFormValues>({
    resolver: zodResolver(deleteLectureFormSchema),
    defaultValues: {
      lectureId: lectureId,
    },
  });

  const onSubmit = async (values: deleteLectureFormValues) => {
    const deleteLectureResponse = await deleteLectureAction(values);

    if (!deleteLectureResponse.success) {
      return toast.error(deleteLectureResponse.error?.message);
    }

    toast.success("Lecture deleted");
    router.push(`/lectures`);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Button variant="danger" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Deleting..." : "Delete"}
        </Button>
      </form>
    </>
  );
}
