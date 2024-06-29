"use server";
import { getAccessToken } from "@/lib";
import { scheduleAPI } from "@/api";
import { revalidatePath } from "next/cache";
import { CreateLectureFormValues } from "./create/CreateLectureForm";
import { deleteLectureFormValues } from "./DeleteLectureForm";

export const createLectureAction = async (data: CreateLectureFormValues) => {
  const accessToken = await getAccessToken();

  const requestBody = {
    lecture: {
      ...data,
    },
  };
  console.log(requestBody);

  const response = await scheduleAPI.post(`/lecture`, requestBody, {
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

  revalidatePath("/lectures");

  return { success: true };
};

export const deleteLectureAction = async (data: deleteLectureFormValues) => {
  const accessToken = await getAccessToken();

  const lectureId = data.lectureId;
  console.log(lectureId);

  const response = await scheduleAPI.delete(`/lecture/${lectureId}`, {
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

  revalidatePath("/lectures");

  return { success: true };
};
