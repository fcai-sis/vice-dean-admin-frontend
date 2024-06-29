"use server";
import { getAccessToken } from "@/lib";
import { departmentsAPI, hallSlotAPI } from "@/api";
import { revalidatePath } from "next/cache";
import { CreateDepartmentFormValues } from "./create/CreateDepartmentForm";
import { deleteDepartmentFormValues } from "./DeleteDepartmentForm";

export const createDepartmentAction = async (data: CreateDepartmentFormValues) => {
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
      error: {
        message: response.data.errors
          .map((error: any) => error.message)
          .join(", "),
      },
    };
  }

  revalidatePath("/departments");

  return { success: true };
};

export const deleteDepartmentAction = async (data: deleteDepartmentFormValues) => {
  const accessToken = await getAccessToken();

  const departmentId = data.departmentId;

  const response = await departmentsAPI.delete(`${departmentId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log(response.data);

  if (response.status !== 200) {
    return {
      success: false,
      error: {
        message: response.data.errors
          .map((error: any) => error.message)
          .join(", "),
      },
    };
  }

  revalidatePath("/departments");

  return { success: true };
};
