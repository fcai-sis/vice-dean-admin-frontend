import { getDepartments } from "../page";
import { DepartmentType } from "@fcai-sis/shared-models";
import CreateInstructorForm from "./CreateInstructorForm";

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
      <CreateInstructorForm departments={filteredDepartments} />
    </>
  );
}
