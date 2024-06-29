import Link from "next/link";
import CreateSemesterForm from "./CreateSemesterForm";

export default async function Page({
  params: { locale },
}: Readonly<{
  params: { locale: string };
}>) {
  return (
    <>
      <CreateSemesterForm/>
    </>
  );
}
