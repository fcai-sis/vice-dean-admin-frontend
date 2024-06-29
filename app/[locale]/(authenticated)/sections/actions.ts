"use server";
import { getAccessToken } from "@/lib";
import { scheduleAPI } from "@/api";
import { revalidatePath } from "next/cache";
import { CreateSectionFormValues } from "./create/CreateSectionForm";
import { deleteSectionFormValues } from "./DeleteSectionForm";

export const createSectionAction = async (data: CreateSectionFormValues) => {
  const accessToken = await getAccessToken();

  const requestBody = {
    section: {
      ...data,
    },
  };
  console.log(requestBody);

  const response = await scheduleAPI.post(`/section`, requestBody, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status !== 201) {
    return {
      success: false,
      error: {
        message: response.data.error.message,
      },
    };
  }

  revalidatePath("/sections");

  return { success: true };
};

export const deleteSectionAction = async (data: deleteSectionFormValues) => {
  const accessToken = await getAccessToken();

  const sectionId = data.sectionId;
  console.log(sectionId);

  const response = await scheduleAPI.delete(`/section/${sectionId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log(response.data);

  if (response.status !== 200) {
    return {
      success: false,
      error: {
        message: response.data.error.message,
      },
    };
  }

  revalidatePath("/sections");

  return { success: true };
};
