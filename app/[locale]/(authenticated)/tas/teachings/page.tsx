import { departmentsAPI, scheduleAPI } from "@/api";
import Pagination from "@/components/Pagination";
import { SelectFilter } from "@/components/SetQueryFilter";
import { getAccessToken, getCurrentPage, limit, tt } from "@/lib";
import { DepartmentType } from "@fcai-sis/shared-models";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import DeleteTaTeachingForm from "./DeleteTaTeachingForm";
import { getCurrentLocale } from "@/locales/server";

export const getAllTaTeachings = async (
  page: number,
  department: DepartmentType
) => {
  const accessToken = await getAccessToken();
  const response = await scheduleAPI.get(`/ta-teaching`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      skip: page * limit - limit,
      limit,
      department,
    },
  });

  console.log(response.data);

  if (response.status !== 200) throw new Error("Failed to fetch teachings");

  revalidatePath("/teachings");

  return response.data;
};

export const getDepartments = async () => {
  const accessToken = await getAccessToken();
  const response = await departmentsAPI.get(`/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status !== 200) throw new Error("Failed to fetch departments");

  revalidatePath("/departments");

  return response.data;
};

export default async function Page({
  searchParams,
}: Readonly<{ searchParams: { page: string; department: string } }>) {
  const locale = getCurrentLocale();
  const page = getCurrentPage(searchParams);

  const departmentSelected =
    searchParams.department as unknown as DepartmentType;

  const response = await getAllTaTeachings(page, departmentSelected);
  const taTeachings = response.taTeachings;
  const total = response.totalTeachings;

  const departmentResponse = await getDepartments();
  const departments = departmentResponse.departments;

  const departmentOptions = [
    {
      label: "All",
      value: "",
    },
    ...departments.map((department: any) => ({
      label: department.name.en,
      value: department.code,
    })),
  ];

  return (
    <>
      <div className="p-6 bg-white text-slate-600">
        <h1 className="text-2xl font-bold mb-4 ">TA Teachings Available</h1>
        <div className="mb-6">
          <SelectFilter
            name="department"
            options={departmentOptions}
            className="border border-slate-400 rounded p-2 w-full"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {taTeachings.map((teaching: any) => (
            <div
              key={teaching._id}
              className="border border-slate-400 p-4 rounded shadow-lg"
            >
              <p className="mb-2">
                <b className="text-blue-500">Name: </b>
                {teaching.ta.fullName}
              </p>
              <p className="mb-2">
                <b className="text-blue-500">Email: </b>
                {teaching.ta.email}
              </p>
              <p className="mb-2">
                <b className="text-blue-500">Department: </b>
                {teaching.ta.department.name.en}
              </p>
              {teaching.ta.officeHours && (
                <p className="mb-2">
                  <b className="text-blue-500">Office Hours: </b>
                  {teaching.ta.officeHours}
                </p>
              )}
              <p className="mb-4">
                <b className="text-blue-500">Course: </b>
                {teaching.course.code}
              </p>
              <DeleteTaTeachingForm taTeachingId={teaching._id} />
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Pagination totalPages={Math.ceil(total / limit)} />
        </div>
        <div className="mt-6">
          <Link href="/tas/teachings/create">
            {tt(locale, {
              en: "Add Teaching",
              ar: "إضافة تدريس",
            })}
          </Link>
        </div>
      </div>
    </>
  );
}
