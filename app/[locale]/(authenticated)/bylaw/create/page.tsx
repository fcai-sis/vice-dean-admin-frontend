import CreateBylawForm from "./CreateBylawForm";

export default async function Page({
  searchParams,
}: Readonly<{ searchParams: { page: string; department: string } }>) {
  return (
    <>
      <CreateBylawForm />
    </>
  );
}
