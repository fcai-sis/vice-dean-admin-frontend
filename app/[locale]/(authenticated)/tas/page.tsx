import { departmentsAPI, tasAPI } from "@/api";
import Pagination from "@/components/Pagination";
import { SelectFilter } from "@/components/SetQueryFilter";
import { getAccessToken, getCurrentPage, limit, tt } from "@/lib";
import { DepartmentType } from "@fcai-sis/shared-models";
import { revalidatePath } from "next/cache";
import DeleteTaForm from "./DeleteTaForm";
import { DepartmentChip } from "@/components/AnnouncementCard";
import { CardGrid, FilterBar, PageHeader } from "@/components/PageBuilder";
import { getCurrentLocale } from "@/locales/server";
import { ButtonLink } from "@/components/Buttons";

export const getTeachingAssistants = async (
  page: number,
  department: DepartmentType
) => {
  const accessToken = await getAccessToken();
  const response = await tasAPI.get(`/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      page,
      limit,
      department,
    },
  });

  if (response.status !== 200)
    throw new Error("Failed to fetch teaching assistants");

  revalidatePath("/tas");

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

  const { teachingAssistants: tas } = await getTeachingAssistants(
    page,
    departmentSelected
  );

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
          en: "Teaching Assistants",
          ar: "المعيدين",
        })}
        actions={
          <>
            <ButtonLink variant="primary" href={`/tas/create`}>
              {tt(locale, { en: "Create TA", ar: "إنشاء معيد" })}
            </ButtonLink>
            <ButtonLink variant="primary" href={`/tas/teachings`}>
              {tt(locale, { en: "Teachings", ar: "التدريس" })}
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
        {tas.map((ta: any) => (
          <TaCard key={ta._id} ta={ta} />
        ))}
      </CardGrid>

      <Pagination totalPages={tas.length / limit} />
    </>
  );
}

type TaCardProps = { ta: any };
function TaCard({ ta }: TaCardProps) {
  return (
    <div className="flex flex-col border border-slate-200 w-96 rounded-lg p-4 gap-4">
      <h3 className="text-slate-600">{ta.fullName}</h3>
      <p className="text-slate-400">{ta.email}</p>
      <div className="flex justify-start">
        <DepartmentChip department={ta.department} />
      </div>
      {ta.officeHours && <p>{ta.officeHours}</p>}
      <DeleteTaForm taId={ta._id} />
    </div>
  );
}
