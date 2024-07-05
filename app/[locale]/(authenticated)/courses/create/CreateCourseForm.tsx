"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { createCourseAction } from "../actions";
import { CourseTypeEnum } from "@fcai-sis/shared-models";

const createCourseFormSchema = z.object({
  name: z.object({
    en: z.string(),
    ar: z.string(),
  }),
  code: z.string(),
  description: z.string(),
  creditHours: z.number(),
  // courseType: z.enum([CourseTypeEnum[0], CourseTypeEnum[1], CourseTypeEnum[2]]),
  departments: z.array(z.string()),
  prerequisites: z.array(z.string()),
});

export type CreateCourseFormValues = z.infer<typeof createCourseFormSchema>;

export default function CreateCourseForm() {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<CreateCourseFormValues>({
    resolver: zodResolver(createCourseFormSchema),
    defaultValues: {
      name: { en: "", ar: "" },
      code: "",
      description: "",
      creditHours: 0,
      // courseType: CourseTypeEnum[0],
      departments: [],
      prerequisites: [],
    },
  });

  const onSubmit = async (values: CreateCourseFormValues) => {
    const createCourseResponse = await createCourseAction(values);

    if (!createCourseResponse.success) {
      return toast.error(createCourseResponse.error?.message);
    }

    toast.success("Course created successfully!");
    router.push(`/courses`);
  };

  return (
    <>
      <h1>Create Course</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Hall Name</label>
        <input
          type="text"
          placeholder="English name"
          {...register("name.en")}
        />
        {errors.name?.en && <p>{errors.name.en.message}</p>}
        <input type="text" placeholder="Arabic name" {...register("name.ar")} />
        {errors.name?.ar && <p>{errors.name.ar.message}</p>}
        <label>Code</label>
        <input type="text" placeholder="Code" {...register("code")} />
        {errors.code && <p>{errors.code.message}</p>}
        <label>Description</label>
        <input
          type="text"
          placeholder="Description"
          {...register("description")}
        />
        {errors.description && <p>{errors.description.message}</p>}
        <label>Credit Hours</label>
        <input
          type="number"
          placeholder="Credit Hours"
          {...register("creditHours", { valueAsNumber: true })}
        />
        {errors.creditHours && <p>{errors.creditHours.message}</p>}
        <label>Course Type</label>
        {/* <select {...register("courseType")}>
          <option value={CourseTypeEnum[0]}>Mandatory</option>
          <option value={CourseTypeEnum[1]}>Elective</option>
          <option value={CourseTypeEnum[2]}>Graduation</option>
        </select> */}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting" : "Submit"}
        </Button>
      </form>
    </>
  );
}
