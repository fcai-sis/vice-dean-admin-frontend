"use server";
import { getAccessToken } from "@/lib";
import { scheduleAPI } from "@/api";
import { revalidatePath } from "next/cache";
import { deleteLectureFormValues } from "./DeleteLectureForm";

import { CreateLectureOrSectionFormValues } from "./CreateLectureForm";
import { deleteSectionFormValues } from "./DeleteSectionForm";

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

export const deleteLectureAction = async (data: deleteLectureFormValues) => {
  const accessToken = await getAccessToken();

  const lectureId = data.lectureId;

  const response = await scheduleAPI.delete(`/lecture/${lectureId}`, {
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

  revalidatePath("/schedule");

  return { success: true };
};

export const deleteSectionAction = async (data: deleteSectionFormValues) => {
  const accessToken = await getAccessToken();

  const sectionId = data.sectionId;

  const response = await scheduleAPI.delete(`/section/${sectionId}`, {
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

  revalidatePath("/schedule");

  return { success: true };
};
