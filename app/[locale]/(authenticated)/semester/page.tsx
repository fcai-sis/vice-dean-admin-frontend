import { semesterAPI } from "@/api";
import { getAccessToken, tt } from "@/lib";
import { revalidatePath } from "next/cache";
import EndSemesterForm from "./EndSemesterForm";
import BeginDepartmentAssignment from "./BeginDepartmentAssignment";
import { redirect } from "next/navigation";
import { CardGrid, PageHeader } from "@/components/PageBuilder";
import { getCurrentLocale } from "@/locales/server";
import { ButtonLink } from "@/components/Buttons";
import { CodeChip } from "../departments/page";
import Card from "@/components/Card";

export const getLatestSemester = async () => {
  const accessToken = await getAccessToken();

  const response = await semesterAPI.get(`/latest`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  console.log(response.data);

  if (response.status !== 200) redirect("/semester/create");

  revalidatePath("/semester");

  return response.data;
};

export default async function Page({
  searchParams,
}: Readonly<{ searchParams: { page: string } }>) {
  const locale = getCurrentLocale();
  const { semester, courses } = await getLatestSemester();

  return (
    <>
      <PageHeader
        title={tt(locale, {
          en: "Semester",
          ar: "الفصل الدراسي",
        })}
        actions={[
          <ButtonLink href="/semester/update">
            {tt(locale, {
              en: "Update Semester",
              ar: "تحديث الفصل الدراسي",
            })}
          </ButtonLink>,
          <EndSemesterForm />,
        ]}
      />
      <CardGrid>
        {courses.map((course: any, index: number) => (
          <Card key={index}>
            <h4>{tt(locale, course.name)}</h4>
            <CodeChip code={course.code} />
          </Card>
        ))}
      </CardGrid>
      <div className="flex flex-col w-full py-4">
        <PageHeader
          title={tt(locale, {
            en: "Department Assignment",
            ar: "تعيين الأقسام",
          })}
          actions={[]}
        />
        <BeginDepartmentAssignment />
      </div>
    </>
  );
}
