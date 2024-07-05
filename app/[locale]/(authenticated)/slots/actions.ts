"use server";

import { getAccessToken } from "@/lib";
import { hallSlotAPI } from "@/api";
import { revalidatePath } from "next/cache";

export const createSlotAction = async (data: any) => {
  const accessToken = await getAccessToken();

  const requestBody = {
    slot: {
      ...data,
    },
  };
  console.log(requestBody);

  const response = await hallSlotAPI.post(`/slot`, requestBody, {
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

  revalidatePath("/slots");

  return { success: true };
};

export const deleteSlotAction = async (data: any) => {
  const accessToken = await getAccessToken();

  const slotId = data.slotId;
  console.log(slotId);

  const response = await hallSlotAPI.delete(`/slot/${slotId}`, {
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

  revalidatePath("/slots");

  return { success: true };
};
