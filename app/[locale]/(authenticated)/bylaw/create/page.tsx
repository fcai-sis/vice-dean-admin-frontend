import { getAccessToken } from "@/lib";
import CreateBylawForm from "./CreateBylawForm";
import { departmentsAPI } from "@/api";
import { I18nProviderClient } from "@/locales/client";
import { getI18n } from "@/locales/server";

export const getAllDepartments = async () => {
  const accessToken = await getAccessToken();

  const response = await departmentsAPI.get(`/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status !== 200) throw new Error("Failed to fetch departments");

  return response.data;
}

export default async function Page({
  searchParams,
  params: { locale },
}: Readonly<{ params: {locale : string} ,searchParams: { page: string; } }>) {
  const departmentResponse = await getAllDepartments();
  return (
    <>
    <I18nProviderClient locale={locale}>
      <CreateBylawForm departments={departmentResponse.departments} />
    </I18nProviderClient>
    </>
  );
}
