"use server";

import { getAccessToken } from "@/lib";
import { scheduleAPI } from "@/api";
import { revalidatePath } from "next/cache";
import { CreateTaTeachingFormValues } from "./create/CreateTaTeachingForm";
import { DeleteTaTeachingFormValues } from "./DeleteTaTeachingForm";

export const createTaTeachingAction = async (
  data: CreateTaTeachingFormValues
) => {
  const accessToken = await getAccessToken();

  const requestBody = {
    taTeaching: {
      ...data,
      email: undefined,
    },
    email: data.email,
  };
  console.log(requestBody);

  const response = await scheduleAPI.post(`/ta-teaching`, requestBody, {
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

  revalidatePath("/teachings");

  return { success: true };
};

export const deleteTaTeachingAction = async (
  data: DeleteTaTeachingFormValues
) => {
  const accessToken = await getAccessToken();

  const taTeachingId = data.taTeachingId;
  console.log(taTeachingId);

  const response = await scheduleAPI.delete(`/ta-teaching/${taTeachingId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  console.log(response.data);

  if (response.status !== 200) {
    return {
      success: false,
      ...response.data,
    };
  }

  revalidatePath("/teachings");

  return { success: true };
};
