"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { createHallAction } from "../actions";

const createHallFormSchema = z.object({
  name: z.object({
    en: z.string(),
    ar: z.string(),
  }),
  capacity: z.number(),
});

export type CreateHallFormValues = z.infer<typeof createHallFormSchema>;

export default function CreateHallForm() {
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
      <h1>Create Hall</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Hall Name</label>
        <input
          type='text'
          placeholder='English name'
          {...register("name.en")}
        />
        {errors.name?.en && <p>{errors.name.en.message}</p>}
        <input type='text' placeholder='Arabic name' {...register("name.ar")} />
        {errors.name?.ar && <p>{errors.name.ar.message}</p>}
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
