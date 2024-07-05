"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { departmentAssignmentAction } from "./actions";
import { Button } from "@/components/Buttons";

export default function BeginDepartmentAssignment() {
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
      <h1>Begin Department Assignment?</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={(e) => {
            if (
              confirm("Are you sure you want to begin department assignment?")
            ) {
              onSubmit();
            } else {
              e.preventDefault();
            }
          }}
        >
          {isSubmitting ? "Processing..." : "Assign Departments To Students"}
        </Button>
      </form>
    </>
  );
}
