"use server";
import { getAccessToken } from "@/lib";
import { hallsAPI, hallSlotAPI } from "@/api";
import { revalidatePath } from "next/cache";
import { CreateHallFormValues } from "./create/CreateHallForm";
import { deleteHallFormValues } from "./DeleteHallForm";

export const createHallAction = async (data: CreateHallFormValues) => {
  const accessToken = await getAccessToken();

  const requestBody = {
    hall: {
      name: data.name,
      capacity: data.capacity,
    },
  };
  console.log(requestBody);

  const response = await hallsAPI.post(`/`, requestBody, {
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

  revalidatePath("/halls");

  return { success: true };
};

export const deleteHallAction = async (data: deleteHallFormValues) => {
  const accessToken = await getAccessToken();

  const hallId = data.hallId;
  console.log(hallId);

  const response = await hallSlotAPI.delete(`/hall/halls/${hallId}`, {
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

  revalidatePath("/halls");

  return { success: true };
};
