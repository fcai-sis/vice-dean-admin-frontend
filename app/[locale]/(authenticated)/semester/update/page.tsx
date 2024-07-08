import { getAccessToken } from "@/lib";
import { coursesAPI } from "@/api";
import { revalidatePath } from "next/cache";
import { getLatestSemester } from "../page";
import UpdateSemesterForm from "./UpdateSemesterForm";

export const getAllCourses = async () => {
  const accessToken = await getAccessToken();

  const response = await coursesAPI.get(`/all`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status !== 200) throw new Error("Failed to fetch courses");

  revalidatePath("/semester");

  return response.data;
};

export default async function Page({
  params: { locale },
}: Readonly<{
  params: { locale: string };
}>) {
  const { courses } = await getAllCourses();
  const { semester: latestSemester, courses: semesterCourses } =
    await getLatestSemester();
  return (
    <>
      <UpdateSemesterForm
        courses={courses}
        semester={latestSemester}
        setCourses={semesterCourses}
      />
    </>
  );
}
