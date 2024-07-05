"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { deleteSectionAction } from "./actions";
import { Button } from "@/components/Buttons";
import { tt } from "@/lib";
import { useCurrentLocale } from "@/locales/client";

const deleteSectionFormSchema = z.object({
  sectionId: z.string(),
});

export type deleteSectionFormValues = z.infer<typeof deleteSectionFormSchema>;

export default function DeleteSectionForm({
  sectionId,
}: {
  sectionId: string;
}) {
  const locale = useCurrentLocale();
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

    toast.success(
      tt(locale, {
        en: "Section deleted successfully",
        ar: "تم حذف القسم بنجاح",
      })
    );
    router.push(`/schedule`);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex justify-end gap-2"
      >
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
