import { scheduleAPI } from "@/api";
import { getAccessToken, limit, tt } from "@/lib";
import { getCurrentLocale } from "@/locales/server";
import { revalidatePath } from "next/cache";
import { PageHeader } from "@/components/PageBuilder";

export const getLectures = async (page: number) => {
  const accessToken = await getAccessToken();

  const response = await scheduleAPI.get(`/lectures`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      page,
      limit,
    },
  });

  if (response.status !== 200) throw new Error("Failed to fetch lectures");

  revalidatePath("/lectures");

  return response.data;
};

export const getEntireSchedule = async () => {
  const accessToken = await getAccessToken();

  const response = await scheduleAPI.get(`/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status !== 200) throw new Error("Failed to fetch schedule");

  revalidatePath("/lectures");

  return response.data;
};

export default async function Page({
  searchParams,
}: Readonly<{ searchParams: { page: string } }>) {
  const locale = getCurrentLocale();

  const latestSemester = await SemesterModel.findOne().sort({
    createdAt: -1,
  });

  if (!latestSemester) {
    return (
      <>
        <PageHeader
          title={tt(locale, {
            en: "Schedule",
            ar: "الجدول",
          })}
          actions={[]}
        />
        <div className="flex flex-col justify-center items-center gap-4">
          <p className="text-center text-slate-400">
            {tt(locale, {
              en: "No semester found",
              ar: "لم يتم العثور على فصل دراسي",
            })}
          </p>
          <ButtonLink href="/semester/create">
            {tt(locale, {
              en: "Create semester",
              ar: "إنشاء فصل دراسي",
            })}
          </ButtonLink>
        </div>
      </>
    );
  }

  const { slots, timeRanges, days } = await getSlots();
  const { schedule } = await getEntireSchedule();

  return (
    <>
      <PageHeader
        title={tt(locale, {
          en: "Schedule",
          ar: "الجدول",
        })}
        actions={[]}
      />
      <EntireSchedule
        days={days}
        schedule={schedule}
        slots={slots}
        timeRanges={timeRanges}
        latestSemester={latestSemester}
      />
    </>
  );
}

import { DummySlot } from "@/dummy/slots";
import {
  CourseModel,
  DayEnumType,
  dayLocalizedEnum,
  HallModel,
  SemesterCourseModel,
  SemesterModel,
} from "@fcai-sis/shared-models";
import { getSlots } from "../slots/page";
import CreateLectureOrSectionForm from "./CreateLectureForm";
import DeleteLectureForm from "./DeleteLectureForm";
import DeleteSectionForm from "./DeleteSectionForm";
import dbConnect from "@/database";
import { ButtonLink } from "@/components/Buttons";

/**
 * e.g.
 * formatSlotTime({
 *   day: DayEnum[0],
 *   startTime: { hour: 19, minute: 0 },
 *   endTime: { hour: 20, minute: 30 }
 * })
 * @param slot - The slot to format its time
 * @returns 7:00 PM - 8:30 PM
 */
function formatSlotTime(slot: any) {
  const startTimeAmPm = slot.start.hour >= 12 ? "PM" : "AM";
  const endTimeAmPm = slot.end.hour >= 12 ? "PM" : "AM";
  const startTimeHour = slot.start.hour % 12 || 12;
  const endTimeHour = slot.end.hour % 12 || 12;

  return `${startTimeHour}:${slot.start.minute
    .toString()
    .padStart(2, "0")} ${startTimeAmPm} - ${endTimeHour}:${slot.end.minute
    .toString()
    .padStart(2, "0")} ${endTimeAmPm}`;
}

function isSameSlot(slot1: DummySlot, slot2: DummySlot): boolean {
  const res =
    slot1.day === slot2.day &&
    slot1.start.hour === slot2.start.hour &&
    slot1.start.minute === slot2.start.minute &&
    slot1.end.hour === slot2.end.hour &&
    slot1.end.minute === slot2.end.minute;

  if (res) {
    console.log("slot1", slot1);
    console.log("slot2", slot2);
  }

  return res;
}

export type ScheduleProps = {
  slots: Record<DayEnumType, DummySlot[]>;
  days: { day: DayEnumType }[];
  timeRanges: {
    day: undefined;
    start: {
      hour: number;
      minute: number;
    };
    end: {
      hour: number;
      minute: number;
    };
  }[];
  schedule: any[];
  latestSemester: any;
};

export async function EntireSchedule({
  days,
  timeRanges,
  slots,
  schedule,
  latestSemester,
}: ScheduleProps) {
  const locale = getCurrentLocale();
  await dbConnect();

  if (timeRanges.length === 0 || days.length === 0) {
    return (
      <>
        <div className="flex flex-col justify-center items-center gap-4">
          <p className="text-center text-slate-400">
            {tt(locale, {
              en: "No slots found",
              ar: "لم يتم العثور على فترات",
            })}
          </p>
          <ButtonLink href="/slots">
            {tt(locale, {
              en: "Create slots",
              ar: "إنشاء فترات",
            })}
          </ButtonLink>
        </div>
      </>
    );
  }

  return (
    <div className="table border-separate border-spacing-2 w-full">
      <div className="table-header-group">
        <div className="table-row">
          <div className="table-cell p-2"></div>
          {timeRanges.map((timeRange) => (
            <div
              className="table-cell rounded-lg p-2 bg-white border border-slate-200 text-center"
              key={JSON.stringify(timeRange)}
            >
              <p dir="ltr">
                {formatSlotTime(timeRange as unknown as DummySlot)}
              </p>
            </div>
          ))}
        </div>
      </div>
      {days.map(({ day: currentDay }) => (
        <div className="table-row" key={currentDay}>
          <div className="table-cell rounded-lg p-2 bg-white border border-slate-200">
            {tt(locale, dayLocalizedEnum[currentDay as DayEnumType])}
          </div>
          {timeRanges.map((currentTimeRange, index) => (
            <>
              {(async () => {
                // find all items that have the same slot and check if they are lectures or sections
                const lectuesAndSectionsInThatDayAndTimeRange = schedule.filter(
                  (item) =>
                    isSameSlot(item.slot, {
                      day: currentDay,
                      start: currentTimeRange.start,
                      end: currentTimeRange.end,
                    })
                );

                console.log(
                  `Found ${
                    lectuesAndSectionsInThatDayAndTimeRange.length
                  } items for ${currentDay} ${JSON.stringify(currentTimeRange)}`
                );

                if (lectuesAndSectionsInThatDayAndTimeRange.length === 0) {
                  const [semesterCourses, halls] = await Promise.all([
                    SemesterCourseModel.find({
                      semester: latestSemester._id,
                    }).populate("course"),
                    HallModel.find(),
                  ]);

                  const currentSlot = slots[currentDay].find((slot) =>
                    isSameSlot(slot, {
                      day: currentDay,
                      start: currentTimeRange.start,
                      end: currentTimeRange.end,
                    })
                  )!;

                  return (
                    <div
                      className="table-cell bg-slate-50 rounded-lg content-center"
                      key={index}
                    >
                      <CreateLectureOrSectionForm
                        courses={semesterCourses.map((sc) => ({
                          name: sc.course.name,
                          code: sc.course.code,
                        }))}
                        halls={halls.map((hall) => hall.toJSON())}
                        slot={currentSlot._id!}
                      />
                    </div>
                  );
                }

                // map each item to a form based on its type
                return (
                  <div
                    className="table-cell p-2 bg-slate-100 rounded-lg"
                    key={index}
                  >
                    {lectuesAndSectionsInThatDayAndTimeRange.map(
                      (item, index) => {
                        if (item.type === "lecture") {
                          return <LectureSlot key={index} item={item} />;
                        } else if (item.type === "section") {
                          return <SectionSlot key={index} item={item} />;
                        } else {
                          return "Invalid type";
                        }
                      }
                    )}

                    <>
                      {(async () => {
                        const cantCourses =
                          lectuesAndSectionsInThatDayAndTimeRange.map(
                            (item) =>
                              item.lecture?.course.code ||
                              item.section?.course.code
                          );

                        const [courses, halls] = await Promise.all([
                          SemesterCourseModel.aggregate([
                            {
                              $match: {
                                semester: latestSemester._id,
                              },
                            },
                            {
                              $lookup: {
                                from: CourseModel.collection.name,
                                localField: "course",
                                foreignField: "_id",
                                as: "course",
                              },
                            },
                            {
                              $unwind: {
                                path: "$course",
                                preserveNullAndEmptyArrays: true,
                              },
                            },
                          ]),
                          HallModel.find({
                            _id: {
                              $nin: lectuesAndSectionsInThatDayAndTimeRange.map(
                                (item) => item.hall._id
                              ),
                            },
                          }),
                        ]);

                        const currentSlot = slots[currentDay].find((slot) =>
                          isSameSlot(slot, {
                            day: currentDay,
                            start: currentTimeRange.start,
                            end: currentTimeRange.end,
                          })
                        )!;

                        return (
                          <CreateLectureOrSectionForm
                            courses={courses
                              .filter(
                                (course) =>
                                  !cantCourses.includes(course.course.code)
                              )
                              .map((course) => ({
                                name: course.course.name,
                                code: course.course.code,
                              }))}
                            halls={halls.map((hall) => hall.toJSON())}
                            slot={currentSlot._id!}
                          />
                        );
                      })()}
                    </>
                  </div>
                );
              })()}
            </>
          ))}
        </div>
      ))}
    </div>
  );
}

type LectureSlotProps = Readonly<{
  item: any;
}>;
function LectureSlot({ item }: LectureSlotProps) {
  const locale = getCurrentLocale();
  const { lecture, hall } = item;
  return (
    <div className="p-2 m-1 rounded-lg bg-white border border-slate-200">
      <p>
        <small className="text-slate-400">
          {tt(locale, { en: "Lecture", ar: "محاضرة" })}
        </small>
      </p>
      <p>{tt(locale, lecture.course.name)}</p>
      {/* <p>{lecture.course.code}</p> */}
      {/* <p>{lecture.instructor.fullName}</p> */}
      <p className="flex py-1">
        <small className="rounded-lg bg-blue-100 text-blue-500 p-2">
          {tt(locale, hall.name)}
        </small>
      </p>
      <DeleteLectureForm lectureId={item._id} />
    </div>
  );
}

type SectionSlotProps = Readonly<{
  item: any;
}>;
function SectionSlot({ item }: SectionSlotProps) {
  const locale = getCurrentLocale();
  const { hall, section } = item;

  return (
    <div className="p-2 m-1 rounded-lg bg-white border border-slate-200">
      <p>
        <small className="text-slate-400">
          {tt(locale, { en: "Section", ar: "مجموعة" })}
        </small>
      </p>
      <p>{tt(locale, section.course.name)}</p>
      <p className="flex py-1 gap-2">
        <small className="rounded-lg bg-blue-100 text-blue-500 p-2">
          {tt(locale, hall.name)}
        </small>
        <small className="rounded-lg bg-blue-100 text-blue-500 p-2">
          {section.group}
        </small>
      </p>
      <DeleteSectionForm sectionId={item._id} />
    </div>
  );
}
