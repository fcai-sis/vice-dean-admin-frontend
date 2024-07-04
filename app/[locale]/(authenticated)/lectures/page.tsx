import { scheduleAPI } from "@/api";
import Pagination from "@/components/Pagination";
import { getAccessToken, getCurrentPage, limit, tt } from "@/lib";
import { getCurrentLocale } from "@/locales/server";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import DeleteLectureForm from "./DeleteLectureForm";

export const getLectures = async (page: number) => {
  const accessToken = await getAccessToken();

  const response = await scheduleAPI.get(`/lectures`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      skip: page * limit - limit,
      limit,
    },
  });

  if (response.status !== 200) throw new Error("Failed to fetch lectures");

  revalidatePath("/lectures");

  return response.data;
};

export default async function Page({
  searchParams,
}: Readonly<{ searchParams: { page: string } }>) {
  const locale = getCurrentLocale();
  const page = getCurrentPage(searchParams);

  const { lectures, total } = await getLectures(page);

  console.log(lectures);

  return (
    <>
      <h1>Lectures</h1>
      <div>
        {lectures.map((lecture: any) => (
          <div className="border border-black w-80" key={lecture.id}>
            <p>
              <b>Lecture Hall: </b>
              {tt(locale, lecture.hall.name)}
            </p>
            <p>
              <b>Slot: </b>
              {lecture.slot.day}{" "}
              {`${lecture.slot.start.hour
                .toString()
                .padStart(2, "0")}:${lecture.slot.start.minute
                .toString()
                .padStart(2, "0")}`}{" "}
              -{" "}
              {`${lecture.slot.end.hour
                .toString()
                .padStart(2, "0")}:${lecture.slot.end.minute
                .toString()
                .padStart(2, "0")}`}
            </p>

            <p>
              <b>Course: </b>
              {lecture.course.code}
            </p>

            <DeleteLectureForm lectureId={lecture._id} />
          </div>
        ))}
        <Pagination totalPages={total / limit} />
      </div>

      <Link href="/lectures/create"> Create Lecture</Link>
    </>
  );
}
