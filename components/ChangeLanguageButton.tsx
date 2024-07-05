"use client";

import { Language } from "iconoir-react";
import { useChangeLocale, useCurrentLocale } from "../locales/client";
import { ComponentProps } from "react";
import { Button } from "./Buttons";

export default function ChangeLanguageButton({
  className,
}: ComponentProps<"button">) {
  const changeLocale = useChangeLocale();
  const locale = useCurrentLocale();

  const to = locale === "ar" ? "en" : "ar";

  return (
    <>
      <Button
        variant="light"
        onClick={() => changeLocale(to)}
        className={className}
      >
        <Language />
      </Button>
    </>
  );
}
