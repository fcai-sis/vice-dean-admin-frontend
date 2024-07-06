import {
  AverageGpaByDepartmentInSemester,
  EnrollmentsEachYear,
  GenderDistributionChart,
  NationalityDistributionChart,
} from "./Charts";
import { PageHeader } from "@/components/PageBuilder";
import { tt } from "@/lib";
import { getCurrentLocale } from "@/locales/server";

const charts = [
  {
    id: "nationality",
    label: "Nationality Distribution",
    component: <NationalityDistributionChart />,
  },
  {
    id: "gender",
    label: "Gender Distribution",
    component: <GenderDistributionChart />,
  },
  {
    id: "gpa",
    label: "Average GPA By Department",
    component: <AverageGpaByDepartmentInSemester />,
  },
  {
    id: "enrollments",
    label: "Enrollments Each Year",
    component: <EnrollmentsEachYear />,
  },
];

export default function Page() {
  const locale = getCurrentLocale();

  return (
    <>
      <PageHeader
        title={tt(locale, {
          en: "Statistics & Reports",
          ar: "الإحصائيات والتقارير",
        })}
        actions={[]}
      />
      <div className='min-h-screen bg-gray-200 p-8 overflow-auto'>
        <div className=' grid grid-col-1 md:grid-cols-2 gap-10'>
          {charts.map((chart) => (
            <div key={chart.id}>{chart.component}</div>
          ))}
        </div>
      </div>
    </>
  );
}
