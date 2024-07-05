"use server";

import { coursesAPI } from "@/api";
import { getAccessToken } from "@/lib";
import { revalidatePath } from "next/cache";
import { UpdateCourseFormValues } from "./UpdateCourseForm";

export const updateCourseAction = async (data: UpdateCourseFormValues) => {
  const accessToken = await getAccessToken();

  const requestBody = {
    course: {
      name: data.name,
      description: data.description,
      departments: data.departments
        .map((d: any) => d.department)
        .filter((d: any) => d !== ""),
      prerequisites: data.prerequisites
        .map((p: any) => p.prerequisite)
        .filter((p: any) => p !== ""),
      courseType: data.courseType,
      creditHours: data.creditHours,
    },
  };

  console.log(requestBody);

  const response = await coursesAPI.patch(`/${data.code}`, requestBody, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status !== 200) {
    return {
      success: false,
      ...response.data,
    };
  }

  revalidatePath(`/courses/${data.code}`);

  return { success: true };
};
