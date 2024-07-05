import { getCurrentLocale } from "@/locales/server";
import Link from "next/link";

export default async function Page({
  searchParams,
}: Readonly<{ searchParams: { page: string } }>) {
  const locale = getCurrentLocale();

  return (
    <>
      <Link href="/bylaw/create"> Create Bylaw</Link>
    </>
  );
}
