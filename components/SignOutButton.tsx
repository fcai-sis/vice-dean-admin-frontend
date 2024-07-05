"use client";

import { useI18n } from "@/locales/client";
import { signOut } from "next-auth/react";
import { Button } from "./Buttons";

export default function SignOutButton() {
  const t = useI18n();
  return (
    <Button onClick={() => signOut({ callbackUrl: "/" })}>
      {t("nav.signOut")}
    </Button>
  );
}
