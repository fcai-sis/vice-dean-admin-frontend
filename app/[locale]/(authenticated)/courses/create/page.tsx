import { getAllDepartments } from "../../bylaw/create/page";
import { getAllCourses } from "../../semester/create/page";
import CreateCourseForm from "./CreateCourseForm";

export default async function Page({
  searchParams,
}: Readonly<{ searchParams: { page: string; department: string } }>) {
  const { departments } = await getAllDepartments();
  const { courses: allCourses } = await getAllCourses();
  return (
    <>
      <CreateCourseForm allDepartments={departments} allCourses={allCourses} />
    </>
  );
}
