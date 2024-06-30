"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { deleteTaTeachingAction } from "./actions";

const deleteTaTeachingFormSchema = z.object({
  taTeachingId: z.string(),
});

export type DeleteTaTeachingFormValues = z.infer<
  typeof deleteTaTeachingFormSchema
>;

export default function DeleteTaTeachingForm({
  taTeachingId,
}: {
  taTeachingId: string;
}) {
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DeleteTaTeachingFormValues>({
    resolver: zodResolver(deleteTaTeachingFormSchema),
    defaultValues: {
      taTeachingId: taTeachingId,
    },
  });

  const onSubmit = async (values: DeleteTaTeachingFormValues) => {
    const deleteTaTeachingResponse = await deleteTaTeachingAction(values);

    if (!deleteTaTeachingResponse.success) {
      return toast.error(deleteTaTeachingResponse.error?.message);
    }

    toast.success("TA teaching deleted");
    router.push(`/teachings`);
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
