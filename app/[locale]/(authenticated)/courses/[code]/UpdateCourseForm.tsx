"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "@/components/Buttons";
import { tt } from "@/lib";
import { useCurrentLocale } from "@/locales/client";
import Spinner from "@/components/Spinner";
import { updateCourseAction } from "./actions";
import { useState } from "react";
import { PageHeader } from "@/components/PageBuilder";

const deleteCourseFormSchema = z.object({
  code: z.string(),
  name: z.object({
    en: z.string(),
    ar: z.string(),
  }),
  description: z.object({
    en: z.string(),
    ar: z.string(),
  }),
  courseType: z.enum(["MANDATORY", "ELECTIVE", "GRADUATION"]),
  creditHours: z.number(),
  departments: z.array(z.object({ department: z.string() })),
  prerequisites: z.array(z.object({ prerequisite: z.string() })),
});

export type UpdateCourseFormValues = z.infer<typeof deleteCourseFormSchema>;

export default function UpdateCourseForm({
  course,
  allDepartments,
  allCourses,
}: {
  course: any;
  allDepartments: any[];
  allCourses: any[];
}) {
  const locale = useCurrentLocale();
  const router = useRouter();

  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(
    course.departments.map((department: any) => department.code)
  );
  const [selectedPrerequisites, setSelectedPrerequisites] = useState<string[]>(
    course.prerequisites.map((prerequisite: any) => prerequisite.code)
  );

  const {
    handleSubmit,
    control,
    register,
    formState: { errors, isSubmitting },
  } = useForm<UpdateCourseFormValues>({
    resolver: zodResolver(deleteCourseFormSchema),
    defaultValues: {
      code: course.code,
      name: course.name,
      description: course.description,
      courseType: course.courseType,
      creditHours: course.creditHours,
      departments: course.departments.map((department: any) => department.code),
      prerequisites: course.prerequisites.map(
        (prerequisite: any) => prerequisite.code
      ),
    },
  });

  const {
    fields: prerequisitesFields,
    remove: removePrerequisite,
    append: appendPrerequisite,
  } = useFieldArray({
    control: control,
    name: "prerequisites",
  });

  const {
    fields: departmentFields,
    remove: removeDepartment,
    append: appendDepartment,
  } = useFieldArray({
    control: control,
    name: "departments",
  });

  const handleDepartmentChange = (index: number, value: string) => {
    const newSelectedDepartments = [...selectedDepartments];
    newSelectedDepartments[index] = value;
    setSelectedDepartments(newSelectedDepartments);
  };

  const handleRemoveDepartment = (index: number) => {
    const newSelectedDepartments = selectedDepartments.filter(
      (_, i) => i !== index
    );
    setSelectedDepartments(newSelectedDepartments);
    removeDepartment(index);
  };

  const handlePrerequisiteChange = (index: number, value: string) => {
    const newSelectedPrerequisites = [...selectedPrerequisites];
    newSelectedPrerequisites[index] = value;
    setSelectedPrerequisites(newSelectedPrerequisites);
  };

  const handleRemovePrerequisite = (index: number) => {
    const newSelectedPrerequisites = selectedPrerequisites.filter(
      (_, i) => i !== index
    );
    setSelectedPrerequisites(newSelectedPrerequisites);
    removePrerequisite(index);
  };

  const onSubmit = async (values: UpdateCourseFormValues) => {
    console.log(values);

    const response = await updateCourseAction(values);

    if (!response.success) {
      console.log(response);

      for (const error of response.errors) {
        toast.error(error.message);
      }
      return;
    }

    toast.success(
      tt(locale, {
        en: "Course updated successfully",
        ar: "تم تحديث المقرر بنجاح",
      })
    );

    router.push(`/courses`);
  };

  return (
    <>
      <PageHeader
        title={tt(locale, {
          en: "Update Course",
          ar: "تحديث المقرر",
        })}
        actions={[]}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-lg border border-slate-200 bg-white p-4 w-full gap-4 flex flex-col"
      >
        <div className="flex gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="code">
                {tt(locale, {
                  en: "Code",
                  ar: "الرمز",
                })}
              </label>
              <p className="text-slate-400">{course.code}</p>
              <label htmlFor="name.en">
                {tt(locale, {
                  en: "Name (English)",
                  ar: "الاسم (إنجليزي)",
                })}
              </label>
              <input
                type="text"
                id="name.en"
                {...register("name.en")}
                className={errors.name?.en ? "border-red-500" : ""}
              />
              <span className="text-red-500">{errors.name?.en?.message}</span>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="name.ar">
                {tt(locale, {
                  en: "Name (Arabic)",
                  ar: "الاسم (عربي)",
                })}
              </label>
              <input
                type="text"
                id="name.ar"
                {...register("name.ar")}
                className={errors.name?.ar ? "border-red-500" : ""}
              />
              <span className="text-red-500">{errors.name?.ar?.message}</span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="description.en">
                {tt(locale, {
                  en: "Description (English)",
                  ar: "الوصف (إنجليزي)",
                })}
              </label>
              <textarea
                rows={3}
                id="description.en"
                {...register("description.en")}
                className={errors.description?.en ? "border-red-500" : ""}
              />
              <span className="text-red-500">
                {" "}
                {errors.description?.en?.message}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="description.ar">
                {tt(locale, {
                  en: "Description (Arabic)",
                  ar: "الوصف (عربي)",
                })}
              </label>
              <textarea
                rows={3}
                id="description.ar"
                className={errors.description?.ar ? "border-red-500" : ""}
                {...register("description.ar")}
              />
              <span className="text-red-500">
                {errors.description?.ar?.message}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="courseType">
                {tt(locale, {
                  en: "Course Type",
                  ar: "نوع المقرر",
                })}
              </label>
              <select
                id="courseType"
                {...register("courseType")}
                className={errors.courseType ? "border-red-500" : ""}
              >
                <option value="MANDATORY">
                  {tt(locale, {
                    en: "Mandatory",
                    ar: "إلزامي",
                  })}
                </option>
                <option value="ELECTIVE">
                  {tt(locale, {
                    en: "Elective",
                    ar: "اختياري",
                  })}
                </option>
                <option value="GRADUATION">
                  {tt(locale, {
                    en: "Graduation",
                    ar: "تخرج",
                  })}
                </option>
              </select>
              <span className="text-red-500">{errors.courseType?.message}</span>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="creditHours">
                {tt(locale, {
                  en: "Credit Hours",
                  ar: "ساعات الائتمان",
                })}
              </label>
              <input
                type="number"
                id="creditHours"
                className={errors.creditHours ? "border-red-500" : ""}
                {...register("creditHours", {
                  valueAsNumber: true,
                })}
              />
              <span className="text-red-500">
                {errors.creditHours?.message}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 rounded-lg border border-slate-200 p-4">
              <label htmlFor="prerequisites">
                {tt(locale, {
                  en: "Prerequisites",
                  ar: "المتطلبات السابقة",
                })}
              </label>
              {prerequisitesFields.map((field, index) => (
                <div key={field.id} className="flex gap-4">
                  <span className="text-red-500">
                    {errors.prerequisites &&
                      errors.prerequisites[index]?.prerequisite?.message}
                  </span>

                  <select
                    {...register(
                      `prerequisites.${index}.prerequisite` as const
                    )}
                    defaultValue={selectedPrerequisites[index]}
                    className={
                      errors.prerequisites &&
                      errors.prerequisites[index]?.prerequisite
                        ? "border-red-500"
                        : ""
                    }
                    onChange={(e) =>
                      handlePrerequisiteChange(index, e.target.value)
                    }
                  >
                    <option value="" disabled>
                      {tt(locale, {
                        en: "Select Prerequisite",
                        ar: "اختر المتطلب السابق",
                      })}
                    </option>
                    {allCourses
                      .filter(
                        (c) =>
                          !selectedPrerequisites.includes(c.code) ||
                          c.code === selectedPrerequisites[index]
                      )
                      .map((course) => (
                        <option key={course.code} value={course.code}>
                          {tt(locale, course.name)}
                        </option>
                      ))}
                  </select>
                  <Button
                    variant="danger"
                    onClick={() => handleRemovePrerequisite(index)}
                  >
                    {tt(locale, {
                      en: "Remove",
                      ar: "إزالة",
                    })}
                  </Button>
                </div>
              ))}
              <Button onClick={() => appendPrerequisite({ prerequisite: "" })}>
                {tt(locale, {
                  en: "Add Prerequisite",
                  ar: "إضافة متطلب سابق",
                })}
              </Button>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 rounded-lg border border-slate-200 p-4">
              <label htmlFor="departments">
                {tt(locale, {
                  en: "Departments",
                  ar: "الأقسام",
                })}
              </label>
              {departmentFields.map((field, index) => (
                <div key={field.id} className="flex gap-4">
                  <select
                    {...register(`departments.${index}.department` as const)}
                    defaultValue={selectedDepartments[index]}
                    className={
                      errors.departments &&
                      errors.departments[index]?.department
                        ? "border-red-500"
                        : ""
                    }
                    onChange={(e) =>
                      handleDepartmentChange(index, e.target.value)
                    }
                  >
                    <option value="" disabled>
                      {tt(locale, {
                        en: "Select Department",
                        ar: "اختر القسم",
                      })}
                    </option>
                    {allDepartments
                      .filter(
                        (d) =>
                          !selectedDepartments.includes(d.code) ||
                          d.code === selectedDepartments[index]
                      )
                      .map((department) => (
                        <option key={department.code} value={department.code}>
                          {tt(locale, department.name)}
                        </option>
                      ))}
                  </select>
                  <span className="text-red-500">
                    {errors.departments &&
                      errors.departments[index]?.department?.message}
                  </span>
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveDepartment(index)}
                  >
                    {tt(locale, {
                      en: "Remove",
                      ar: "إزالة",
                    })}
                  </Button>
                </div>
              ))}
              <Button onClick={() => appendDepartment({ department: "" })}>
                {tt(locale, {
                  en: "Add Department",
                  ar: "إضافة قسم",
                })}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit">
            {isSubmitting ? (
              <Spinner />
            ) : (
              tt(locale, {
                en: "Update Course",
                ar: "تحديث المقرر",
              })
            )}
          </Button>
        </div>
      </form>
    </>
  );
}
