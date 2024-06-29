"use server";
import { getAccessToken } from "@/lib";
import { coursesAPI, hallSlotAPI } from "@/api";
import { revalidatePath } from "next/cache";
import { CreateCourseFormValues } from "./create/CreateCourseForm";
import { deleteCourseFormValues } from "./DeleteCourseForm";

export const createCourseAction = async (data: CreateCourseFormValues) => {
  const accessToken = await getAccessToken();

  const requestBody = {
    course: {
      name: data.name,
      code: data.code,
    },
  };
  console.log(requestBody);

  const response = await coursesAPI.post(`/`, requestBody, {
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

  revalidatePath("/courses");

  return { success: true };
};

export const deleteCourseAction = async (data: deleteCourseFormValues) => {
  const accessToken = await getAccessToken();

  const courseId = data.courseId;
  console.log(courseId);

  const response = await coursesAPI.delete(`/${courseId}`, {
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

  revalidatePath("/courses");

  return { success: true };
};
