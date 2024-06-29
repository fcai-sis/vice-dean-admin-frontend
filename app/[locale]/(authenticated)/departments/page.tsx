import { departmentsAPI } from "@/api";
import Pagination from "@/components/Pagination";
import { getAccessToken, getCurrentPage, limit, tt } from "@/lib";
import { getCurrentLocale } from "@/locales/server";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import DeleteDepartmentForm from "./DeleteDepartmentForm";

export const getDepartments = async () => {
  const accessToken = await getAccessToken();
  const response = await departmentsAPI.get(`/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status !== 200) throw new Error("Failed to fetch departments");

  revalidatePath("/department");

  return response.data;
};

export default async function Page({
  searchParams,
}: Readonly<{ searchParams: { page: string; department: string } }>) {
  const locale = getCurrentLocale();
  const page = getCurrentPage(searchParams);

  const response = await getDepartments();
  console.log(response);

  return (
    <>
      <h1>Departments</h1>
      <div>
        {response.departments.map((department: any) => (
          <div className='border border-black w-80' key={department.id}>
            <p>
              <b>Name: </b>
              {tt(locale, department.name)}
            </p>
            <p>
              <b>Code:</b>
              {department.code}
            </p>
            <p>
              <b>Program:</b>
              {department.program}
            </p>
            <p>
              <b>Capacity:</b>
              {department.capacity}
            </p>
            <DeleteDepartmentForm departmentId={department._id} />
          </div>
        ))}
        <Pagination totalPages={response.total / limit} />
      </div>
      <div>
        <Link href='/departments/create'> Create Department</Link>
      </div>
    </>
  );
}