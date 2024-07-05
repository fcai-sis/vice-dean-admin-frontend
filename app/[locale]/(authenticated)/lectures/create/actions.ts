"use server";

import { getAccessToken } from "@/lib";
import { CreateLectureOrSectionFormValues } from "./CreateLectureForm";
import { scheduleAPI } from "@/api";
import { revalidatePath } from "next/cache";

export const createLectureOrSectionAction = async (
  data: CreateLectureOrSectionFormValues
) => {
  const lectureOrSection = data.type;
  const isSection = lectureOrSection === "section";

  const accessToken = await getAccessToken();

  const thing = {
    slot: data.slot,
    hall: data.hall,
    course: data.course,
    ...(isSection && { group: data.group }),
  };
  const requestBody = {
    ...(isSection ? { section: thing } : { lecture: thing }),
  };

  const response = await scheduleAPI.post(`/${lectureOrSection}`, requestBody, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status !== 201) {
    console.log(response.data);

    return {
      success: false,
      ...response.data,
    };
  }

  revalidatePath("/lectures");

  return { success: true };
};
