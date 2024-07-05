"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { createHallAction } from "../actions";
import { Button } from "@/components/Buttons";
import { tt } from "@/lib";
import { useCurrentLocale } from "@/locales/client";
import { PageHeader } from "@/components/PageBuilder";

const createHallFormSchema = z.object({
  name: z.object({
    en: z.string(),
    ar: z.string(),
  }),
  capacity: z.number(),
});

export type CreateHallFormValues = z.infer<typeof createHallFormSchema>;

export default function CreateHallForm() {
  const locale = useCurrentLocale();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<CreateHallFormValues>({
    resolver: zodResolver(createHallFormSchema),
    defaultValues: {
      name: { en: "", ar: "" },
      capacity: 0,
    },
  });

  const onSubmit = async (values: CreateHallFormValues) => {
    const createHallResponse = await createHallAction(values);

    if (!createHallResponse.success) {
      return toast.error(createHallResponse.error?.message);
    }

    toast.success("Hall created successfully!");
    router.push(`/halls`);
  };

  return (
    <>
      <PageHeader
        title={tt(locale, {
          en: "Create Hall",
          ar: "إنشاء قاعة",
        })}
        actions={[]}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-lg border border-slate-200 bg-white flex flex-col p-4 gap-4 w-full"
      >
        <label>
          {tt(locale, {
            en: "Name (English)",
            ar: "الاسم (الانجليزي)",
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
        <label>
          {tt(locale, {
            en: "Name (Arabic)",
            ar: "الاسم (العربي)",
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
        <div className="flex justify-center items-center">
          <Button type="submit" disabled={isSubmitting}>
            {tt(locale, {
              en: "Create Hall",
              ar: "إنشاء قاعة",
            })}
          </Button>
        </div>
      </form>
    </>
  );
}
