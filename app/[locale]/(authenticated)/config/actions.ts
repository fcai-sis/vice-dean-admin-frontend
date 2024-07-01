"use server";

import { getAccessToken } from "@/lib";
import { UpdateConfigFormValues } from "./UpdateConfigForm";
import { configAPI } from "@/api";
import { revalidatePath } from "next/cache";

export const updateConfigAction = async (data: UpdateConfigFormValues) => {
  const accessToken = await getAccessToken();

  const requestBody = {
    config: {
      ...data,
    },
  };

  const response = await configAPI.patch(`/`, requestBody, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status !== 200) {
    return {
      success: false,
      error: {
        message: response.data.error.message,
      },
    };
  }

  revalidatePath("/config");

  return { success: true };
};
