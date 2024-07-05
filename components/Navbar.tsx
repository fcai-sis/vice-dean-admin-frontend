import SignOutButton from "@/components/SignOutButton";
import { I18nProviderClient } from "@/locales/client";
import { getI18n } from "@/locales/server";
import Link from "next/link";
import Dropdown from "./Dropdown";
import ChangeLanguageButton from "./ChangeLanguageButton";
import { Bank, BookStack, Building, Calendar, Home } from "iconoir-react";
import Image from "next/image";
import { tt } from "@/lib";

export default async function Navbar({ locale }: { locale: "en" | "ar" }) {
  const t = await getI18n();

  return (
    <nav className="z-40 fixed top-0 left-0 right-0 bg-white flex justify-between items-center py-4 px-24 shadow-md gap-4">
      <Image src={"/fcai.png"} alt="Logo" width={70} height={70} />
      <div className="flex gap-2">
        <Link href="/" className="flex gap-2 items-center">
          <Home />
          {t("home.title")}
        </Link>
        <Link href="/courses" className="flex gap-2 items-center">
          <BookStack />
          {tt(locale, {
            en: "Courses",
            ar: "المقررات",
          })}
        </Link>
        <Link href="/departments" className="flex gap-2 items-center">
          <Bank />
          {tt(locale, {
            en: "Departments",
            ar: "الأقسام",
          })}
        </Link>
        <Dropdown
          label={tt(locale, {
            en: "Halls & Slots",
            ar: "القاعات والفترات",
          })}
        >
          <Link href="/halls" className="flex gap-2 items-center w-full">
            <Building />
            {tt(locale, {
              en: "Halls",
              ar: "القاعات",
            })}
          </Link>
          <Link href="/slots" className="flex gap-2 items-center w-full">
            <Calendar />
            {tt(locale, {
              en: "Slots",
              ar: "الفترات",
            })}
          </Link>
        </Dropdown>
        <Link href="/semester" className="flex gap-2 items-center">
          <Calendar />
          {tt(locale, {
            en: "Semester",
            ar: "الفصل الدراسي",
          })}
        </Link>

        <Link href="/schedule" className="flex gap-2 items-center">
          <Calendar />
          {tt(locale, {
            en: "Schedule",
            ar: "الجدول",
          })}
        </Link>

        <I18nProviderClient locale={locale}>
          <Dropdown label={t("nav.more")}>
            <Link href="/instructors" className="block w-full">
              {t("nav.instructors")}
            </Link>
            <Link href="/tas" className="block w-full">
              {t("nav.teacherAssistants")}
            </Link>
            <Link href="/profile" className="block w-full">
              {t("profile.title")}
            </Link>
            <SignOutButton />
          </Dropdown>
        </I18nProviderClient>
      </div>
      <I18nProviderClient locale={locale}>
        <ChangeLanguageButton />
      </I18nProviderClient>
    </nav>
  );
}
