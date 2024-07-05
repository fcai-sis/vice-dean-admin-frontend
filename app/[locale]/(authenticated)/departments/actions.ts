"use server";
import { getAccessToken } from "@/lib";
import { departmentsAPI } from "@/api";
import { revalidatePath } from "next/cache";
import { CreateDepartmentFormValues } from "./create/CreateDepartmentForm";
import { deleteDepartmentFormValues } from "./DeleteDepartmentForm";

export const createDepartmentAction = async (
  data: CreateDepartmentFormValues
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

export const deleteDepartmentAction = async (
  data: deleteDepartmentFormValues
) => {
  const accessToken = await getAccessToken();

  const code = data.code;

  const response = await departmentsAPI.delete(`/${code}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  console.log(response.data);

  if (response.status !== 204) {
    return {
      success: false,
      ...response.data,
    };
  }

  revalidatePath("/departments");

  return { success: true };
};
