"use server";

import { getAccessToken } from "@/lib";
import { hallsAPI } from "@/api";
import { revalidatePath } from "next/cache";
import { UpdateHallFormValues } from "./UpdateHallForm";

export const updateHallAction = async (data: UpdateHallFormValues) => {
  const accessToken = await getAccessToken();

  const requestBody = {
    name: data.name,
    capacity: data.capacity,
  };

  console.log(requestBody);

  const response = await hallsAPI.patch(`/${data._id}`, requestBody, {
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

  revalidatePath("/halls");

  return { success: true };
};
