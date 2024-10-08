"use server";

import { getAccessToken } from "@/lib";
import { CreateSemesterFormValues } from "./create/CreateSemesterForm";
import { departmentEnrollmentAPI, scheduleAPI, semesterAPI } from "@/api";
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
      ...response.data,
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
      ...response.data,
    };
  }

  revalidatePath("/semester");

  return { success: true };
};

export const endSemesterAction = async () => {
  const accessToken = await getAccessToken();

  const response = await scheduleAPI.post(`/semester/end`, {
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

  revalidatePath("/semester");

  return { success: true };
};

export const departmentAssignmentAction = async () => {
  const accessToken = await getAccessToken();

  const response = await departmentEnrollmentAPI.post(`/assign`, {
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

  revalidatePath("/semester");

  return { success: true };
};
