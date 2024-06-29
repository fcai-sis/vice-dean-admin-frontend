"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { deleteDepartmentAction } from "./actions";

const deleteDepartmentFormSchema = z.object({
  departmentId: z.string(),
});

export type deleteDepartmentFormValues = z.infer<typeof deleteDepartmentFormSchema>;

export default function DeleteDepartmentForm({ departmentId }: { departmentId: string }) {
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<deleteDepartmentFormValues>({
    resolver: zodResolver(deleteDepartmentFormSchema),
    defaultValues: {
      departmentId: departmentId,
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
        <button className='btn' type='submit' disabled={isSubmitting}>
          {isSubmitting ? "Deleting..." : "Delete"}
        </button>
      </form>
    </>
  );
}
