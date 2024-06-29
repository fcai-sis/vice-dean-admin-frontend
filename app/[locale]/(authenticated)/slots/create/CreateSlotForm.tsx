"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { createSlotAction } from "../actions";

const createSlotFormSchema = z.object({
  start: z.object({
    hour: z.number().int().min(0).max(23),
    minute: z.number().int().min(0).max(59),
  }),
  end: z.object({
    hour: z.number().int().min(0).max(23),
    minute: z.number().int().min(0).max(59),
  }),
  day: z.enum([
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ]),
});

export type CreateSlotFormValues = z.infer<typeof createSlotFormSchema>;

export default function CreateSlotForm() {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<CreateSlotFormValues>({
    resolver: zodResolver(createSlotFormSchema),
    defaultValues: {},
  });

  const onSubmit = async (values: CreateSlotFormValues) => {
    const createSlotResponse = await createSlotAction(values);

    if (!createSlotResponse.success) {
      return toast.error(createSlotResponse.error?.message);
    }

    toast.success("Slot created successfully!");
    router.push(`/slots`);
  };

  return (
    <>
      <h1>Create Slot</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Start Hour</label>
          <input
            type='number'
            {...register("start.hour", { valueAsNumber: true })}
          />
          {errors.start?.hour && <p>{errors.start.hour.message}</p>}
        </div>

        <div>
          <label>Start Minute</label>
          <input
            type='number'
            {...register("start.minute", { valueAsNumber: true })}
          />
          {errors.start?.minute && <p>{errors.start.minute.message}</p>}
        </div>

        <div>
          <label>End Hour</label>
          <input
            type='number'
            {...register("end.hour", { valueAsNumber: true })}
          />
          {errors.end?.hour && <p>{errors.end.hour.message}</p>}
        </div>

        <div>
          <label>End Minute</label>
          <input
            type='number'
            {...register("end.minute", { valueAsNumber: true })}
          />
          {errors.end?.minute && <p>{errors.end.minute.message}</p>}
        </div>
        <div>
          <label>Day</label>
          <select {...register("day")}>
            <option value='SUNDAY'>Sunday</option>
            <option value='MONDAY'>Monday</option>
            <option value='TUESDAY'>Tuesday</option>
            <option value='WEDNESDAY'>Wednesday</option>
            <option value='THURSDAY'>Thursday</option>
            <option value='FRIDAY'>Friday</option>
            <option value='SATURDAY'>Saturday</option>
          </select>
          {errors.day && <p>{errors.day.message}</p>}
        </div>

        <button className='btn' type='submit' disabled={isSubmitting}>
          {isSubmitting ? "Submitting" : "Submit"}
        </button>
      </form>
    </>
  );
}
