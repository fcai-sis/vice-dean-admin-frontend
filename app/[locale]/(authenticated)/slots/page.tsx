import { hallSlotAPI } from "@/api";
import Pagination from "@/components/Pagination";
import { getAccessToken, getCurrentPage, limit, tt } from "@/lib";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import DeleteSlotForm from "./DeleteSlotForm";

export const getSlots = async (page: number) => {
  const accessToken = await getAccessToken();

  const response = await hallSlotAPI.get(`/slot/slots`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      skip: page * limit - limit,
      limit,
    },
  });

  if (response.status !== 200) throw new Error("Failed to fetch slots");

  revalidatePath("/slots");

  return response.data;
};

export default async function Page({
  searchParams,
}: Readonly<{ searchParams: { page: string; department: string } }>) {
  const page = getCurrentPage(searchParams);

  const response = await getSlots(page);
  const slots = response.slots;
  const total = response.totalSlots;
  console.log(slots);

  return (
    <>
      <h1>Slots</h1>

      <div>
        {slots.map((slot: any) => (
          <div className='border border-black w-80' key={slot.id}>
            <p>
              <b>Start time:</b>
              {`${slot.start.hour
                .toString()
                .padStart(2, "0")}:${slot.start.minute
                .toString()
                .padStart(2, "0")}`}
            </p>
            <p>
              <b>End time:</b>
              {`${slot.end.hour.toString().padStart(2, "0")}:${slot.end.minute
                .toString()
                .padStart(2, "0")}`}
            </p>

            <p>
              <b>Day: </b>
              {slot.day}
            </p>

            <DeleteSlotForm slotId={slot._id} />
          </div>
        ))}
        <Pagination totalPages={total / limit} />
      </div>

      <Link href='/slots/create'> Create Slot</Link>
    </>
  );
}
