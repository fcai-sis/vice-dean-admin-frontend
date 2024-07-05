import { slotsAPI } from "@/api";
import Schedule from "@/components/Schedule";
import { PageHeader } from "@/components/PageBuilder";
import { getCurrentLocale } from "@/locales/server";
import { tt } from "@/lib";

export const getSlots = async () => {
  const { data } = await slotsAPI.get("/");
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
