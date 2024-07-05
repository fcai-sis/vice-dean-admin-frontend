import { getAccessToken } from "@/lib";
import { getAllCourses } from "../../../semester/create/page";
import CreateInstructorTeachingForm from "./CreateInstructorTeachingForm";
import { instructorsAPI } from "@/api";

export async function getAllInstructors() {
  const accessToken = await getAccessToken();

  const response = await instructorsAPI.get("/", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
}

export default async function Page({
  params: { locale },
}: Readonly<{
  params: { locale: string };
}>) {
  const { courses } = await getAllCourses();
  const { instructors } = await getAllInstructors();

  return (
    <>
      <CreateInstructorTeachingForm
        instructors={instructors}
        courses={courses}
      />
    </>
  );
}
