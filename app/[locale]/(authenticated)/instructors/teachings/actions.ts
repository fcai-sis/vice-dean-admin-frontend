"use server";
import { getAccessToken } from "@/lib";
import { scheduleAPI } from "@/api";
import { revalidatePath } from "next/cache";
import { CreateInstructorTeachingFormValues } from "./create/CreateInstructorTeachingForm";
import { DeleteInstructorTeachingFormValues } from "./DeleteInstructorTeachingForm";

export const createInstructorTeachingAction = async (
  data: CreateInstructorTeachingFormValues
) => {
  const accessToken = await getAccessToken();

  const requestBody = {
    instructorTeaching: {
      ...data,
      email: undefined,
    },
    email: data.email,
  };
  console.log(requestBody);

  const response = await scheduleAPI.post(`/instructor-teaching`, requestBody, {
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

  revalidatePath("/teachings");

  return { success: true };
};

export const deleteInstructorTeachingAction = async (
  data: DeleteInstructorTeachingFormValues
) => {
  const accessToken = await getAccessToken();

  const instructorTeachingId = data.instructorTeachingId;
  console.log(instructorTeachingId);

  const response = await scheduleAPI.delete(
    `/instructor-teaching/${instructorTeachingId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  console.log(response.data);

  if (response.status !== 200) {
    return {
      success: false,
      ...response.data,
    };
  }

  revalidatePath("/teachings");

  return { success: true };
};
