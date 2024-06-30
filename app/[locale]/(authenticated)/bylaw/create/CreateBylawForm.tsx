"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { createBylawAction } from "../actions";

const gradeSchema = z.object({
  key: z.string().nonempty("Key is required"),
  weight: z.number().min(0, "Weight must be greater than or equal to 0"),
  percentage: z.object({
    min: z.number().min(0, "Percentage must be at least 0").max(100, "Percentage must be between 0 and 100"),
    max: z.number().min(0, "Percentage must be at least 0").max(100, "Percentage must be between 0 and 100"),
  }),
});

const levelRequirementSchema = z.object({
  key: z.string().nonempty("Key is required"),
  mandatoryHours: z.number().min(0, "Mandatory hours must be greater than or equal to 0").optional(),
  electiveHours: z.number().min(0, "Elective hours must be greater than or equal to 0").optional(),
  totalHours: z.number().min(0, "Total hours must be greater than or equal to 0").optional(),
  maxYears: z.number().min(1, "Max years must be greater than or equal to 1"),
});

const graduationProjectRequirementSchema = z.object({
  key: z.string().nonempty("Key is required"),
  mandatoryHours: z.number().min(0, "Mandatory hours must be greater than or equal to 0").optional(),
  electiveHours: z.number().min(0, "Elective hours must be greater than or equal to 0").optional(),
  totalHours: z.number().min(0, "Total hours must be greater than or equal to 0").optional(),
});

const bylawSchema = z.object({
  name: z.string().nonempty("Bylaw name is required"),
  gradeWeights: z.array(gradeSchema),
  gpaScale: z.number().positive("GPA Scale must be greater than 0"),
  useDetailedHours: z.boolean(),
  useDetailedGraduationProjectHours: z.boolean(),
  levelRequirements: z.array(levelRequirementSchema),
  graduationProjectRequirements: z.array(graduationProjectRequirementSchema),
  yearApplied: z.number(),
});

export type BylawFormValues = z.infer<typeof bylawSchema>;

