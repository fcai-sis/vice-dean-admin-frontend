"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useCurrentLocale } from "@/locales/client";
import { tt } from "@/lib";
import { createSectionAction } from "../actions";

const createSectionFormSchema = z.object({
  course: z.string(),
  hall: z.string(),
  slot: z.string(),
  group: z.string().optional(),
});

export type CreateSectionFormValues = z.infer<typeof createSectionFormSchema>;

export default function CreateSectionForm({
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
  } = useForm<CreateSectionFormValues>({
    resolver: zodResolver(createSectionFormSchema),
    defaultValues: {},
  });

  const onSubmit = async (values: CreateSectionFormValues) => {
    const createSectionResponse = await createSectionAction(values);

    if (!createSectionResponse.success) {
      return toast.error(createSectionResponse.error?.message);
    }

    toast.success("Section created successfully!");
    router.push(`/sections`);
  };

  return (
    <>
      <h1>Create a Section</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Course</label>
        <select {...register("course")}>
          <option disabled selected>
            Select a course
          </option>
          {courses.map((course) => (
            <option key={course._id} value={course.code}>
              {course.code}
            </option>
          ))}
        </select>
        {errors.course && <p>{errors.course.message}</p>}
        <label>Hall</label>
        <select {...register("hall")}>
          <option disabled selected>
            Select a hall
          </option>
          {halls.map((hall) => (
            <option key={hall._id} value={hall._id}>
              {tt(locale, hall.name)}
            </option>
          ))}
        </select>
        {errors.hall && <p>{errors.hall.message}</p>}
        <label>Slot</label>
        <select {...register("slot")}>
          <option disabled selected>
            Select a slot
          </option>
          {slots.map((slot) => (
            <option key={slot._id} value={slot._id}>
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

        <label>Group</label>
        <input {...register("group")} />
        {errors.group && <p>{errors.group.message}</p>}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting" : "Submit"}
        </Button>
      </form>
    </>
  );
}
