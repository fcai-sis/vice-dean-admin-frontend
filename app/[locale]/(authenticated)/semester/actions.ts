"use server";
import { getAccessToken } from "@/lib";
import { CreateSemesterFormValues } from "./create/CreateSemesterForm";
import { semesterAPI } from "@/api";
import { revalidatePath } from "next/cache";
import { UpdateSemesterFormValues } from "./update/UpdateSemesterForm";

export const createSemesterAction = async (data: CreateSemesterFormValues) => {
  const accessToken = await getAccessToken();

  const requestBody = {
    semester: {
      season: data.season,
    },
    // map over the courses and only return the course code value
    courses: data.courses.map((course) => course.course),
  };
  console.log(requestBody);

  const response = await semesterAPI.post(`/`, requestBody, {
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

  revalidatePath("/semester");

  return { success: true };
};

export const updateSemesterAction = async (data: UpdateSemesterFormValues) => {
  const accessToken = await getAccessToken();

  const requestBody = {
    semester: {
      season: data.season,
    },
    // map over the courses and only return the course code value
    courses: data.courses?.map((course) => course.course),
  };
  console.log(requestBody);

  const response = await semesterAPI.patch(`/${data.semesterId}`, requestBody, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status !== 200) {
    return {
      success: false,
      error: {
        message: response.data.error.message,
      },
    };
  }

  revalidatePath("/semester");

  return { success: true };
};
