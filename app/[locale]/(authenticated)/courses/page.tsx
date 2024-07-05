import { coursesAPI, departmentsAPI } from "@/api";
import Pagination from "@/components/Pagination";
import { SelectFilter } from "@/components/SetQueryFilter";
import { getAccessToken, getCurrentPage, limit, tt } from "@/lib";
import { DepartmentType } from "@fcai-sis/shared-models";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import DeleteCourseForm from "./DeleteCourseForm";
import { CardGrid, FilterBar, PageHeader } from "@/components/PageBuilder";
import { getCurrentLocale } from "@/locales/server";
import { ButtonLink } from "@/components/Buttons";
import Card from "@/components/Card";
import { DepartmentChip } from "@/components/AnnouncementCard";

export const getCourses = async (page: number, department: DepartmentType) => {
  const accessToken = await getAccessToken();

  const response = await coursesAPI.get(`/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      page,
      limit,
      department,
    },
  });

  if (response.status !== 200) throw new Error("Failed to fetch courses");

  revalidatePath("/courses");

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

  revalidatePath("/department");

  return response.data;
};

export default async function Page({
  searchParams,
}: Readonly<{ searchParams: { page: string; department: string } }>) {
  const locale = getCurrentLocale();

  const page = getCurrentPage(searchParams);
  const departmentSelected =
    searchParams.department as unknown as DepartmentType;

  const { courses, total } = await getCourses(page, departmentSelected);

  const departmentResponse = await getDepartments();
  const departments = departmentResponse.departments;

  const departmentOptions = [
    {
      label: tt(locale, {
        en: "All Departments",
        ar: "جميع الأقسام",
      }),
      value: "",
    },
    ...departments.map((department: any) => ({
      label: tt(locale, department.name),
      value: department.code,
    })),
  ];

  return (
    <>
      <PageHeader
        title={tt(locale, {
          en: "Courses",
          ar: "المقررات",
        })}
        actions={[
          <ButtonLink href="/courses/create">
            {tt(locale, {
              en: "Create Course",
              ar: "إنشاء مقرر",
            })}
          </ButtonLink>,
        ]}
      />
      <FilterBar
        filters={[
          {
            label: tt(locale, {
              en: "Department",
              ar: "القسم",
            }),
            htmlFor: "department",
            filter: (
              <SelectFilter name="department" options={departmentOptions} />
            ),
          },
        ]}
      />
      <CardGrid>
        {courses.map((course: any, index: number) => (
          <CourseCard key={index} course={course} />
        ))}
      </CardGrid>
      <Pagination totalPages={total / limit} />
    </>
  );
}

function CourseCard({ course }: { course: any }) {
  const locale = getCurrentLocale();
  return (
    <Card>
      <h3>{tt(locale, course.name)}</h3>
      <p>{course.code}</p>
      <div className="flex gap-2">
        {course.departments?.map((department: any) => (
          <DepartmentChip key={department.code} department={department} />
        ))}
      </div>
      <div className="flex gap-2">
        <ButtonLink href={`/courses/${course.code}`}>
          {tt(locale, {
            en: "View",
            ar: "عرض",
          })}
        </ButtonLink>
        <DeleteCourseForm courseId={course._id} />
      </div>
    </Card>
  );
}
