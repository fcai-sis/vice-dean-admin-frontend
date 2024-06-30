import { departmentsAPI, scheduleAPI } from "@/api";
import Pagination from "@/components/Pagination";
import { SelectFilter } from "@/components/SetQueryFilter";
import { getAccessToken, getCurrentPage, limit } from "@/lib";
import { DepartmentType } from "@fcai-sis/shared-models";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import DeleteTaTeachingForm from "./DeleteTaTeachingForm";

export const getAllTaTeachings = async (
  page: number,
  department: DepartmentType
) => {
  const accessToken = await getAccessToken();
  const response = await scheduleAPI.get(`/all-ta-teachings`, {
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
      <div>
        <h1>TA Teachings Available</h1>
        <SelectFilter name='department' options={departmentOptions} />
        <div>
          {taTeachings.map((teaching: any) => (
            <div className='border border-black w-80'>
              <p>
                <b>Name: </b>
                {teaching.ta.fullName}
              </p>
              <p>
                <b>Email: </b>
                {teaching.ta.email}
              </p>
              <p>
                <b>Department: </b>
                {teaching.ta.department.name.en}
              </p>
              {teaching.ta.officeHours && (
                <p>
                  <b>Office Hours: </b>
                  {teaching.ta.officeHours}
                </p>
              )}
              <DeleteTaTeachingForm taTeachingId={teaching._id} />
            </div>
          ))}
          <Pagination totalPages={total / limit} />
        </div>
        <Link href='/ta/teachings/create'>Create TA Teaching</Link>
      </div>
    </>
  );
}
