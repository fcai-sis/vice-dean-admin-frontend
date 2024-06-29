"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { createSemesterAction } from "../actions";

const createSemesterFormSchema = z.object({
  season: z.enum(["FALL", "SPRING", "SUMMER", "WINTER"]),
  courses: z.array(
    z.object({
      course: z.string(),
    })
  ),
});

export type CreateSemesterFormValues = z.infer<typeof createSemesterFormSchema>;

export default function CreateSemesterForm() {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateSemesterFormValues>({
    resolver: zodResolver(createSemesterFormSchema),
    defaultValues: {
      season: "FALL",
      courses: [{ course: "" }],
    },
  });

  const {
    fields: courseFields,
    append: addCourse,
    remove: removeCourse,
  } = useFieldArray({
    control,
    name: "courses",
  });

  const onSubmit = async (values: CreateSemesterFormValues) => {
    const createSemesterResponse = await createSemesterAction(values);

    if (!createSemesterResponse.success) {
      return toast.error(createSemesterResponse.error?.message);
    }

    toast.success("Semester created successfully!");
    router.push(`/semester`);
  };

  return (
    <>
      <h1>Courses</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <select {...register("season")}>
          <option value='FALL'>Fall</option>
          <option value='SPRING'>Spring</option>
          <option value='SUMMER'>Summer</option>
          <option value='WINTER'>Winter</option>
        </select>
        {errors.season && <span>{errors.season.message}</span>}

        {courseFields.map((field, index) => (
          <div key={field.id}>
            <input
              type='text'
              {...register(`courses.${index}.course` as const)}
              placeholder='Course'
            />
            {errors.courses && errors.courses[index] && (
              <span>{errors.courses[index]?.message}</span>
            )}
            <button
              type='button'
              onClick={() => {
                removeCourse(index);
              }}
            >
              Remove Course
            </button>
          </div>
        ))}
        <button type='button' onClick={() => addCourse({ course: "" })}>
          Add Course
        </button>

        <button className='btn' type='submit' disabled={isSubmitting}>
          {isSubmitting ? "Submitting" : "Submit"}
        </button>
      </form>
    </>
  );
}
