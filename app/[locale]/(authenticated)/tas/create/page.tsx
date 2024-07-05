import { SupportedLocale } from "@/lib";
import { getDepartments } from "../page";
import CreateTaForm from "./CreateTaForm";

export default async function Page({
  params: { locale },
}: Readonly<{
  params: { locale: SupportedLocale };
}>) {
  const { departments } = await getDepartments();

  return (
    <>
      <CreateTaForm departments={departments} />
    </>
  );
}
