import { hallsAPI, hallSlotAPI } from "@/api";
import Pagination from "@/components/Pagination";
import { getAccessToken, getCurrentPage, limit, tt } from "@/lib";
import { getCurrentLocale } from "@/locales/server";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import DeleteHallForm from "./DeleteHallForm";
import { CardGrid, PageHeader } from "@/components/PageBuilder";
import { ButtonLink } from "@/components/Buttons";
import Card from "@/components/Card";

export const getHalls = async (page: number) => {
  const accessToken = await getAccessToken();

  const response = await hallsAPI.get(`/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      page,
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
      <PageHeader
        title={tt(locale, {
          en: "Halls",
          ar: "القاعات",
        })}
        actions={[
          <ButtonLink href="/halls/create" key="create">
            {tt(locale, {
              en: "Create Hall",
              ar: "إنشاء قاعة",
            })}
          </ButtonLink>,
        ]}
      />

      <CardGrid>
        {halls.map((hall: any, index: number) => (
          <HallCard key={index} hall={hall} />
        ))}
      </CardGrid>

      <Pagination totalPages={total / limit} />
    </>
  );
}

export function HallCard({ hall }: Readonly<{ hall: any }>) {
  const locale = getCurrentLocale();
  return (
    <Card>
      <h3>{tt(locale, hall.name)}</h3>
      <p className="text-slate-400">
        {tt(locale, {
          en: "Capacity",
          ar: "السعة",
        })}
        :{hall.capacity}
      </p>
      <DeleteHallForm hallId={hall._id} />
    </Card>
  );
}
