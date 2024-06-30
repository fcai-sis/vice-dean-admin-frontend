"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { createDepartmentAction } from "../actions";

const createDepartmentFormSchema = z.object({
  name: z.object({
    en: z.string(),
    ar: z.string(),
  }),
  code: z.string(),
  program: z.enum(["GENERAL", "SPECIAL"]),
  capacity: z.number(),
});

export type CreateDepartmentFormValues = z.infer<typeof createDepartmentFormSchema>;

export default function CreateDepartmentForm() {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<CreateDepartmentFormValues>({
    resolver: zodResolver(createDepartmentFormSchema),
    defaultValues: {
      name: { en: "", ar: "" },
      code: "",
      program: "GENERAL",
      capacity: 0,
    },
  });

  const onSubmit = async (values: CreateDepartmentFormValues) => {
    const createDepartmentResponse = await createDepartmentAction(values);

    if (!createDepartmentResponse.success) {
      return toast.error(createDepartmentResponse.error?.message);
    }

    toast.success("Department created successfully!");
    router.push(`/departments`);
  };

  return (
    <>
      <h1>Create Department</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Department Name</label>
        <input
          type='text'
          placeholder='English name'
          {...register("name.en")}
        />
        {errors.name?.en && <p>{errors.name.en.message}</p>}
        <input type='text' placeholder='Arabic name' {...register("name.ar")} />
        {errors.name?.ar && <p>{errors.name.ar.message}</p>}
        <label>Code</label>
        <input type='text' placeholder='Code' {...register("code")} />
        {errors.code && <p>{errors.code.message}</p>}
        <label>Program</label>
        <select {...register("program")}>
          <option value='GENERAL'>General</option>
          <option value='SPECIAL'>Special</option>
        </select>
        <label>Capacity</label>
        <input
          type='number'
          placeholder='Capacity'
          {...register("capacity", { valueAsNumber: true })}
        />
        {errors.capacity && <p>{errors.capacity.message}</p>}

        <button className='btn' type='submit' disabled={isSubmitting}>
          {isSubmitting ? "Submitting" : "Submit"}
        </button>
      </form>
    </>
  );
}
