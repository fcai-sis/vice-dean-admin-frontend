import CreateHallForm from "./CreateCourseForm";

export default async function Page({
  searchParams,
}: Readonly<{ searchParams: { page: string; department: string } }>) {
  return (
    <>
      <CreateHallForm />
    </>
  );
}
