"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { endSemesterAction } from "./actions";

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
        <button
          className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out active:bg-red-700 mb-4'
          type='submit'
          disabled={isSubmitting}
          onClick={() => {
            if (
              confirm(
                "Are you sure you want to end the semester? This action is irreversible."
              )
            ) {
              onSubmit();
            }
          }}
        >
          {isSubmitting ? "Processing..." : "End"}
        </button>
      </form>
    </>
  );
}
