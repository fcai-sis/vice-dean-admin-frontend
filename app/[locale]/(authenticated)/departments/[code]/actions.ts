"use server";

import { getAccessToken } from "@/lib";
import { departmentsAPI } from "@/api";
import { revalidatePath } from "next/cache";
import { UpdateDepartmentFormValues } from "./UpdateDepartmentForm";

export const updateDepartmentAction = async (
  data: UpdateDepartmentFormValues
) => {
  const accessToken = await getAccessToken();

  const requestBody = {
    department: {
      name: data.name,
      code: data.code,
      program: data.program,
      capacity: data.capacity,
    },
  };

  console.log(requestBody);

  const response = await departmentsAPI.post(`/`, requestBody, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log(response.data);

  if (response.status !== 201) {
    return {
      success: false,
      ...response.data,
    };
  }

  revalidatePath("/departments");

  return { success: true };
};
