"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { updateConfigAction } from "./actions";

const updateConfigFormSchema = z.object({
  isCourseEnrollOpen: z.boolean().optional(),
  isDepartmentEnrollOpen: z.boolean().optional(),
  isGradProjectRegisterOpen: z.boolean().optional(),
});

export type UpdateConfigFormValues = z.infer<typeof updateConfigFormSchema>;

export default function UpdateConfigForm({ config }: { config: any }) {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<UpdateConfigFormValues>({
    resolver: zodResolver(updateConfigFormSchema),
    defaultValues: {
      isCourseEnrollOpen: config.isCourseEnrollOpen,
      isDepartmentEnrollOpen: config.isDepartmentEnrollOpen,
      isGradProjectRegisterOpen: config.isGradProjectRegisterOpen,
    },
  });

  const onSubmit = async (values: UpdateConfigFormValues) => {
    const updateConfigResponse = await updateConfigAction(values);

    if (!updateConfigResponse.success) {
      return toast.error(updateConfigResponse.error?.message);
    }

    toast.success("Configuration updated successfully!");
    router.push(`/config`);
  };

  return (
    <>
      <h2>Update Configuration Settings</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='form-group'>
          <label>Allow Course Enrollments?</label>
          <input
            type='checkbox'
            {...register("isCourseEnrollOpen")}
            defaultChecked={config.isCourseEnrollOpen}
          />
        </div>

        <div className='form-group'>
          <label>Allow Department Enrollments?</label>
          <input
            type='checkbox'
            {...register("isDepartmentEnrollOpen")}
            defaultChecked={config.isDepartmentEnrollOpen}
          />
        </div>

        <div className='form-group'>
          <label>Allow Graduation Project Registration?</label>
          <input
            type='checkbox'
            {...register("isGradProjectRegisterOpen")}
            defaultChecked={config.isGradProjectRegisterOpen}
          />
        </div>

        <div className='flex justify-center'>
          <button className='btn' type='submit' disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </>
  );
}
