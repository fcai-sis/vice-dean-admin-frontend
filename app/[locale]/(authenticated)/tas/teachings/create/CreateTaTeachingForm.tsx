"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { createTaTeachingAction } from "../actions";

const createTaTeachingFormSchema = z.object({
  course: z.string(),
  email: z.string().email(),
});

export type CreateTaTeachingFormValues = z.infer<
  typeof createTaTeachingFormSchema
>;

export default function CreateTaTeachingForm({
  tas,
  courses,
}: {
  tas: any[];
  courses: any[];
}) {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaTeachingFormValues>({
    resolver: zodResolver(createTaTeachingFormSchema),
    defaultValues: {},
  });

  const onSubmit = async (values: CreateTaTeachingFormValues) => {
    const createTaTeachingResponse = await createTaTeachingAction(values);

    if (!createTaTeachingResponse.success) {
      for (const error of createTaTeachingResponse.errors) {
        toast.error(error.message);
      }
      return;
    }

    toast.success("TA teaching created successfully!");
    router.push(`/tas/teachings`);
  };

  return (
    <>
      <h1>Assign a TA to a Course</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>TA</label>
        <select {...register("email")} defaultValue={""} required>
          <option disabled value="">
            Select a TA
          </option>
          {tas.map((ta, index) => (
            <option key={index} value={ta.email}>
              {ta.fullName}
            </option>
          ))}
        </select>
        {errors.email && <p>{errors.email.message}</p>}

        <label>Course</label>
        <select {...register("course")} defaultValue={""} required>
          <option disabled value="">
            Select a course
          </option>
          {courses.map((course) => (
            <option key={course._id} value={course.code}>
              {course.code}
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
