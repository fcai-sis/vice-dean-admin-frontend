"use server";
import { getAccessToken } from "@/lib";
import { hallSlotAPI, instructorTaAPI } from "@/api";
import { revalidatePath } from "next/cache";
import { deleteTaFormValues } from "./DeleteTaForm";
import { CreateTaFormValues } from "./create/CreateTaForm";

export const createTaAction = async (data: CreateTaFormValues) => {
  const accessToken = await getAccessToken();

  const requestBody = {
    teachingAssistant: {
      ...data,
      password: undefined,
    },
    password: data.password,
  };
  console.log(requestBody);

  const response = await instructorTaAPI.post(
    `/teacherAssistants/create`,
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

  revalidatePath("/ta");

  return { success: true };
};

export const deleteTaAction = async (data: deleteTaFormValues) => {
  const accessToken = await getAccessToken();

  const taId = data.taId;
  console.log(taId);

  const response = await instructorTaAPI.delete(
    `/teacherAssistants/delete/${taId}`,
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

  revalidatePath("/ta");

  return { success: true };
};
