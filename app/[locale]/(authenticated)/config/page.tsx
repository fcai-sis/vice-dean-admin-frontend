import { configAPI } from "@/api";
import { getAccessToken } from "@/lib";
import { revalidatePath } from "next/cache";
import UpdateConfigForm from "./UpdateConfigForm";

export const getDynamicConfig = async () => {
  const accessToken = await getAccessToken();

  const response = await configAPI.get(`/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status !== 200)
    throw new Error("Failed to fetch configuration settings");

  revalidatePath("/config");

  return response.data;
};

export default async function Page({
  searchParams,
}: Readonly<{ searchParams: { page: string } }>) {
  const response = await getDynamicConfig();
  const config = response.config;

  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='text-2xl font-bold mb-4'>Configuration Settings</h1>

      <div className='space-y-4'>
        <div className='flex items-center'>
          <h2 className='mr-2'>
            <b>Allow Course Enrollments?</b>
          </h2>
          <span className='text-lg'>
            {config.isCourseEnrollOpen ? "Yes" : "No"}
          </span>
        </div>
        <div className='flex items-center'>
          <h2 className='mr-2'>
            <b>Allow Department Enrollments?</b>
          </h2>
          <span className='text-lg'>
            {config.isDepartmentEnrollOpen ? "Yes" : "No"}
          </span>
        </div>
        <div className='flex items-center'>
          <h2 className='mr-2'>
            <b>Allow Graduation Project Registration?</b>
          </h2>
          <span className='text-lg'>
            {config.isGradProjectRegisterOpen ? "Yes" : "No"}
          </span>
        </div>
      </div>

      <div className='mt-8'>
        <UpdateConfigForm config={config} />
      </div>
    </div>
  );
}
