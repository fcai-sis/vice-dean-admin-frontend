import { departmentsAPI, scheduleAPI } from "@/api";
import Pagination from "@/components/Pagination";
import { SelectFilter } from "@/components/SetQueryFilter";
import { getAccessToken, getCurrentPage, limit, tt } from "@/lib";
import { DepartmentType } from "@fcai-sis/shared-models";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import DeleteInstructorTeachingForm from "./DeleteInstructorTeachingForm";
import { CardGrid, PageHeader } from "@/components/PageBuilder";
import { getCurrentLocale } from "@/locales/server";
import { ButtonLink } from "@/components/Buttons";
import Card from "@/components/Card";

export const getAllInstructorTeachings = async (
  page: number,
  department: DepartmentType
) => {
  const accessToken = await getAccessToken();
  const response = await scheduleAPI.get(`/instructor-teaching`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      page,
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

  const response = await getAllInstructorTeachings(page, departmentSelected);
  const instructorTeachings = response.instructorTeachings;
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
      <PageHeader
        title={tt(locale, {
          en: "Instructor Teachings",
          ar: "تدريس المحاضرين",
        })}
        actions={[
          <ButtonLink variant="primary" href={`/instructors/teachings/create`}>
            {tt(locale, { en: "Add Teaching", ar: "إضافة تدريس" })}
          </ButtonLink>,
        ]}
      />
      <SelectFilter name="department" options={departmentOptions} />
      <CardGrid>
        {instructorTeachings.map((teaching: any) => (
          <Card>
            <p>
              <b>Name: </b>
              {teaching.instructor.fullName}
            </p>
            <p>
              <b>Email: </b>
              {teaching.instructor.email}
            </p>
            <p>
              <b>Department: </b>
              {teaching.instructor.department.name.en}
            </p>
            {teaching.instructor.officeHours && (
              <p>
                <b>Office Hours: </b>
                {teaching.instructor.officeHours}
              </p>
            )}

            <p>
              <b>Course: </b>
              {teaching.course.code}
            </p>

            <DeleteInstructorTeachingForm instructorTeachingId={teaching._id} />
          </Card>
        ))}
      </CardGrid>
      <Pagination totalPages={total / limit} />
    </>
  );
}
