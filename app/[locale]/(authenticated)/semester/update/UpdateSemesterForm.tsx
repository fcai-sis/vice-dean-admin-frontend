"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useState } from "react";
import { updateSemesterAction } from "../actions";
import { Button } from "@/components/Buttons";
import { PageHeader } from "@/components/PageBuilder";
import { tt } from "@/lib";
import { useCurrentLocale } from "@/locales/client";
import Spinner from "@/components/Spinner";

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
  const locale = useCurrentLocale();
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
      <PageHeader
        title={tt(locale, {
          en: "Update Semester",
          ar: "تحديث الفصل",
        })}
        actions={[]}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 justify-center items-center"
      >
        <select
          {...register("season")}
          defaultValue={semester.season}
          className="w-full"
        >
          <option value="FALL">
            {tt(locale, {
              en: "Fall",
              ar: "خريف",
            })}
          </option>
          <option value="SPRING">
            {tt(locale, {
              en: "Spring",
              ar: "ربيع",
            })}
          </option>
          <option value="SUMMER">
            {tt(locale, {
              en: "Summer",
              ar: "صيف",
            })}
          </option>
          <option value="WINTER">
            {tt(locale, {
              en: "Winter",
              ar: "شتاء",
            })}
          </option>
        </select>
        {errors.season && <span>{errors.season.message}</span>}

        <div className="flex flex-col gap-2 justify-center items-center">
          {courseFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <select
                {...register(`courses.${index}.course` as const)}
                defaultValue={field.course}
                onChange={(e) => handleCourseChange(index, e.target.value)}
              >
                <option value="" disabled>
                  {tt(locale, {
                    en: "Select Course",
                    ar: "اختر المقرر",
                  })}
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
              en: "Update Semester",
              ar: "تحديث الفصل",
            })
          )}
        </Button>
      </form>
    </>
  );
}
