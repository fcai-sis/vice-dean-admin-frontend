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

export default function CreateTaTeachingForm({ courses }: { courses: any[] }) {
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
      return toast.error(createTaTeachingResponse.error?.message);
    }

    toast.success("TA teaching created successfully!");
    router.push(`/teachings`);
  };

  return (
    <>
      <h1>Assign a TA to a Course</h1>

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
