"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useCurrentLocale } from "@/locales/client";
import { tt } from "@/lib";
import { createTaAction } from "../actions";


const createTaFormSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  department: z.string(),
  officeHours: z.string().optional(),
  password: z.string(),
});

export type CreateTaFormValues = z.infer<
  typeof createTaFormSchema
>;

export default function CreateTaForm({
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
  } = useForm<CreateTaFormValues>({
    resolver: zodResolver(createTaFormSchema),
    defaultValues: {},
  });

  const onSubmit = async (values: CreateTaFormValues) => {
    const createTaResponse = await createTaAction(values);

    if (!createTaResponse.success) {
      return toast.error(createTaResponse.error?.message);
    }

    toast.success("Teaching Assistant created successfully!");
    router.push(`/ta`);
  };

  return (
    <>
      <h1>Create a Teaching Assistant</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Full Name</label>
        <input type='text' {...register("fullName")} />
        {errors.fullName && <p>{errors.fullName.message}</p>}
        <label>Email</label>
        <input type='email' {...register("email")} />
        {errors.email && <p>{errors.email.message}</p>}
        <label>Department</label>
        <select {...register("department")}>
          <option disabled selected>
            Select a department
          </option>
          {departments.map((department) => (
            <option key={department.id} value={department._id}>
              {tt(locale, department.name)}
            </option>
          ))}
        </select>
        {errors.department && <p>{errors.department.message}</p>}
        <label>Office Hours</label>
        <input type='text' {...register("officeHours")} />
        {errors.officeHours && <p>{errors.officeHours.message}</p>}
        <label>Password</label>
        <input type='password' {...register("password")} />
        {errors.password && <p>{errors.password.message}</p>}
        <button className='btn' type='submit' disabled={isSubmitting}>
          {isSubmitting ? "Submitting" : "Submit"}
        </button>
      </form>
    </>
  );
}
