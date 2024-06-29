import { hallSlotAPI } from "@/api";
import Pagination from "@/components/Pagination";
import { getAccessToken, getCurrentPage, limit, tt } from "@/lib";
import { getCurrentLocale } from "@/locales/server";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import DeleteHallForm from "./DeleteHallForm";

export const getHalls = async (page: number) => {
  const accessToken = await getAccessToken();

  const response = await hallSlotAPI.get(`/hall/read`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      skip: page * limit - limit,
      limit,
    },
  });

  if (response.status !== 200) throw new Error("Failed to fetch halls");

  revalidatePath("/halls");

  return response.data;
};

export default async function Page({
  searchParams,
}: Readonly<{ searchParams: { page: string } }>) {
  const locale = getCurrentLocale();
  const page = getCurrentPage(searchParams);

  const response = await getHalls(page);
  const halls = response.halls;
  const total = response.totalHalls;

  return (
    <>
      <h1>Halls</h1>

      <div>
        {halls.map((hall: any) => (
          <div className='border border-black w-80' key={hall.id}>
            <p>
              <b>Name: </b>
              {tt(locale, hall.name)}
            </p>
            <p>
              <b>Capacity:</b>
              {hall.capacity}
            </p>

            <DeleteHallForm hallId={hall._id} />
          </div>
        ))}
        <Pagination totalPages={total / limit} />
      </div>

      <Link href='/halls/create'> Create Hall</Link>
    </>
  );
}
