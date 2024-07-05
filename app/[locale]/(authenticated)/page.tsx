import {
  AverageGpaByDepartmentInSemester,
  EnrollmentsEachYear,
  GenderDistributionChart,
  NationalityDistributionChart,
} from "./Charts";

export default async function Page() {
  return (
    <div className="flex flex-wrap gap-8">
      <NationalityDistributionChart />
      <GenderDistributionChart />
      <AverageGpaByDepartmentInSemester />
      <EnrollmentsEachYear />
    </div>
  );
}
