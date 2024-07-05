"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { deleteDepartmentAction } from "./actions";
import { Button } from "@/components/Buttons";
import Spinner from "@/components/Spinner";
import { tt } from "@/lib";
import { useCurrentLocale } from "@/locales/client";
import { Trash } from "iconoir-react";

const deleteDepartmentFormSchema = z.object({
  code: z.string(),
});

export type deleteDepartmentFormValues = z.infer<
  typeof deleteDepartmentFormSchema
>;

export default function DeleteDepartmentForm({ code }: { code: string }) {
  const locale = useCurrentLocale();
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<deleteDepartmentFormValues>({
    resolver: zodResolver(deleteDepartmentFormSchema),
    defaultValues: {
      code: code,
    },
  });

  const onSubmit = async (values: deleteDepartmentFormValues) => {
    const deleteDepartmentResponse = await deleteDepartmentAction(values);

    if (!deleteDepartmentResponse.success) {
      return toast.error(deleteDepartmentResponse.error?.message);
    }

    toast.success("Department deleted");
    router.push(`/departments`);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Button type="submit" variant="danger" disabled={isSubmitting}>
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
