"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { departmentAssignmentAction } from "./actions";
import { Button } from "@/components/Buttons";
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

    toast.success(
      tt(locale, {
        en: "Department Assignment has been done",
        ar: "تم تعيين الأقسام",
      })
    );
    router.push(`/semester`);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Spinner />
          ) : (
            tt(locale, {
              en: "Assign Departments",
              ar: "تعيين الأقسام",
            })
          )}
        </Button>
      </form>
    </>
  );
}
