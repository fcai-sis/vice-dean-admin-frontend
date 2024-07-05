"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useCurrentLocale } from "@/locales/client";
import { tt } from "@/lib";
import { createInstructorAction } from "../actions";
import { Button } from "@/components/Buttons";

const createInstructorFormSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  department: z.string(),
  password: z.string(),
});

export type CreateInstructorFormValues = z.infer<
  typeof createInstructorFormSchema
>;

export default function CreateInstructorForm({
  departments,
}: {
  departments: any[];
}) {
  const locale = useCurrentLocale();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<CreateInstructorFormValues>({
    resolver: zodResolver(createInstructorFormSchema),
    defaultValues: {},
  });

  const onSubmit = async (values: CreateInstructorFormValues) => {
    const createInstructorResponse = await createInstructorAction(values);

    if (!createInstructorResponse.success) {
      for (const error of createInstructorResponse.errors) {
        toast.error(error.message);
      }
      return;
    }

    toast.success("Instructor created successfully!");
    router.push(`/instructors`);
  };

  return (
    <>
      <div className="w-full flex">
        <h1>
          {tt(locale, {
            en: "Create Instructor",
            ar: "إنشاء دكتور",
          })}
        </h1>
      </div>

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
          {departments.map((department) => (
            <option key={department.id} value={department._id}>
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
        <div className="flex justify-center items-center">
          <Button type="submit" disabled={isSubmitting}>
            {tt(locale, {
              en: "Create Instructor",
              ar: "إنشاء دكتور",
            })}
          </Button>
        </div>
      </form>
    </>
  );
}
