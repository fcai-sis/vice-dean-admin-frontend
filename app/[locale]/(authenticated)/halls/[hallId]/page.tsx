import { hallsAPI } from "@/api";
import UpdateHallForm from "./UpdateHallForm";

async function getHall(hallId: string) {
  const { data } = await hallsAPI.get(`/${hallId}`);
  console.log(data);
  return data;
}

export default async function Page({
  params: { hallId },
}: {
  params: { hallId: string };
}) {
  const { hall } = await getHall(hallId);
  return (
    <>
      <UpdateHallForm hall={hall} />
    </>
  );
}
