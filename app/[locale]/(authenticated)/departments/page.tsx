import { departmentsAPI } from "@/api";
import Pagination from "@/components/Pagination";
import { getAccessToken, getCurrentPage, limit, tt } from "@/lib";
import { getCurrentLocale } from "@/locales/server";
import { revalidatePath } from "next/cache";
import Link from "next/link";
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
      <h3>{tt(getCurrentLocale(), department.name)}</h3>
      <p>{department.code}</p>
      <DeleteDepartmentForm departmentId={department._id} />
    </Card>
  );
}
