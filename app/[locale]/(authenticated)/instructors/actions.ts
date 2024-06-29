"use server";
import { getAccessToken } from "@/lib";
import { hallSlotAPI, instructorTaAPI } from "@/api";
import { revalidatePath } from "next/cache";
import { CreateInstructorFormValues } from "./create/CreateInstructorForm";
import { deleteInstructorFormValues } from "./DeleteInstructorForm";

export const createInstructorAction = async (
  data: CreateInstructorFormValues
) => {
  const accessToken = await getAccessToken();

  const requestBody = {
    instructor: {
      ...data,
      password: undefined,
    },
    password: data.password,
  };
  console.log(requestBody);

  const response = await instructorTaAPI.post(
    `/instructors/create`,
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  console.log(response.data);

  if (response.status !== 201) {
    return {
      success: false,
      error: {
        message: response.data.error.message,
      },
    };
  }

  revalidatePath("/instructors");

  return { success: true };
};

export const deleteInstructorAction = async (
  data: deleteInstructorFormValues
) => {
  const accessToken = await getAccessToken();

  const instructorId = data.instructorId;
  console.log(instructorId);

  const response = await instructorTaAPI.delete(
    `/instructors/delete/${instructorId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  console.log(response.data);

  if (response.status !== 200) {
    return {
      success: false,
      error: {
        message: response.data.error.message,
      },
    };
  }

  revalidatePath("/instructors");

  return { success: true };
};
