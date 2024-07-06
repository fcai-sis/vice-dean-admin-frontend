"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useCurrentLocale } from "@/locales/client";
import { localizedTitle, TitleEnum, tt } from "@/lib";
import { createTaAction } from "../actions";
import { Button } from "@/components/Buttons";
import { PageHeader } from "@/components/PageBuilder";

const createTaFormSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  department: z.string(),
  password: z.string(),
  title: z.enum(TitleEnum),
});

export type CreateTaFormValues = z.infer<typeof createTaFormSchema>;

export default function CreateTaForm({ departments }: { departments: any[] }) {
  const locale = useCurrentLocale();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaFormValues>({
    resolver: zodResolver(createTaFormSchema),
    defaultValues: {},
  });

  const onSubmit = async (values: CreateTaFormValues) => {
    const createTaResponse = await createTaAction(values);

    if (!createTaResponse.success) {
      for (const error of createTaResponse.errors) {
        toast.error(error.message);
      }
      return;
    }

    toast.success("Teaching Assistant created successfully!");
    router.push(`/tas`);
  };

  return (
    <>
      <div className="w-full flex">
        <h1></h1>
      </div>
      <PageHeader
        title={tt(locale, {
          en: "Create Teaching Assistant",
          ar: "إنشاء معيد",
        })}
        actions={[]}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4 border border-slate-200 rounded-lg"
      >
        <label>
          {tt(locale, {
            en: "Full Name",
            ar: "الاسم الكامل",
          })}
        </label>
        <input type="text" {...register("fullName")} />
        {errors.fullName && <p>{errors.fullName.message}</p>}
        <label>
          {tt(locale, {
            en: "Email",
            ar: "البريد الإلكتروني",
          })}
        </label>
        <input type="email" {...register("email")} />
        {errors.email && <p>{errors.email.message}</p>}
        <label>
          {tt(locale, {
            en: "Department",
            ar: "القسم",
          })}
        </label>
        <select {...register("department")}>
          <option disabled selected>
            {tt(locale, {
              en: "Select a department",
              ar: "اختر قسمًا",
            })}
          </option>
          {departments.map((department, index) => (
            <option key={index} value={department.code}>
              {tt(locale, department.name)}
            </option>
          ))}
        </select>
        {errors.department && <p>{errors.department.message}</p>}
        <label>
          {tt(locale, {
            en: "Password",
            ar: "كلمة المرور",
          })}
        </label>
        <input type="password" {...register("password")} />
        {errors.password && <p>{errors.password.message}</p>}
        <label>
          {tt(locale, {
            en: "Title",
            ar: "اللقب",
          })}
        </label>
        <select {...register("title")}>
          <option disabled selected>
            {tt(locale, {
              en: "Select a title",
              ar: "اختر لقبًا",
            })}
          </option>
          {Object.values(TitleEnum).map((title) => (
            <option key={title} value={title}>
              {tt(locale, localizedTitle(title))}
            </option>
          ))}
        </select>
        <div className="flex justify-center items-center">
          <Button type="submit" disabled={isSubmitting}>
            {tt(locale, {
              en: "Create Teaching Assistant",
              ar: "إنشاء معيد",
            })}
          </Button>
        </div>
      </form>
    </>
  );
}
