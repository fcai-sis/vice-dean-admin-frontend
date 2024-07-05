import Link from "next/link";
import { getAccessToken } from "@/lib";
import { coursesAPI, hallsAPI, hallSlotAPI } from "@/api";
import { revalidatePath } from "next/cache";
import CreateLectureForm from "./CreateLectureForm";

export const getAllCourses = async () => {
  const accessToken = await getAccessToken();

  const response = await coursesAPI.get(`/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status !== 200) throw new Error("Failed to fetch courses");

  revalidatePath("/semester");

  return response.data;
};

export const getHalls = async () => {
  const accessToken = await getAccessToken();

  const response = await hallsAPI.get(`/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status !== 200) throw new Error("Failed to fetch halls");

  revalidatePath("/lectures");

  return response.data;
};

export const getSlots = async () => {
  const accessToken = await getAccessToken();

  const response = await hallSlotAPI.get(`/slot`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status !== 200) throw new Error("Failed to fetch slots");

  revalidatePath("/lectures");

  return response.data;
};

export default async function Page({
  params: { locale },
}: Readonly<{
  params: { locale: string };
}>) {
  const courseResponse = await getAllCourses();
  const courses = courseResponse.courses;
  const hallResponse = await getHalls();
  const halls = hallResponse.halls;
  const slotResponse = await getSlots();
  const slots = slotResponse.slots;

  /**
   * slots: {
      FRIDAY: [ slot, slot, slot ]
   *  }
   */

  const flattenedSlots = [];
  for (const day in slots) {
    for (const slot of slots[day]) {
      flattenedSlots.push(slot);
    }
  }

  return (
    <>
      <CreateLectureForm
        courses={courses}
        halls={halls}
        slots={flattenedSlots}
      />
    </>
  );
}
