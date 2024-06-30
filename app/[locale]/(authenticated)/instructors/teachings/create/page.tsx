import { getAllCourses } from "../../../semester/create/page";
import CreateInstructorTeachingForm from "./CreateInstructorTeachingForm";

export default async function Page({
  params: { locale },
}: Readonly<{
  params: { locale: string };
}>) {
  const response = await getAllCourses();
  const courses = response.courses;

  return (
    <>
      <CreateInstructorTeachingForm courses={courses} />
    </>
  );
}
