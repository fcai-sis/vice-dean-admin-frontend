import { scheduleAPI } from "@/api";
import Pagination from "@/components/Pagination";
import { getAccessToken, getCurrentPage, limit, tt } from "@/lib";
import { getCurrentLocale } from "@/locales/server";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import DeleteLectureForm from "./DeleteSectionForm";
import DeleteSectionForm from "./DeleteSectionForm";

export const getSections = async (page: number) => {
  const accessToken = await getAccessToken();

  const response = await scheduleAPI.get(`/sections`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      skip: page * limit - limit,
      limit,
    },
  });

  if (response.status !== 200) throw new Error("Failed to fetch sections");

  revalidatePath("/sections");

  return response.data;
};

export default async function Page({
  searchParams,
}: Readonly<{ searchParams: { page: string } }>) {
  const locale = getCurrentLocale();
  const page = getCurrentPage(searchParams);

  const response = await getSections(page);
  const sections = response.sections;
  const total = response.totalSections;

  return (
    <>
      <h1>Lectures</h1>

      <div>
        {sections.map((section: any) => (
          <div className='border border-black w-80' key={section.id}>
            <p>
              <b>Lecture Hall: </b>
              {tt(locale, section.hall.name)}
            </p>

            <p>
              <b>Slot: </b>
              {`${section.slot.start.hour
                .toString()
                .padStart(2, "0")}:${section.slot.start.minute
                .toString()
                .padStart(2, "0")}`}{" "}
              -{" "}
              {`${section.slot.end.hour
                .toString()
                .padStart(2, "0")}:${section.slot.end.minute
                .toString()
                .padStart(2, "0")}`}
            </p>

            <p>
              <b>Course: </b>
              {section.course.code}
            </p>

            {section.group && (
              <p>
                <b>Group: </b>
                {section.group}
              </p>
            )}

            <DeleteSectionForm sectionId={section._id} />
          </div>
        ))}
        <Pagination totalPages={total / limit} />
      </div>

      <Link href='/sections/create'> Create Section</Link>
    </>
  );
}
