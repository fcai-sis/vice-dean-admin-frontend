import CreateSemesterForm from "./CreateSemesterForm";
import { getAccessToken } from "@/lib";
import { coursesAPI } from "@/api";
import { revalidatePath } from "next/cache";

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

  return (
    <>
      <CreateSemesterForm courses={courses} />
    </>
  );
}
