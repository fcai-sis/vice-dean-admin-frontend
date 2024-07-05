"use server";

import { getAccessToken } from "@/lib";
import { coursesAPI } from "@/api";
import { revalidatePath } from "next/cache";
import { CreateCourseFormValues } from "./CreateCourseForm";

export const createCourseAction = async (data: CreateCourseFormValues) => {
  const accessToken = await getAccessToken();

  const requestBody = {
    course: {
      name: data.name,
      code: data.code,
      description: data.description,
      creditHours: data.creditHours,
      courseType: data.courseType,
      departments: data.departments
        .map((d: any) => d.department)
        .filter((d: any) => d !== ""),
      prerequisites: data.prerequisites
        .map((p: any) => p.prerequisite)
        .filter((p: any) => p !== ""),
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
      ...response.data,
    };
  }

  revalidatePath("/courses");

  return { success: true };
};
