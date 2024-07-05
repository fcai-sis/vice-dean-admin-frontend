"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { deleteSectionAction } from "./actions";

const deleteSectionFormSchema = z.object({
  sectionId: z.string(),
});

export type deleteSectionFormValues = z.infer<typeof deleteSectionFormSchema>;

export default function DeleteSectionForm({
  sectionId,
}: {
  sectionId: string;
}) {
  const router = useRouter();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<deleteSectionFormValues>({
    resolver: zodResolver(deleteSectionFormSchema),
    defaultValues: {
      sectionId: sectionId,
    },
  });

  const onSubmit = async (values: deleteSectionFormValues) => {
    const deleteSectionResponse = await deleteSectionAction(values);

    if (!deleteSectionResponse.success) {
      return toast.error(deleteSectionResponse.error?.message);
    }

    toast.success("Section deleted");
    router.push(`/sections`);
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
