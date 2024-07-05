"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { endSemesterAction } from "./actions";
import { Button } from "@/components/Buttons";

export default function EndSemesterForm() {
  const router = useRouter();
  const {
    handleSubmit,

    formState: { isSubmitting },
  } = useForm({});

  const onSubmit = async () => {
    const endSemesterResponse = await endSemesterAction();

    if (!endSemesterResponse.success) {
      return toast.error(endSemesterResponse.error?.message);
    }

    toast.success("Semester has ended...");
    router.push(`/semester`);
  };

  return (
    <>
      <h1>End Latest Semester?</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={(e) => {
            if (
              confirm(
                "Are you sure you want to end the semester? This action is irreversible."
              )
            ) {
              onSubmit();
            } else {
              e.preventDefault();
            }
          }}
        >
          {isSubmitting ? "Processing..." : "End"}
        </Button>
      </form>
    </>
  );
}
