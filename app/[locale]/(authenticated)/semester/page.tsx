import Link from "next/link";

export default async function Page({
  params: { locale },
}: Readonly<{
  params: { locale: string };
}>) {
  return (
    <>
      <h1>Semesters</h1>
      <Link href='/semester/create' className='btn'>
        Create semester
      </Link>
    </>
  );
}
