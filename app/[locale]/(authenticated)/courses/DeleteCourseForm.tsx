"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "@/components/Buttons";
import { tt } from "@/lib";
import { useCurrentLocale } from "@/locales/client";
import Spinner from "@/components/Spinner";
import { deleteCourseAction } from "./actions";

const deleteCourseFormSchema = z.object({
  code: z.string(),
});

export type deleteCourseFormValues = z.infer<typeof deleteCourseFormSchema>;

export default function DeleteCourseForm({ code }: { code: string }) {
  const locale = useCurrentLocale();
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<deleteCourseFormValues>({
    resolver: zodResolver(deleteCourseFormSchema),
    defaultValues: {
      code: code,
    },
  });

  const onSubmit = async (values: deleteCourseFormValues) => {
    const deleteCourseResponse = await deleteCourseAction(values);

    if (!deleteCourseResponse.success) {
      for (const error of deleteCourseResponse.errors) {
        toast.error(error.message);
      }
      return;
    }

    toast.success(
      tt(locale, {
        en: "Course deleted successfully",
        ar: "تم حذف المقرر بنجاح",
      })
    );
    router.push(`/courses`);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Button variant="danger" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Spinner />
          ) : (
            <>{tt(locale, { en: "Delete", ar: "حذف" })}</>
          )}
        </Button>
      </form>
    </>
  );
}
