"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { updateHallAction } from "./actions";
import { Button } from "@/components/Buttons";
import { tt } from "@/lib";
import { useCurrentLocale } from "@/locales/client";
import { PageHeader } from "@/components/PageBuilder";

const updateHallFormSchema = z.object({
  _id: z.string(),
  name: z.object({
    en: z.string(),
    ar: z.string(),
  }),
  capacity: z.number(),
});

export type UpdateHallFormValues = z.infer<typeof updateHallFormSchema>;

export default function UpdateHallForm({ hall }: { hall: any }) {
  const locale = useCurrentLocale();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<UpdateHallFormValues>({
    resolver: zodResolver(updateHallFormSchema),
    defaultValues: {
      _id: hall._id,
      name: {
        en: hall.name.en,
        ar: hall.name.ar,
      },
      capacity: hall.capacity,
    },
  });

  const onSubmit = async (values: UpdateHallFormValues) => {
    const updateHallResponse = await updateHallAction(values);

    if (!updateHallResponse.success) {
      return toast.error(updateHallResponse.error?.message);
    }

    toast.success(
      tt(locale, {
        en: "Hall updated successfully",
        ar: "تم تحديث القاعة بنجاح",
      })
    );
    router.push(`/halls`);
  };

  return (
    <>
      <PageHeader
        title={tt(locale, {
          en: "Update Hall",
          ar: "تحديث القاعة",
        })}
        actions={[]}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-lg border border-slate-200 bg-white flex flex-col p-4 gap-4 w-full"
      >
        <div className="flex flex-col gap-2">
          <label>
            {tt(locale, {
              en: "Name (English)",
              ar: "الاسم (الإنجليزية)",
            })}
          </label>
          <input
            type="text"
            placeholder={tt(locale, {
              en: "English name",
              ar: "الاسم الانجليزي",
            })}
            {...register("name.en")}
          />
          {errors.name?.en && <p>{errors.name.en.message}</p>}
          <label htmlFor="name.ar">
            {tt(locale, {
              en: "Name (Arabic)",
              ar: "الاسم (العربية)",
            })}
          </label>
          <input
            type="text"
            placeholder={tt(locale, {
              en: "Arabic name",
              ar: "الاسم العربي",
            })}
            {...register("name.ar")}
          />
          {errors.name?.ar && <p>{errors.name.ar.message}</p>}
          <label>
            {tt(locale, {
              en: "Capacity",
              ar: "السعة",
            })}
          </label>
          <input
            type="number"
            placeholder="Capacity"
            {...register("capacity", { valueAsNumber: true })}
          />
          {errors.capacity && <p>{errors.capacity.message}</p>}
        </div>
        <div className="flex justify-center items-center">
          <Button type="submit" disabled={isSubmitting}>
            {tt(locale, {
              en: "Update Hall",
              ar: "تحديث القاعة",
            })}
          </Button>
        </div>
      </form>
    </>
  );
}
