"use server";

import { getAccessToken } from "@/lib";
import { bylawAPI } from "@/api";
import { revalidatePath } from "next/cache";
import { BylawFormValues } from "./create/CreateBylawForm";

interface GradeWeight {
  weight: number;
  percentage: {
    min: number;
    max: number;
  };
}

interface LevelRequirement {
  mandatoryHours?: number;
  electiveHours?: number;
  totalHours?: number;
  maxYears: number;
}

interface GraduationProjectRequirement {
  mandatoryHours?: number;
  electiveHours?: number;
  totalHours?: number;
}

interface IBylaw {
  name: string;
  gpaScale: number;
  useDetailedHours: boolean;
  useDetailedGraduationProjectHours: boolean;
  gradeWeights: {
    key: string;
    weight: number;
    percentage: {
      min: number;
      max: number;
    }
  }[];
  levelRequirements: {
    key: string;
    mandatoryHours?: number;
    electiveHours?: number;
    totalHours?: number;
    maxYears: number;
  }[];
  graduationProjectRequirements: {
    key: string;
    mandatoryHours?: number;
    electiveHours?: number;
    totalHours?: number;
  }[];
  yearApplied: number;
}

interface TransformedBylaw {
  name: string;
  gpaScale: number;
  useDetailedHours: boolean;
  useDetailedGraduationProjectHours: boolean;
  gradeWeights: Record<string, GradeWeight>;
  levelRequirements: Record<string, LevelRequirement>;
  graduationProjectRequirements: Record<string, GraduationProjectRequirement>;
  yearApplied: number;
}

const transformBylawData = (submittedData: IBylaw): TransformedBylaw => {
  return {
    ...submittedData,
    gradeWeights: submittedData.gradeWeights.reduce((acc, item) => {
      acc[item.key] = {
        weight: item.weight,
        percentage: item.percentage
      };
      return acc;
    }, {} as Record<string, GradeWeight>),
    levelRequirements: submittedData.levelRequirements.reduce((acc, item) => {
      acc[item.key] = {
        mandatoryHours: item.mandatoryHours,
        electiveHours: item.electiveHours,
        totalHours: item.totalHours,
        maxYears: item.maxYears
      };
      return acc;
    }, {} as Record<string, LevelRequirement>),
    graduationProjectRequirements: submittedData.graduationProjectRequirements.reduce((acc, item) => {
      acc[item.key] = {
        mandatoryHours: item.mandatoryHours,
        electiveHours: item.electiveHours,
        totalHours: item.totalHours
      };
      return acc;
    }, {} as Record<string, GraduationProjectRequirement>),
  };
};

export const createBylawAction = async (data: BylawFormValues) => {
  const accessToken = await getAccessToken();

  // Convert the form data to match the required API format
  const submittedData: IBylaw = { ...data };
  console.log("submittedData", submittedData);
  const requestBody = transformBylawData(submittedData);
  
  console.log("requestBody", requestBody);
  
  // Here you would typically make the API call
 const response = await bylawAPI.post(`/`, requestBody, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status !== 201) {
    return {
      success: false,
      error: {
        message: response.data.errors
          .map((error: any) => error.message)
          .join(", "),
      },
    };
  }

  revalidatePath("/bylaws");

  return { success: true };
};
