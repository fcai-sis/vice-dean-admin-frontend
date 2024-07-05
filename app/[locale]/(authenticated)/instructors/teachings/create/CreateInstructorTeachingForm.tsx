"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { createInstructorTeachingAction } from "../actions";
import { tt } from "@/lib";
import { useCurrentLocale } from "@/locales/client";
import { Button } from "@/components/Buttons";

const createInstructorTeachingFormSchema = z.object({
  course: z.string(),
  email: z.string().email(),
});

export type CreateInstructorTeachingFormValues = z.infer<
  typeof createInstructorTeachingFormSchema
>;

export default function CreateInstructorTeachingForm({
  instructors,
  courses,
}: {
  instructors: any[];
  courses: any[];
}) {
  const locale = useCurrentLocale();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<CreateInstructorTeachingFormValues>({
    resolver: zodResolver(createInstructorTeachingFormSchema),
    defaultValues: {},
  });

  const onSubmit = async (values: CreateInstructorTeachingFormValues) => {
    const createInstructorTeachingResponse =
      await createInstructorTeachingAction(values);

    if (!createInstructorTeachingResponse.success) {
      for (const error of createInstructorTeachingResponse.errors) {
        toast.error(error.message);
      }
      return;
    }

    toast.success("Instructor teaching created successfully!");
    router.push(`/instructors/teachings`);
  };

  return (
    <>
      <h1>Assign an Instructor to a Course</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Instructor</label>
        <select {...register("email")} defaultValue={""} required>
          <option disabled value="">
            Select an Instructor
          </option>
          {instructors.map((instructor, index) => (
            <option key={index} value={instructor.email}>
              {instructor.fullName}
            </option>
          ))}
        </select>

        <label>Course</label>
        <select {...register("course")} defaultValue={""} required>
          <option disabled>Select a course</option>
          {courses.map((course) => (
            <option key={course.code} value={course.code}>
              ({course.code}) {tt(locale, course.name)}
            </option>
          ))}
        </select>
        {errors.course && <p>{errors.course.message}</p>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting" : "Submit"}
        </Button>
      </form>
    </>
  );
}
