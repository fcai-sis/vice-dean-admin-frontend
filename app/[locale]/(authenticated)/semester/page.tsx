import { semesterAPI } from "@/api";
import { getAccessToken } from "@/lib";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import EndSemesterForm from "./EndSemesterForm";
import BeginDepartmentAssignment from "./BeginDepartmentAssignment";

export const getLatestSemester = async () => {
  const accessToken = await getAccessToken();

  const response = await semesterAPI.get(`/latest`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log(response.data);

  if (response.status !== 200) throw new Error("Failed to fetch semester");

  revalidatePath("/semester");

  return response.data;
};

export default async function Page({
  searchParams,
}: Readonly<{ searchParams: { page: string } }>) {
  const response = await getLatestSemester();
  const semester = response.semester;
  const semestercourses = response.courses;

  return (
    <>
      <h1>Latest Semester</h1>

      <div>
        <h2>
          <b>Semester Season: </b>
          {semester.season}
        </h2>

        {semestercourses.map((course: any) => (
          <div className='border border-black w-80' key={course.id}>
            <p>
              <b>Course: </b>
              {course.code}
            </p>
          </div>
        ))}
        <Link href='/semester/update'>Update Semester</Link>
      </div>

      <Link href='/semester/create'>Create Semester</Link>
      <EndSemesterForm />
      <BeginDepartmentAssignment/>
    </>
  );
}
