"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { createSemesterAction } from "../actions";
import { useState } from "react";

const createSemesterFormSchema = z.object({
  season: z.enum(["FALL", "SPRING", "SUMMER", "WINTER"]),
  courses: z.array(
    z.object({
      course: z.string(),
    })
  ),
});

export type CreateSemesterFormValues = z.infer<typeof createSemesterFormSchema>;

export default function CreateSemesterForm({ courses }: { courses: any[] }) {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
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

  const handleCourseChange = (index: number, value: string) => {
    const newSelectedCourses = [...selectedCourses];
    newSelectedCourses[index] = value;
    setSelectedCourses(newSelectedCourses);
  };
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
      <h1>Create a Semester</h1>

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
            <select
              {...register(`courses.${index}.course` as const)}
              defaultValue={field.course}
              onChange={(e) => handleCourseChange(index, e.target.value)}
            >
              <option value='' disabled>
                Select a course
              </option>
              {courses
                .filter(
                  (course) =>
                    !selectedCourses.includes(course.code) ||
                    course.code === selectedCourses[index]
                )
                .map((course) => (
                  <option key={course.code} value={course.code}>
                    {course.code}
                  </option>
                ))}
            </select>
            {errors.courses && errors.courses[index] && (
              <span>{errors.courses[index]?.message}</span>
            )}
            <button
              type='button'
              onClick={() => {
                removeCourse(index);
                const newSelectedCourses = [...selectedCourses];
                newSelectedCourses.splice(index, 1);
                setSelectedCourses(newSelectedCourses);
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
