"use client";

import { Button } from "@/components/Buttons";
import { tt } from "@/lib";
import { useCurrentLocale } from "@/locales/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "iconoir-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { createLectureOrSectionAction } from "./actions";

const createLectureOrSectionFormSchema = z.object({
  slot: z.string(),
  type: z.enum(["lecture", "section"]),
  course: z.string(),
  hall: z.string(),
  group: z.string().optional(),
});

export type CreateLectureOrSectionFormValues = z.infer<
  typeof createLectureOrSectionFormSchema
>;

export default function CreateLectureOrSectionForm({
  slot,
  courses,
  halls,
}: {
  slot: string;
  courses: any[];
  halls: any[];
}) {
  const locale = useCurrentLocale();
  const [showModal, setShowModal] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    unregister,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateLectureOrSectionFormValues>({
    resolver: zodResolver(createLectureOrSectionFormSchema),
    defaultValues: {
      slot,
      type: "lecture",
      course: "",
      hall: "",
      group: "",
    },
  });
  const lectureOrSection = watch("type");

  useEffect(() => {
    if (lectureOrSection === "section") {
      register("group");
    } else {
      unregister("group");
    }
  }, [register, unregister, lectureOrSection]);

  const onSubmit = async (values: CreateLectureOrSectionFormValues) => {
    const createLectureOrSectionResponse = await createLectureOrSectionAction(
      values
    );

    if (!createLectureOrSectionResponse.success) {
      for (const error of createLectureOrSectionResponse.errors) {
        toast.error(error.message);
      }
      return;
    }
    toast.success(
      tt(locale, {
        en: "Lecture or Section created successfully",
        ar: "تم إنشاء المحاضرة أو السكشن بنجاح",
      })
    );
    setShowModal(false);
  };

  return (
    <>
      <div className="table-cell w-full">
        <Button
          className="w-full bg-blue-100 text-blue-500 [&_*]:stroke-blue-500 hover:bg-blue-200 text-center align-middle"
          onClick={() => setShowModal(true)}
        >
          <Plus />
          {tt(locale, {
            en: "Create Lecture or Section",
            ar: "إنشاء محاضرة أو سكشن",
          })}
        </Button>
      </div>
      <div
        className="z-50 w-full h-full fixed top-0 left-0 bg-black bg-opacity-65"
        style={{ display: showModal ? "block" : "none" }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col [&_*]:text-sm bg-white p-4 gap-4 rounded-lg w-min absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <label htmlFor="type">Type:</label>
          <select
            id="type"
            {...register("type")}
            className="rounded-lg border border-slate-200 p-2"
          >
            <option value="lecture">
              {tt(locale, {
                en: "Lecture",
                ar: "محاضرة",
              })}
            </option>
            <option value="section">
              {tt(locale, {
                en: "Section",
                ar: "سكشن",
              })}
            </option>
          </select>

          <label htmlFor="course">Course:</label>
          <select
            {...register("course")}
            className="rounded-lg border border-slate-200 p-2"
          >
            {courses.map((course) => (
              <option key={course.code} value={course.code}>
                {tt(locale, course.name)}
              </option>
            ))}
          </select>
          <label htmlFor="hall">Hall:</label>
          <select
            {...register("hall")}
            className="rounded-lg border border-slate-200 p-2"
          >
            {halls.map((hall) => (
              <option key={hall._id} value={hall._id}>
                {tt(locale, hall.name)}
              </option>
            ))}
          </select>
          {lectureOrSection == "section" && (
            <>
              <label htmlFor="group">Group:</label>
              <input
                type="text"
                {...register("group")}
                className="rounded-lg border border-slate-200 p-2"
              />
            </>
          )}
          <div className="flex gap-4 items-center justify-center">
            <Button type="submit" disabled={isSubmitting}>
              {tt(locale, {
                en: "Create",
                ar: "إنشاء",
              })}
            </Button>
            <Button variant="danger" onClick={() => setShowModal(false)}>
              {tt(locale, {
                en: "Cancel",
                ar: "إلغاء",
              })}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
