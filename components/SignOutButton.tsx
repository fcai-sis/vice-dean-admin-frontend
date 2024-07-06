"use client";

import { useI18n } from "@/locales/client";
import { signOut } from "next-auth/react";
import { Button } from "./Buttons";
import { LogOut } from "iconoir-react";

export default function SignOutButton() {
  const t = useI18n();
  return (
    <Button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="w-full bg-white text-red-500 hover:bg-slate-100 [&_*]:stroke-red-500"
    >
      <LogOut />
      {t("nav.signOut")}
    </Button>
  );
}
