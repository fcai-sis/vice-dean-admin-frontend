"use client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createSlotAction } from "../actions";
import { Plus } from "iconoir-react";
import { tt } from "@/lib";
import { useCurrentLocale } from "@/locales/client";
import { useEffect, useState } from "react";

const DayEnum = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;
type DayEnumType = (typeof DayEnum)[number];

export type CreateSlotFormProps = {
  start: {
    hour: number;
    minute: number;
  };
  end: {
    hour: number;
    minute: number;
  };
  day: DayEnumType;
};

export function CreateNewTimeRangeSlotForm({ day }: { day: DayEnumType }) {
  const locale = useCurrentLocale();

  const router = useRouter();

  const [showForm, setShowForm] = useState<boolean>(false);

  const [start, setStart] = useState<string>(`${new Date().getHours()}:00`);
  const [end, setEnd] = useState<string>(`${new Date().getHours() + 1}:00`);

  const onSubmit = async () => {
    console.log("clicked");

    const starthour = start.split(":")[0];
    const startminute = start.split(":")[1];
    const endhour = end.split(":")[0];
    const endminute = end.split(":")[1];

    if (starthour === null || startminute === null) {
      return toast.error("Please enter start time");
    }

    if (endhour === null || endminute === null) {
      return toast.error("Please enter end time");
    }

    const createSlotResponse = await createSlotAction({
      start: {
        hour: parseInt(starthour),
        minute: parseInt(startminute),
      },
      end: {
        hour: parseInt(endhour),
        minute: parseInt(endminute),
      },
      day,
    });

    if (!createSlotResponse.success) {
      return toast.error(createSlotResponse.error?.message);
    }

    setShowForm(false);
    toast.success("Slot created successfully!");
    router.push(`/slots`);
  };

  const color = showForm
    ? "bg-white border border-slate-200"
    : "bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors duration-300";

  useEffect(() => {
    const s = start;

    console.log("start", s);
  }, [start]);

  return (
    <div
      className={`rounded-lg table-cell p-2 ${color}`}
      onClick={(e) => {
        console.log("clicked");
        setShowForm(true);
      }}
    >
      {showForm ? (
        <div className="flex flex-col [&_*]:text-sm ">
          <div className="flex gap-2 items-center">
            <label htmlFor="start">
              {tt(locale, {
                en: "Start",
                ar: "البداية",
              })}
            </label>
            <input
              type="time"
              value={start}
              className="p-2 border border-gray-300 rounded-lg"
              onChange={(e) => {
                setStart(e.target.value);
              }}
            />
            <label htmlFor="end">
              {tt(locale, {
                en: "End",
                ar: "النهاية",
              })}
            </label>
            <input
              type="time"
              value={end}
              className="p-2 border border-gray-300 rounded-lg"
              onChange={(e) => {
                setEnd(e.target.value);
              }}
            />

            <button
              className="bg-blue-500 rounded-lg text-white px-2 py-2"
              onClick={onSubmit}
            >
              Submit
            </button>
            <button
              className="bg-red-500 rounded-lg text-white px-2 py-2"
              onClick={(e) => {
                console.log("canceled");
                e.stopPropagation();
                setShowForm(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-sm flex items-center justify-center gap-2 text-blue-500">
          <Plus className="[&_*]:stroke-blue-500" />
          {tt(locale, {
            en: "Create with new time slot",
            ar: "إنشاء بفترة زمنية جديدة",
          })}
        </p>
      )}
    </div>
  );
}

export default function CreateSlotForm({
  start,
  end,
  day,
}: CreateSlotFormProps) {
  const router = useRouter();

  const onSubmit = async () => {
    console.log("clicked");

    const createSlotResponse = await createSlotAction({ start, end, day });

    if (!createSlotResponse.success) {
      return toast.error(createSlotResponse.error?.message);
    }

    toast.success("Slot created successfully!");
    router.push(`/slots`);
  };

  return (
    <div
      className="rounded-lg table-cell p-2 bg-white border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors duration-300"
      onClick={onSubmit}
    >
      <p className="flex justify-center items-center">
        <Plus />
      </p>
    </div>
  );

  // return (
  //   <>
  //     <h1>Create Slot</h1>

  //     <form onSubmit={handleSubmit(onSubmit)}>
  //       <div>
  //         <label>Start Hour</label>
  //         <input
  //           type="number"
  //           {...register("start.hour", { valueAsNumber: true })}
  //         />
  //         {errors.start?.hour && <p>{errors.start.hour.message}</p>}
  //       </div>

  //       <div>
  //         <label>Start Minute</label>
  //         <input
  //           type="number"
  //           {...register("start.minute", { valueAsNumber: true })}
  //         />
  //         {errors.start?.minute && <p>{errors.start.minute.message}</p>}
  //       </div>

  //       <div>
  //         <label>End Hour</label>
  //         <input
  //           type="number"
  //           {...register("end.hour", { valueAsNumber: true })}
  //         />
  //         {errors.end?.hour && <p>{errors.end.hour.message}</p>}
  //       </div>

  //       <div>
  //         <label>End Minute</label>
  //         <input
  //           type="number"
  //           {...register("end.minute", { valueAsNumber: true })}
  //         />
  //         {errors.end?.minute && <p>{errors.end.minute.message}</p>}
  //       </div>
  //       <div>
  //         <label>Day</label>
  //         <select {...register("day")}>
  //           <option value="SUNDAY">Sunday</option>
  //           <option value="MONDAY">Monday</option>
  //           <option value="TUESDAY">Tuesday</option>
  //           <option value="WEDNESDAY">Wednesday</option>
  //           <option value="THURSDAY">Thursday</option>
  //           <option value="FRIDAY">Friday</option>
  //           <option value="SATURDAY">Saturday</option>
  //         </select>
  //         {errors.day && <p>{errors.day.message}</p>}
  //       </div>

  //       <button className="btn" type="submit" disabled={isSubmitting}>
  //         {isSubmitting ? "Submitting" : "Submit"}
  //       </button>
  //     </form>
  //   </>
  // );
}
