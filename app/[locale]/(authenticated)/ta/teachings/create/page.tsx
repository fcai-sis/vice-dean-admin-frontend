import { getAllCourses } from "../../../semester/create/page";
import CreateTaTeachingForm from "./CreateTaTeachingForm";

export default async function Page({
  params: { locale },
}: Readonly<{
  params: { locale: string };
}>) {
  const response = await getAllCourses();
  const courses = response.courses;

  return (
    <>
      <CreateTaTeachingForm courses={courses} />
    </>
  );
}
