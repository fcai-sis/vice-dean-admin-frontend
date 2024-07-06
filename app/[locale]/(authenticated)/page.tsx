"use client";
import { useState } from "react";
import {
  AverageGpaByDepartmentInSemester,
  EnrollmentsEachYear,
  GenderDistributionChart,
  NationalityDistributionChart,
} from "./Charts";

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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChart(e.target.value);
  };

  const displayedCharts =
    selectedChart === "all"
      ? charts
      : charts.filter((chart) => chart.id === selectedChart);

  return (
    <div className='min-h-screen bg-gray-100 p-8 overflow-auto'>
      <h1 className='text-2xl font-bold mb-8'>Dashboard</h1>
      <div className='mb-4'>
        <label className='block mb-2'>Select chart to display:</label>
        <select
          className='w-full p-2 border border-gray-300 rounded'
          value={selectedChart}
          onChange={handleSelectChange}
        >
          <option value='all'>All</option>
          {charts.map((chart) => (
            <option key={chart.id} value={chart.id}>
              {chart.label}
            </option>
          ))}
        </select>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {displayedCharts.map((chart) => (
          <div key={chart.id}>{chart.component}</div>
        ))}
      </div>
    </div>
  );
}
