"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createSlotAction } from "../actions";
import { Plus } from "iconoir-react";
import { tt } from "@/lib";
import { useCurrentLocale } from "@/locales/client";
import { ComponentProps, useEffect, useState } from "react";
import { Button } from "@/components/Buttons";

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

  useEffect(() => {
    const s = start;

    console.log("start", s);
  }, [start]);

  return (
    <NewTimeRangeForm
      day={day}
      start={start}
      end={end}
      setStart={setStart}
      setEnd={setEnd}
      showForm={showForm}
      setShowForm={setShowForm}
      onSubmit={onSubmit}
    />
  );
}

function NewTimeRangeForm({
  day,
  start,
  end,
  setStart,
  setEnd,
  showForm,
  setShowForm,
  onSubmit,
}: {
  day: DayEnumType;
  start: string;
  end: string;
  setStart: (start: string) => void;
  setEnd: (end: string) => void;
  showForm: boolean;
  setShowForm: (showForm: boolean) => void;
  onSubmit: () => void;
}) {
  const locale = useCurrentLocale();
  return (
    <>
      <CreateWithNewTimeRangeSlotForm
        day={day}
        onClick={(e) => {
          setShowForm(true);
        }}
      />

      <div
        className="z-50 w-full h-full fixed top-0 left-0 bg-black bg-opacity-65"
        style={{ display: showForm ? "block" : "none" }}
      >
        <div className="flex flex-col [&_*]:text-sm bg-white p-4 gap-4 rounded-lg w-min absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
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
          <div className="flex gap-2 items-center">
            <Button onClick={onSubmit}>Submit</Button>
            <Button
              onClick={(e) => {
                console.log("canceled");
                setShowForm(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function CreateWithNewTimeRangeSlotForm(
  props: { day: DayEnumType } & ComponentProps<"div">
) {
  const locale = useCurrentLocale();
  return (
    <div
      className={
        "rounded-lg table-cell p-2 bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors duration-300"
      }
      onClick={props.onClick}
    >
      <p className="text-center text-sm flex items-center justify-center gap-2 text-blue-500">
        <Plus className="[&_*]:stroke-blue-500" />
        {tt(locale, {
          en: "Create with new time slot",
          ar: "إنشاء بفترة زمنية جديدة",
        })}
      </p>
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
}
