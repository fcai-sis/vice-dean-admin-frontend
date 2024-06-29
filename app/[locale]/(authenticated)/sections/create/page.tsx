import Link from "next/link";
import { getAccessToken } from "@/lib";
import { coursesAPI, hallSlotAPI } from "@/api";
import { revalidatePath } from "next/cache";
import CreateLectureForm from "./CreateSectionForm";

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

  const response = await hallSlotAPI.get(`/hall/read`, {
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

  const response = await hallSlotAPI.get(`/slot/slots`, {
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

  return (
    <>
      <CreateLectureForm courses={courses} halls={halls} slots={slots} />
    </>
  );
}
