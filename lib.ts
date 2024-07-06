import { clsx, type ClassValue } from "clsx";
import { Session, getServerSession } from "next-auth";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export const TitleEnum = [
  "ASSISTANT",
  "ASSISTANT_INSTRUCTOR",
  "INSTRUCTOR",
  "ASSISTANT_PROFESSOR",
  "PROFESSOR",
] as const;

export type SupportedLocale = "en" | "ar";

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args));
}

function tokenPayload(session: Session | null) {
  return {
    role: session?.user?.name,
    userId: session?.user?.email,
  };
}

export async function getAccessToken() {
  const session = await getServerSession();
  const payload = tokenPayload(session);
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string);
  return accessToken;
}

export async function ensureAuthenticated() {
  const session = await getServerSession();
  if (!session) redirect("/auth");
  return session;
}

export async function ensureUnauthenticated() {
  const session = await getServerSession();
  if (session) redirect("/");
  return session;
}

export function getCurrentPage(searchParams: { page: string }) {
  let page = parseInt(searchParams.page, 10);
  if (!page || page < 1) page = 1;
  return page;
}

export function tt(
  locale: "en" | "ar",
  { en, ar }: { en: string; ar: string }
) {
  return locale === "ar" ? ar : en;
}

/**
 * The number of items to show per page.
 */
export const limit = 9;

export function localizedTitle(title: (typeof TitleEnum)[number]) {
  switch (title) {
    case "ASSISTANT":
      return {
        en: "Assistant",
        ar: "مساعد",
      };
    case "ASSISTANT_INSTRUCTOR":
      return {
        en: "Assistant Instructor",
        ar: "مدرس مساعد",
      };
    case "INSTRUCTOR":
      return {
        en: "Instructor",
        ar: "مدرس",
      };
    case "ASSISTANT_PROFESSOR":
      return {
        en: "Assistant Professor",
        ar: "أستاذ مساعد",
      };
    case "PROFESSOR":
      return {
        en: "Professor",
        ar: "أستاذ",
      };
  }
}
