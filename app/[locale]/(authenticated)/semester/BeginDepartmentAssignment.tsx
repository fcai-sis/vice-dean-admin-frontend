"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { departmentAssignmentAction } from "./actions";
import { Button } from "@/components/Buttons";
import { PageHeader } from "@/components/PageBuilder";
import { tt } from "@/lib";
import { useCurrentLocale } from "@/locales/client";
import Spinner from "@/components/Spinner";

export default function BeginDepartmentAssignment() {
  const locale = useCurrentLocale();
  const router = useRouter();
  const {
    handleSubmit,

    formState: { isSubmitting },
  } = useForm({});

  const onSubmit = async () => {
    const departmentAssignmentResponse = await departmentAssignmentAction();

    if (!departmentAssignmentResponse.success) {
      return toast.error(departmentAssignmentResponse.error?.message);
    }

    toast.success("Semester has ended...");
    router.push(`/semester`);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={(e) => {
            if (
              confirm(
                tt(locale, {
                  en: "Are you sure you want to assign departments to students?",
                  ar: "هل أنت متأكد أنك تريد تعيين الأقسام للطلاب؟",
                })
              )
            ) {
              onSubmit();
            } else {
              e.preventDefault();
            }
          }}
        >
          {isSubmitting ? (
            <Spinner />
          ) : (
            tt(locale, {
              en: "Begin Department Assignment",
              ar: "بدء تعيين الأقسام",
            })
          )}
        </Button>
      </form>
    </>
  );
}
