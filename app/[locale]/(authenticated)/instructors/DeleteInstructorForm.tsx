"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { deleteInstructorAction } from "./actions";
import { tt } from "@/lib";
import { useCurrentLocale } from "@/locales/client";
import { Button } from "@/components/Buttons";

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
  const locale = useCurrentLocale();
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
      for (const error of deleteInstructorResponse.errors) {
        toast.error(error.message);
      }
      return;
    }

    toast.success("Instructor deleted");
    router.push(`/instructors`);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Button variant="danger" type="submit" disabled={isSubmitting}>
          {tt(locale, {
            en: "Delete",
            ar: "حذف",
          })}
        </Button>
      </form>
    </>
  );
}
