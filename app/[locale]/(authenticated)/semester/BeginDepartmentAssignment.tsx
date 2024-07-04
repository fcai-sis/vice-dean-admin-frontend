"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { departmentAssignmentAction } from "./actions";

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
        <button
          className='bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out active:bg-gray-700 mb-4'
          type='submit'
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
        </button>
      </form>
    </>
  );
}
