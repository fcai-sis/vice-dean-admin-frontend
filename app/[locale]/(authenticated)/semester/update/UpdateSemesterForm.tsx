"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useState } from "react";
import { updateSemesterAction } from "../actions";
import { Button } from "@/components/Buttons";

const updateSemesterFormSchema = z.object({
  semesterId: z.string(),
  season: z.enum(["FALL", "SPRING", "SUMMER", "WINTER"]).optional(),
  courses: z
    .array(
      z.object({
        course: z.string(),
      })
    )
    .optional(),
});

export type UpdateSemesterFormValues = z.infer<typeof updateSemesterFormSchema>;

export default function UpdateSemesterForm({
  courses,
  semester,
  setCourses,
}: {
  courses: any[];
  semester: any;
  setCourses: any[];
}) {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const router = useRouter();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UpdateSemesterFormValues>({
    resolver: zodResolver(updateSemesterFormSchema),
    defaultValues: {
      semesterId: semester._id,
      season: semester.season,
      courses: setCourses.map((course) => ({ course: course.code })),
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

  const onSubmit = async (values: UpdateSemesterFormValues) => {
    const updateSemesterResponse = await updateSemesterAction(values);

    if (!updateSemesterResponse.success) {
      for (const error of updateSemesterResponse.errors) {
        toast.error(error.message);
      }
      return;
    }

    toast.success("Semester updated successfully!");
    router.push(`/semester`);
  };

  return (
    <>
      <h1>Update Latest Semester</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <select {...register("season")} defaultValue={semester.season}>
          <option value="FALL">Fall</option>
          <option value="SPRING">Spring</option>
          <option value="SUMMER">Summer</option>
          <option value="WINTER">Winter</option>
        </select>
        {errors.season && <span>{errors.season.message}</span>}

        {courseFields.map((field, index) => (
          <div key={field.id}>
            <select
              {...register(`courses.${index}.course` as const)}
              defaultValue={field.course}
              onChange={(e) => handleCourseChange(index, e.target.value)}
            >
              <option value="" disabled>
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
            <Button
              onClick={() => {
                removeCourse(index);
                const newSelectedCourses = [...selectedCourses];
                newSelectedCourses.splice(index, 1);
                setSelectedCourses(newSelectedCourses);
              }}
            >
              Remove Course
            </Button>
          </div>
        ))}
        <Button onClick={() => addCourse({ course: "" })}>Add Course</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting" : "Submit"}
        </Button>
      </form>
    </>
  );
}
