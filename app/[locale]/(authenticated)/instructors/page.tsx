import { departmentsAPI, instructorsAPI } from "@/api";
import Pagination from "@/components/Pagination";
import { SelectFilter } from "@/components/SetQueryFilter";
import {
  getAccessToken,
  getCurrentPage,
  limit,
  localizedTitle,
  tt,
} from "@/lib";
import { DepartmentType } from "@fcai-sis/shared-models";
import { revalidatePath } from "next/cache";
import DeleteInstructorForm from "./DeleteInstructorForm";
import { getCurrentLocale } from "@/locales/server";
import { DepartmentChip } from "@/components/AnnouncementCard";
import { CardGrid, FilterBar, PageHeader } from "@/components/PageBuilder";
import { ButtonLink } from "@/components/Buttons";
import Card from "@/components/Card";

export const getInstructors = async (
  page: number,
  department: DepartmentType
) => {
  const accessToken = await getAccessToken();
  const response = await instructorsAPI.get(`/`, {
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

  if (response.status !== 200) throw new Error("Failed to fetch instructors");

  revalidatePath("/instructors");

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

  const response = await getInstructors(page, departmentSelected);
  const instructors = response.instructors;
  const total = response.totalInstructors;

  const departmentResponse = await getDepartments();
  const departments = departmentResponse.departments;

  const departmentOptions = [
    {
      label: tt(locale, {
        en: "All Departments",
        ar: "كل الأقسام",
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
          en: "Instructors",
          ar: "الدكاترة",
        })}
        actions={
          <>
            <ButtonLink variant="primary" href="/instructors/create">
              {tt(locale, {
                en: "Add Instructor",
                ar: "إضافة دكتور",
              })}
            </ButtonLink>
            <ButtonLink variant="primary" href="/instructors/teachings">
              {tt(locale, {
                en: "Teachings",
                ar: "التدريس",
              })}
            </ButtonLink>
          </>
        }
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
        {instructors.map((instructor: any) => (
          <InstructorCard key={instructor._id} instructor={instructor} />
        ))}
      </CardGrid>

      <Pagination totalPages={total / limit} />
    </>
  );
}

type InstructorCardProps = { instructor: any };
function InstructorCard({ instructor }: InstructorCardProps) {
  return (
    <Card>
      <div className="flex flex-col gap-2">
        <h3 className="text-slate-600">{instructor.fullName}</h3>
        <p className="text-slate-400">
          {tt(getCurrentLocale(), localizedTitle(instructor.title))}
        </p>
      </div>
      <p className="text-slate-400">{instructor.email}</p>
      <div className="flex justify-start">
        <DepartmentChip department={instructor.department} />
      </div>
      {instructor.officeHours && <p>{instructor.officeHours}</p>}
      <DeleteInstructorForm instructorId={instructor._id} />
    </Card>
  );
}
