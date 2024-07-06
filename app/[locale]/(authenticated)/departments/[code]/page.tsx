import { departmentsAPI } from "@/api";
import UpdateDepartmentForm from "./UpdateDepartmentForm";

export async function getDepartment(code: string) {
  const response = await departmentsAPI.get(`/${code}`);
  return response.data;
}

export default async function Page({
  params: { code },
}: Readonly<{ params: { code: string } }>) {
  const { department } = await getDepartment(code);
  return (
    <>
      <UpdateDepartmentForm department={department} />
    </>
  );
}
