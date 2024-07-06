"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { updateDepartmentAction } from "./actions";
import { Button } from "@/components/Buttons";
import { tt } from "@/lib";
import { useCurrentLocale } from "@/locales/client";
import { PageHeader } from "@/components/PageBuilder";
import Spinner from "@/components/Spinner";

const updateDepartmentFormSchema = z.object({
  name: z.object({
    en: z.string(),
    ar: z.string(),
  }),
  code: z.string(),
  program: z.enum(["GENERAL", "SPECIAL"]),
  capacity: z.number(),
});

export type UpdateDepartmentFormValues = z.infer<
  typeof updateDepartmentFormSchema
>;

export default function UpdateDepartmentForm({
  department,
}: {
  department: any;
}) {
  const locale = useCurrentLocale();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<UpdateDepartmentFormValues>({
    resolver: zodResolver(updateDepartmentFormSchema),
    defaultValues: {
      name: department.name,
      code: department.code,
      program: department.program,
      capacity: department.capacity,
    },
  });

  const onSubmit = async (values: UpdateDepartmentFormValues) => {
    const response = await updateDepartmentAction(values);

    if (!response.success) {
      return toast.error(response.error?.message);
    }

    toast.success(
      tt(locale, {
        en: "Department updated successfully",
        ar: "تم تحديث القسم بنجاح",
      })
    );
    router.push(`/departments`);
  };

  return (
    <>
      <PageHeader
        title={tt(locale, { en: "Update Department", ar: "تحديث قسم" })}
        actions={[]}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col rounded-lg p-4 bg-white border border-slate-200 gap-4 w-full"
      >
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="code">
              {tt(locale, { en: "Code", ar: "الرمز" })}
            </label>
            <p className="text-slate-400">{department.code}</p>
            <label htmlFor="name.en">
              {tt(locale, { en: "Name (English)", ar: "الاسم (انجليزي)" })}
            </label>
            <input
              type="text"
              placeholder={tt(locale, {
                en: "Name (English)",
                ar: "الاسم (انجليزي)",
              })}
              {...register("name.en")}
              className={`${
                errors.name?.en
                  ? "p-2 border border-red-500 rounded-lg"
                  : "p-2 border border-slate-200 rounded-lg"
              }`}
            />
            <span className="text-red-500">{errors.name?.en?.message}</span>
            <label htmlFor="name.ar">
              {tt(locale, { en: "Name (Arabic)", ar: "الاسم (عربي)" })}
            </label>
            <input
              type="text"
              placeholder={tt(locale, {
                en: "Name (Arabic)",
                ar: "الاسم (عربي)",
              })}
              {...register("name.ar")}
              className={
                errors.name?.ar
                  ? "p-2 border border-red-500 rounded-lg"
                  : "p-2 border border-slate-200 rounded-lg"
              }
            />
            <span className="text-red-500">{errors.name?.ar?.message}</span>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="program">
              {tt(locale, { en: "Program", ar: "البرنامج" })}
            </label>
            <select
              {...register("program")}
              className={
                errors.program
                  ? "p-2 border border-red-500 rounded-lg"
                  : "p-2 border border-slate-200 rounded-lg"
              }
            >
              <option value="GENERAL">
                {tt(locale, { en: "General", ar: "عام" })}
              </option>
              <option value="SPECIAL">
                {tt(locale, { en: "Special", ar: "خاص" })}
              </option>
            </select>
            <span className="text-red-500">{errors.program?.message}</span>
            <label htmlFor="capacity">
              {tt(locale, { en: "Capacity", ar: "السعة" })}
            </label>
            <input
              type="number"
              placeholder={tt(locale, { en: "Capacity", ar: "السعة" })}
              {...register("capacity", { valueAsNumber: true })}
              className={
                errors.capacity
                  ? "p-2 border border-red-500 rounded-lg"
                  : "p-2 border border-slate-200 rounded-lg"
              }
            />
            <span className="text-red-500">{errors.capacity?.message}</span>
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <Spinner />
            ) : (
              tt(locale, { en: "Update Department", ar: "تحديث القسم" })
            )}
          </Button>
        </div>
      </form>
    </>
  );
}
