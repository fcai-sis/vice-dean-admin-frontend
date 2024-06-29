"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { deleteTaAction } from "./actions";

const deleteTaFormSchema = z.object({
  taId: z.string(),
});

export type deleteTaFormValues = z.infer<typeof deleteTaFormSchema>;

export default function DeleteTaForm({ taId }: { taId: string }) {
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<deleteTaFormValues>({
    resolver: zodResolver(deleteTaFormSchema),
    defaultValues: {
      taId: taId,
    },
  });

  const onSubmit = async (values: deleteTaFormValues) => {
    const deleteTaResponse = await deleteTaAction(values);

    if (!deleteTaResponse.success) {
      return toast.error(deleteTaResponse.error?.message);
    }

    toast.success("Teaching Assistant deleted");
    router.push(`/ta`);
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
