import { departmentsAPI } from "@/api";
import Pagination from "@/components/Pagination";
import { getAccessToken, getCurrentPage, limit, tt } from "@/lib";
import { getCurrentLocale } from "@/locales/server";
import { revalidatePath } from "next/cache";
import DeleteDepartmentForm from "./DeleteDepartmentForm";
import { CardGrid, PageHeader } from "@/components/PageBuilder";
import { ButtonLink } from "@/components/Buttons";
import Card from "@/components/Card";

export const getDepartments = async (page: number) => {
  const accessToken = await getAccessToken();
  const response = await departmentsAPI.get(`/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      page,
      limit,
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

  const { departments, total } = await getDepartments(page);

  return (
    <>
      <PageHeader
        title={tt(locale, {
          en: "Departments",
          ar: "الأقسام",
        })}
        actions={[
          <ButtonLink href="/departments/create">
            {tt(locale, {
              en: "Create Department",
              ar: "إنشاء قسم",
            })}
          </ButtonLink>,
        ]}
      />

      <CardGrid>
        {departments.map((department: any, index: number) => (
          <DepartmentCard key={index} department={department} />
        ))}
      </CardGrid>

      <Pagination totalPages={total / limit} />
    </>
  );
}

function DepartmentCard({ department }: { department: any }) {
  return (
    <Card>
      <div className="flex flex-col">
        <h3>{tt(getCurrentLocale(), department.name)}</h3>
        <CodeChip code={department.code} />
      </div>
      <div className="w-full flex justify-end gap-2">
        <ButtonLink href={`/departments/${department.code}`}>
          {tt(getCurrentLocale(), { en: "Update", ar: "تحديث" })}
        </ButtonLink>
        <DeleteDepartmentForm code={department.code} />
      </div>
    </Card>
  );
}

export function CodeChip({ code }: { code: string }) {
  return (
    <span className="bg-slate-100 text-slate-400 rounded-lg px-2 py-1 w-min">
      {code}
    </span>
  );
}
