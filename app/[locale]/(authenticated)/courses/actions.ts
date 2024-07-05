"use server";

import { getAccessToken } from "@/lib";
import { deleteCourseFormValues } from "./DeleteCourseForm";
import { coursesAPI } from "@/api";
import { revalidatePath } from "next/cache";

export const deleteCourseAction = async (data: deleteCourseFormValues) => {
  const accessToken = await getAccessToken();

  const courseId = data.code;

  const response = await coursesAPI.delete(`/${courseId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  console.log(response.data);

  if (response.status !== 204) {
    return {
      success: false,
      ...response.data,
    };
  }

  revalidatePath("/courses");

  return { success: true };
};
