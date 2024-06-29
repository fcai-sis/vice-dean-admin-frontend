import CreateSlotForm from "./CreateSlotForm";

export default async function Page({
  searchParams,
}: Readonly<{ searchParams: { page: string; department: string } }>) {
  return (
    <>
      <CreateSlotForm />
    </>
  );
}
