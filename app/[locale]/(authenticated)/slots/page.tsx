import { hallSlotAPI } from "@/api";
import Pagination from "@/components/Pagination";
import { getAccessToken, getCurrentPage, limit, tt } from "@/lib";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import DeleteSlotForm from "./DeleteSlotForm";
import Schedule from "@/components/Schedule";
import { PageHeader } from "@/components/PageBuilder";
import { getCurrentLocale } from "@/locales/server";

export const getSlots = async () => {
  const { data } = await hallSlotAPI.get("/slot");
  return data;
};

// export const getSlots = async (page: number) => {
//   const accessToken = await getAccessToken();

//   const response = await hallSlotAPI.get(`/slot`, {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//     params: {
//       skip: page * limit - limit,
//       limit,
//     },
//   });

//   console.log(response.data);

//   if (response.status !== 200) throw new Error("Failed to fetch slots");

//   revalidatePath("/slots");

//   return response.data;
// };

export default async function Page() {
  const locale = getCurrentLocale();
  const { slots, timeRanges, days } = await getSlots();

  return (
    <>
      <PageHeader
        title={tt(locale, {
          en: "Slots",
          ar: "الفترات",
        })}
        actions={[]}
      />
      <Schedule
        slots={slots}
        timeRanges={timeRanges}
        days={days}
        schedule={[]}
      />
    </>
  );
}
