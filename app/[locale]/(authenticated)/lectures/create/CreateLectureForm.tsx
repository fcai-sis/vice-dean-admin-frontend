"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useCurrentLocale } from "@/locales/client";
import { tt } from "@/lib";
import { createLectureAction } from "../actions";
import { Button } from "@/components/Buttons";

const createLectureFormSchema = z.object({
  course: z.string(),
  hall: z.string(),
  slot: z.string(),
});

export type CreateLectureFormValues = z.infer<typeof createLectureFormSchema>;

export default function CreateLectureForm({
  courses,
  slots,
  halls,
}: {
  courses: any[];
  slots: any[];
  halls: any[];
}) {
  const locale = useCurrentLocale();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<CreateLectureFormValues>({
    resolver: zodResolver(createLectureFormSchema),
    defaultValues: {},
  });

  const onSubmit = async (values: CreateLectureFormValues) => {
    const createLectureResponse = await createLectureAction(values);

    if (!createLectureResponse.success) {
      return toast.error(createLectureResponse.error?.message);
    }

    toast.success("Lecture created successfully!");
    router.push(`/lectures`);
  };

  return (
    <>
      <h1>Create a Lecture</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Course</label>
        <select {...register("course")} defaultValue={""} required>
          <option disabled>Select a course</option>
          {courses.map((course, index) => (
            <option key={index} value={course.code}>
              {course.code}
            </option>
          ))}
        </select>
        {errors.course && <p>{errors.course.message}</p>}
        <label>Hall</label>
        <select {...register("hall")} defaultValue={""} required>
          <option disabled>Select a hall</option>
          {halls.map((hall, index) => (
            <option key={index} value={hall._id}>
              {tt(locale, hall.name)}
            </option>
          ))}
        </select>
        {errors.hall && <p>{errors.hall.message}</p>}
        <label>Slot</label>
        <select {...register("slot")} defaultValue={""} required>
          <option disabled>Select a slot</option>
          {slots.map((slot, index) => (
            <option key={index} value={slot._id}>
              {`${slot.start.hour
                .toString()
                .padStart(2, "0")}:${slot.start.minute
                .toString()
                .padStart(2, "0")}`}{" "}
              -{" "}
              {`${slot.end.hour.toString().padStart(2, "0")}:${slot.end.minute
                .toString()
                .padStart(2, "0")}`}{" "}
              {slot.day}
            </option>
          ))}
        </select>
        {errors.slot && <p>{errors.slot.message}</p>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting" : "Submit"}
        </Button>
      </form>
    </>
  );
}
