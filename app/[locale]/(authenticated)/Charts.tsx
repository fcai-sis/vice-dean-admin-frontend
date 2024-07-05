"use client";
import dynamic from "next/dynamic";
import "chart.js/auto";
import { useCurrentLocale } from "@/locales/client";
import { tt } from "@/lib";
const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
  ssr: false,
});
const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
});
const Pie = dynamic(() => import("react-chartjs-2").then((mod) => mod.Pie), {
  ssr: false,
});

export const NationalityDistributionChart = () => {
  const locale = useCurrentLocale();
  const data = {
    labels: [
      tt(locale, {
        en: "Egyptian",
        ar: "مصري",
      }),
      tt(locale, {
        en: "Saudi",
        ar: "سعودي",
      }),
      tt(locale, {
        en: "Syrian",
        ar: "سوري",
      }),
      tt(locale, {
        en: "Yemeni",
        ar: "يمني",
      }),
      tt(locale, {
        en: "Jordanian",
        ar: "أردني",
      }),
      tt(locale, {
        en: "Lebanese",
        ar: "لبناني",
      }),
      tt(locale, {
        en: "Sudanese",
        ar: "سوداني",
      }),
    ],
    datasets: [
      {
        label: tt(locale, {
          en: "Nationality Distribution",
          ar: "توزيع الجنسيات",
        }),
        data: [2622, 12, 37, 72, 33, 12, 425],
        backgroundColor: ["#3b82f6"],
        borderWidth: 0,
      },
    ],
  };
  return (
    <div className="w-[500px]">
      <Bar data={data} />
    </div>
  );
};

export const GenderDistributionChart = () => {
  const locale = useCurrentLocale();
  const data = {
    labels: [
      tt(locale, {
        en: "Male",
        ar: "ذكر",
      }),
      tt(locale, {
        en: "Female",

        ar: "أنثى",
      }),
    ],
    datasets: [
      {
        label: tt(locale, {
          en: "Gender Distribution",
          ar: "توزيع الجنس",
        }),
        data: [2622, 1403],
        backgroundColor: ["#3b82f6"],
        borderWidth: 0,
      },
    ],
  };
  return (
    <div className="w-[500px]">
      <Bar data={data} />
    </div>
  );
};

export const AverageGpaByDepartmentInSemester = () => {
  const locale = useCurrentLocale();
  const data = {
    labels: [
      tt(locale, {
        en: "Computer Science",
        ar: "علوم حاسب",
      }),
      tt(locale, {
        en: "Information Systems",
        ar: "نظم معلومات",
      }),
      tt(locale, {
        en: "Information Technology",
        ar: "تقنية معلومات",
      }),
      tt(locale, {
        en: "Decision Support",
        ar: "دعم القرار",
      }),
      tt(locale, {
        en: "Artificial Intelligence",
        ar: "ذكاء صناعي",
      }),
    ],
    datasets: [
      {
        label: tt(locale, {
          en: "Average GPA By Department",
          ar: "المعدل التراكمي للقسم",
        }),
        data: [3.5, 3.2, 3.1, 3.4, 3.3],
        backgroundColor: ["#3b82f6"],
        borderWidth: 0,
      },
    ],
  };
  return (
    <div className="w-[500px]">
      <Bar data={data} />
    </div>
  );
};

export const EnrollmentsEachYear = () => {
  const locale = useCurrentLocale();
  const data = {
    labels: ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: tt(locale, {
          en: "Enrollments Each Year",
          ar: "الطلاب المسجلين كل عام",
        }),
        data: [234, 244, 301, 400, 500, 600, 1200, 830],
        backgroundColor: ["#3b82f6"],
        borderWidth: 0,
      },
    ],
  };
  return (
    <div className="w-[500px]">
      <Line data={data} />
    </div>
  );
};
