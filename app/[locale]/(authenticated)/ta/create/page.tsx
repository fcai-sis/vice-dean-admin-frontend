import { getDepartments } from "../page";
import { DepartmentType } from "@fcai-sis/shared-models";
import CreateTaForm from "./CreateTaForm";

export default async function Page({
  params: { locale },
}: Readonly<{
  params: { locale: string };
}>) {
  const response = await getDepartments();
  const departments = response.departments;
  const filteredDepartments = departments.filter(
    (department: DepartmentType) => department.program === "SPECIALIZATION"
  );

  return (
    <>
      <CreateTaForm departments={filteredDepartments} />
    </>
  );
}