export default function CreateBylawForm() {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<BylawFormValues>({
    resolver: zodResolver(bylawSchema),
    defaultValues: {
      name: "",
      gradeWeights: [],
      gpaScale: 0,
      useDetailedHours: false,
      useDetailedGraduationProjectHours: false,
      levelRequirements: [],
      graduationProjectRequirements: [],
      yearApplied: new Date().getFullYear(),
    },
  });

  const useDetailedHours = watch("useDetailedHours");
  const useDetailedGraduationProjectHours = watch("useDetailedGraduationProjectHours");

  const {
    fields: gradeWeightFields,
    append: appendGradeWeight,
    remove: removeGradeWeight,
  } = useFieldArray({
    control,
    name: "gradeWeights",
  });

  const {
    fields: levelRequirementFields,
    append: appendLevelRequirement,
    remove: removeLevelRequirement,
  } = useFieldArray({
    control,
    name: "levelRequirements",
  });

  const {
    fields: graduationProjectRequirementFields,
    append: appendGraduationProjectRequirement,
    remove: removeGraduationProjectRequirement,
  } = useFieldArray({
    control,
    name: "graduationProjectRequirements",
  });

  const onSubmit = async (values: BylawFormValues) => {
    const createBylawResponse = await createBylawAction(values);

    if (!createBylawResponse.success) {
      return toast.error(createBylawResponse.error?.message);
    }

    toast.success("Bylaw created successfully!");
    router.push(`/bylaws`);
  };

  return (
    <>
      <h1 className="text-2xl font-bold">Create Bylaw</h1>
      <p className="mt-2 text-sm text-gray-600">
        <span className="text-red-500">*</span> indicates a required field.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium text-gray-700">
            Bylaw Name <span className="text-red-500">*</span>:
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
          {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="gpaScale" className="block font-medium text-gray-700">
            GPA Scale <span className="text-red-500">*</span>:
          </label>
          <input
            id="gpaScale"
            type="number"
            {...register("gpaScale", { valueAsNumber: true })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
          {errors.gpaScale && <p className="mt-1 text-red-500 text-sm">{errors.gpaScale.message}</p>}
        </div>

        <div>
          <label htmlFor="useDetailedHours" className="inline-flex items-center">
            <input
              id="useDetailedHours"
              type="checkbox"
              {...register("useDetailedHours")}
              className="form-checkbox text-blue-500"
            />
            <span className="ml-2 text-gray-700">Use Detailed Hours</span>
          </label>
        </div>

        <div>
          <label htmlFor="useDetailedGraduationProjectHours" className="inline-flex items-center">
            <input
              id="useDetailedGraduationProjectHours"
              type="checkbox"
              {...register("useDetailedGraduationProjectHours")}
              className="form-checkbox text-blue-500"
            />
            <span className="ml-2 text-gray-700">Use Detailed Graduation Project Hours</span>
          </label>
        </div>

        <div>
          <label htmlFor="yearApplied" className="block font-medium text-gray-700">
            Year Applied <span className="text-red-500">*</span>:
          </label>
          <input
            id="yearApplied"
            type="number"
            {...register("yearApplied", { valueAsNumber: true })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
          {errors.yearApplied && <p className="mt-1 text-red-500 text-sm">{errors.yearApplied.message}</p>}
        </div>

        <fieldset>
          <legend className="block text-lg font-medium text-gray-700">Grade Weights</legend>
          <ul className="space-y-4">
            {gradeWeightFields.map((field, index) => (
              <li key={field.id} className="border border-gray-300 p-4 rounded-md">
                <div>
                  <label htmlFor={`gradeWeights.${index}.key`} className="block font-medium text-gray-700">
                    Key <span className="text-red-500">*</span>:
                  </label>
                  <input
                    id={`gradeWeights.${index}.key`}
                    type="text"
                    placeholder="Key"
                    {...register(`gradeWeights.${index}.key` as const)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor={`gradeWeights.${index}.weight`} className="block font-medium text-gray-700">
                    Weight <span className="text-red-500">*</span>:
                  </label>
                  <input
                    id={`gradeWeights.${index}.weight`}
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="Weight"
                    {...register(`gradeWeights.${index}.weight` as const, { valueAsNumber: true })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor={`gradeWeights.${index}.percentage.min`} className="block font-medium text-gray-700">
                    Min Percentage <span className="text-red-500">*</span>:
                  </label>
                  <input
                    id={`gradeWeights.${index}.percentage.min`}
                    type="number"
                    min={0}
                    max={100}
                    placeholder="Min Percentage"
                    {...register(`gradeWeights.${index}.percentage.min` as const, { valueAsNumber: true })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor={`gradeWeights.${index}.percentage.max`} className="block font-medium text-gray-700">
                    Max Percentage <span className="text-red-500">*</span>:
                  </label>
                  <input
                    id={`gradeWeights.${index}.percentage.max`}
                    type="number"
                    min={0}
                    max={100}
                    placeholder="Max Percentage"
                    {...register(`gradeWeights.${index}.percentage.max` as const, { valueAsNumber: true })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeGradeWeight(index)}
                  className="mt-2 text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => appendGradeWeight({ key: "", weight: 0, percentage: { min: 0, max: 100 } })}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Grade Weight
          </button>
        </fieldset>

        <fieldset>
          <legend className="block text-lg font-medium text-gray-700">Level Requirements</legend>
          <ul className="space-y-4">
            {levelRequirementFields.map((field, index) => (
              <li key={field.id} className="border border-gray-300 p-4 rounded-md">
                <div>
                  <label htmlFor={`levelRequirements.${index}.key`} className="block font-medium text-gray-700">
                    Key <span className="text-red-500">*</span>:
                  </label>
                  <input
                    id={`levelRequirements.${index}.key`}
                    type="text"
                    placeholder="Key"
                    {...register(`levelRequirements.${index}.key` as const)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                </div>
                {useDetailedHours ? (
                  <>
                    <div>
                      <label htmlFor={`levelRequirements.${index}.mandatoryHours`} className="block font-medium text-gray-700">
                        Mandatory Hours <span className="text-red-500">*</span>:
                      </label>
                      <input
                        id={`levelRequirements.${index}.mandatoryHours`}
                        type="number"
                        min={0}
                        placeholder="Mandatory Hours"
                        {...register(`levelRequirements.${index}.mandatoryHours` as const, { valueAsNumber: true })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label htmlFor={`levelRequirements.${index}.electiveHours`} className="block font-medium text-gray-700">
                        Elective Hours <span className="text-red-500">*</span>:
                      </label>
                      <input
                        id={`levelRequirements.${index}.electiveHours`}
                        type="number"
                        min={0}
                        placeholder="Elective Hours"
                        {...register(`levelRequirements.${index}.electiveHours` as const, { valueAsNumber: true })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label htmlFor={`levelRequirements.${index}.totalHours`} className="block font-medium text-gray-700">
                      Total Hours <span className="text-red-500">*</span>:
                    </label>
                    <input
                      id={`levelRequirements.${index}.totalHours`}
                      type="number"
                      min={0}
                      placeholder="Total Hours"
                      {...register(`levelRequirements.${index}.totalHours` as const, { valueAsNumber: true })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                  </div>
                )}
                <div>
                  <label htmlFor={`levelRequirements.${index}.maxYears`} className="block font-medium text-gray-700">
                    Max Years <span className="text-red-500">*</span>:
                  </label>
                  <input
                    id={`levelRequirements.${index}.maxYears`}
                    type="number"
                    min={1}
                    placeholder="Max Years"
                    {...register(`levelRequirements.${index}.maxYears` as const, { valueAsNumber: true })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeLevelRequirement(index)}
                  className="mt-2 text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => appendLevelRequirement({ key: "", mandatoryHours: 0, electiveHours: 0, totalHours: 0, maxYears: 1 })}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Level Requirement
          </button>
        </fieldset>

        <fieldset>
          <legend className="block text-lg font-medium text-gray-700">Graduation Project Requirements</legend>
          <ul className="space-y-4">
            {graduationProjectRequirementFields.map((field, index) => (
              <li key={field.id} className="border border-gray-300 p-4 rounded-md">
                <div>
                  <label htmlFor={`graduationProjectRequirements.${index}.key`} className="block font-medium text-gray-700">
                    Key <span className="text-red-500">*</span>:
                  </label>
                  <input
                    id={`graduationProjectRequirements.${index}.key`}
                    type="text"
                    placeholder="Key"
                    {...register(`graduationProjectRequirements.${index}.key` as const)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                </div>
                {useDetailedGraduationProjectHours ? (
                  <>
                    <div>
                      <label htmlFor={`graduationProjectRequirements.${index}.mandatoryHours`} className="block font-medium text-gray-700">
                        Mandatory Hours <span className="text-red-500">*</span>:
                      </label>
                      <input
                        id={`graduationProjectRequirements.${index}.mandatoryHours`}
                        type="number"
                        min={0}
                        placeholder="Mandatory Hours"
                        {...register(`graduationProjectRequirements.${index}.mandatoryHours` as const, { valueAsNumber: true })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label htmlFor={`graduationProjectRequirements.${index}.electiveHours`} className="block font-medium text-gray-700">
                        Elective Hours <span className="text-red-500">*</span>:
                      </label>
                      <input
                        id={`graduationProjectRequirements.${index}.electiveHours`}
                        type="number"
                        min={0}
                        placeholder="Elective Hours"
                        {...register(`graduationProjectRequirements.${index}.electiveHours` as const, { valueAsNumber: true })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label htmlFor={`graduationProjectRequirements.${index}.totalHours`} className="block font-medium text-gray-700">
                      Total Hours <span className="text-red-500">*</span>:
                    </label>
                    <input
                      id={`graduationProjectRequirements.${index}.totalHours`}
                      type="number"
                      min={0}
                      placeholder="Total Hours"
                      {...register(`graduationProjectRequirements.${index}.totalHours` as const, { valueAsNumber: true })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeGraduationProjectRequirement(index)}
                  className="mt-2 text-red-500 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => appendGraduationProjectRequirement({ key: "", mandatoryHours: 0, electiveHours: 0, totalHours: 0 })}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Graduation Project Requirement
          </button>
        </fieldset>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </>
  );
}
