"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { createInstructorTeachingAction } from "../actions";

const createInstructorTeachingFormSchema = z.object({
  course: z.string(),
  email: z.string().email(),
});

export type CreateInstructorTeachingFormValues = z.infer<
  typeof createInstructorTeachingFormSchema
>;

export default function CreateInstructorTeachingForm({
  courses,
}: {
  courses: any[];
}) {
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
      return toast.error(createInstructorTeachingResponse.error?.message);
    }

    toast.success("Instructor teaching created successfully!");
    router.push(`/teachings`);
  };

  return (
    <>
      <h1>Assign an Instructor to a Course</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email</label>
        <input type='email' {...register("email")} />
        {errors.email && <p>{errors.email.message}</p>}

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

        <button className='btn' type='submit' disabled={isSubmitting}>
          {isSubmitting ? "Submitting" : "Submit"}
        </button>
      </form>
    </>
  );
}
