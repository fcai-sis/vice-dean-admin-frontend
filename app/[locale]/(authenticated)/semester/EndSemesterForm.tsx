"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { endSemesterAction } from "./actions";
import { Button } from "@/components/Buttons";
import Spinner from "@/components/Spinner";
import { tt } from "@/lib";
import { useCurrentLocale } from "@/locales/client";

export default function EndSemesterForm() {
  const locale = useCurrentLocale();
  const router = useRouter();
  const {
    handleSubmit,

    formState: { isSubmitting },
  } = useForm({});

  const onSubmit = async () => {
    const endSemesterResponse = await endSemesterAction();

    if (!endSemesterResponse.success) {
      for (const error of endSemesterResponse.errors) {
        toast.error(error.message);
      }
      return;
    }

    toast.success("Semester has ended...");
    router.push(`/semester`);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Button variant="danger" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Spinner />
          ) : (
            tt(locale, {
              en: "End Semester",
              ar: "انهاء الفصل",
            })
          )}
        </Button>
      </form>
    </>
  );
}
