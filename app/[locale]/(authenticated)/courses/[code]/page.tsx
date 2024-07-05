import { coursesAPI } from "@/api";
import { getAccessToken, tt } from "@/lib";
import { revalidatePath } from "next/cache";
import UpdateCourseForm from "./UpdateCourseForm";
import { getAllCourses } from "../../semester/create/page";
import { getAllDepartments } from "../../bylaw/create/page";

export const getSelectedCourse = async (code: string) => {
  const accessToken = await getAccessToken();

  const response = await coursesAPI.get(`/${code}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status !== 200) throw new Error("Failed to fetch course");

  revalidatePath("/courses");

  return response.data;
};

export default async function Page({
  params: { code },
}: Readonly<{
  params: { code: string };
}>) {
  const { course } = await getSelectedCourse(code);
  const { departments } = await getAllDepartments();
  const { courses: allCourses } = await getAllCourses();
  return (
    <>
      <UpdateCourseForm
        course={course}
        allDepartments={departments}
        allCourses={allCourses.filter((c: any) => c.code !== course.code)}
      />
    </>
  );
}
