"use server";
import { getAccessToken } from "@/lib";
import { hallSlotAPI } from "@/api";
import { revalidatePath } from "next/cache";
import { CreateSlotFormValues } from "./create/CreateSlotForm";
import { deleteSlotFormValues } from "./DeleteSlotForm";

export const createSlotAction = async (data: CreateSlotFormValues) => {
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

export const deleteSlotAction = async (data: deleteSlotFormValues) => {
  const accessToken = await getAccessToken();

  const hallId = data.slotId;
  console.log(hallId);

  const response = await hallSlotAPI.delete(`/slot/slots/${hallId}`, {
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
