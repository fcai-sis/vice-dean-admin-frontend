import { getAccessToken } from "@/lib";
import { coursesAPI } from "@/api";
import { revalidatePath } from "next/cache";
import { getLatestSemester } from "../page";
import UpdateSemesterForm from "./UpdateSemesterForm";

export const getAllCourses = async () => {
  const accessToken = await getAccessToken();

  const response = await coursesAPI.get(`/`, {
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
  const response = await getAllCourses();
  const courses = response.courses;
  const latestSemesterResponse = await getLatestSemester();
  const latestSemester = latestSemesterResponse.semester;
  const latestSemesterCourses = latestSemesterResponse.courses;
  return (
    <>
      <UpdateSemesterForm
        courses={courses}
        semester={latestSemester}
        setCourses={latestSemesterCourses}
      />
    </>
  );
}
