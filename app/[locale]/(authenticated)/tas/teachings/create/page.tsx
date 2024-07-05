import { revalidatePath } from "next/cache";
import { getAllCourses } from "../../../semester/create/page";
import CreateTaTeachingForm from "./CreateTaTeachingForm";
import { tasAPI } from "@/api";
import { getAccessToken, SupportedLocale } from "@/lib";

export async function getAllTas() {
  const accessToken = await getAccessToken();

  const response = await tasAPI.get(`/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status !== 200) throw new Error("Failed to fetch tas");

  revalidatePath("/tas");

  return response.data;
}

export default async function Page({
  params: { locale },
}: Readonly<{
  params: { locale: SupportedLocale };
}>) {
  const { courses } = await getAllCourses();
  const { teachingAssistants: tas } = await getAllTas();

  return (
    <>
      <CreateTaTeachingForm tas={tas} courses={courses} />
    </>
  );
}
