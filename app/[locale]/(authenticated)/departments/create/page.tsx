import CreateDepartmentForm from "./CreateDepartmentForm";

export default async function Page({
  searchParams,
}: Readonly<{ searchParams: { page: string; department: string } }>) {
  return (
    <>
      <CreateDepartmentForm />
    </>
  );
}
