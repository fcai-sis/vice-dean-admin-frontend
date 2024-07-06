// import {
//   AverageGpaByDepartmentInSemester,
//   EnrollmentsEachYear,
//   GenderDistributionChart,
//   NationalityDistributionChart,
// } from "./Charts";
// import { PageHeader } from "@/components/PageBuilder";
// import { tt } from "@/lib";
// import { getCurrentLocale } from "@/locales/server";

// const charts = [
//   {
//     id: "nationality",
//     label: "Nationality Distribution",
//     component: <NationalityDistributionChart />,
//   },
//   {
//     id: "gender",
//     label: "Gender Distribution",
//     component: <GenderDistributionChart />,
//   },
//   {
//     id: "gpa",
//     label: "Average GPA By Department",
//     component: <AverageGpaByDepartmentInSemester />,
//   },
//   {
//     id: "enrollments",
//     label: "Enrollments Each Year",
//     component: <EnrollmentsEachYear />,
//   },
// ];

// export default function Page() {
//   const locale = getCurrentLocale();

//   return (
//     <>
//       <PageHeader
//         title={tt(locale, {
//           en: "Statistics & Reports",
//           ar: "الإحصائيات والتقارير",
//         })}
//         actions={[]}
//       />
//       <div className='min-h-screen bg-gray-200 p-8 overflow-auto'>
//         <div className=' grid grid-col-1 md:grid-cols-2 gap-10'>
//           {charts.map((chart) => (
//             <div key={chart.id}>{chart.component}</div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }

"use client";
import { useState } from "react";
import {
  AverageGpaByDepartmentInSemester,
  EnrollmentsEachYear,
  GenderDistributionChart,
  NationalityDistributionChart,
} from "./Charts";
import { getCurrentLocale } from "@/locales/server";
import { PageHeader } from "@/components/PageBuilder";
import { tt } from "@/lib";
import { useCurrentLocale } from "@/locales/client";

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
  const [selectedChart, setSelectedChart] = useState("all");
  const locale = useCurrentLocale();

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChart(e.target.value);
  };

  const displayedCharts =
    selectedChart === "all"
      ? charts
      : charts.filter((chart) => chart.id === selectedChart);

  return (
    <div className="min-h-screen bg-gray-100 p-8 overflow-auto">
      <PageHeader
        title={tt(locale, {
          en: "Statistics & Reports",
          ar: "الإحصائيات والتقارير",
        })}
        actions={[]}
      />
      <div className="mb-4">
        <label className="block mb-2">
          {tt(locale, {
            en: "Select Chart",
            ar: "اختر الرسم البياني",
          })}
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded"
          value={selectedChart}
          onChange={handleSelectChange}
        >
          <option value="all">All</option>
          {charts.map((chart) => (
            <option key={chart.id} value={chart.id}>
              {chart.label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {displayedCharts.map((chart) => (
          <div key={chart.id}>{chart.component}</div>
        ))}
      </div>
    </div>
  );
}
