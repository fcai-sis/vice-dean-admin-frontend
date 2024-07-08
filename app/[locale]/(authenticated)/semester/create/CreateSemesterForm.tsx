"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { createSemesterAction } from "../actions";
import { useState } from "react";
import { Button } from "@/components/Buttons";
import { PageHeader } from "@/components/PageBuilder";
import { tt } from "@/lib";
import { useCurrentLocale } from "@/locales/client";
import Spinner from "@/components/Spinner";

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
  const locale = useCurrentLocale();
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
      for (const error of createSemesterResponse.errors) {
        toast.error(error.message);
      }
      return;
    }

    toast.success("Semester created successfully!");
    router.push(`/semester`);
  };

  return (
    <>
      <PageHeader
        title={tt(locale, {
          en: "Create Semester",
          ar: "إنشاء فصل دراسي",
        })}
        actions={[]}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 justify-center items-center"
      >
        <select {...register("season")} defaultValue="FALL" className="w-full">
          <option value="FALL">{tt(locale, { en: "Fall", ar: "خريف" })}</option>
          <option value="SPRING">
            {tt(locale, { en: "Spring", ar: "ربيع" })}
          </option>
          <option value="SUMMER">
            {tt(locale, { en: "Summer", ar: "صيف" })}
          </option>
          <option value="WINTER">
            {tt(locale, { en: "Winter", ar: "شتاء" })}
          </option>
        </select>
        {errors.season && <span>{errors.season.message}</span>}

        <div className="flex flex-col gap-2 justify-center items-start">
          {courseFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <select
                {...register(`courses.${index}.course` as const)}
                defaultValue={field.course}
                onChange={(e) => handleCourseChange(index, e.target.value)}
              >
                <option value="" disabled>
                  {tt(locale, { en: "Select Course", ar: "اختر المقرر" })}
                </option>
                {courses
                  .filter(
                    (course) =>
                      !selectedCourses.includes(course.code) ||
                      course.code === selectedCourses[index]
                  )
                  .map((course) => (
                    <option key={course.code} value={course.code}>
                      ({course.code}) {tt(locale, course.name)}
                    </option>
                  ))}
              </select>
              {errors.courses && errors.courses[index] && (
                <span>{errors.courses[index]?.message}</span>
              )}
              <Button
                variant="danger"
                onClick={() => {
                  removeCourse(index);
                  const newSelectedCourses = [...selectedCourses];
                  newSelectedCourses.splice(index, 1);
                  setSelectedCourses(newSelectedCourses);
                }}
              >
                {tt(locale, {
                  en: "Remove Course",
                  ar: "إزالة المقرر",
                })}
              </Button>
            </div>
          ))}

          <Button
            onClick={() => addCourse({ course: "" })}
            className="w-full flex justify-center items-center"
          >
            {tt(locale, {
              en: "Add Course",
              ar: "إضافة مقرر",
            })}
          </Button>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Spinner />
          ) : (
            tt(locale, {
              en: "Create Semester",
              ar: "إنشاء الفصل",
            })
          )}
        </Button>
      </form>
    </>
  );
}
