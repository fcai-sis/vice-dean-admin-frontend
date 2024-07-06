// locales/en.ts
export default {
  general: {
    loading: "Loading...",
    submit: "Submit",
    ok: "OK",
    cancel: "Cancel",
    back: "Back",
    error: {
      somethingWentWrong: "Something went wrong",
    },
  },
  nav: {
    home: "Home",
    students: "Students",
    announcements: "Announcements",
    serviceRequests: "Service Requests",
    instructors: "Instructors",
    teacherAssistants: "Teaching Assistants",
    profile: "Profile",
    more: "More",
    signOut: "Sign Out",
  },
  pagination: {
    previous: "Previous",
    next: "Next",
  },
  auth: {
    title: "Login",
    username: "Username",
    studentId: "Student ID",
    password: "Password",
    login: "Login",
    success: "Successfully signed in",
    error: {
      invalidCredentials: "Invalid credentials",
    },
  },
  home: {
    title: "Home",
    greeting: "Hello, {name}",
    search: "Search",
    searchPlaceholder: "Search for something",
    announcements: "Announcements",
    viewAllAnnouncements: "View All Announcements",
    serviceRequests: "Service Requests",
    viewAllServiceRequests: "View All Service Requests",
    schedule: "My Schedule",
  },
  students: {
    title: "Students",
    noStudents: "No students",
    registerStudent: "Register Student",
  },
  registerStudent: {
    title: "Register Student",
    manual: {
      title: "Manual Student Registration",
    },
    upload: {
      title: "Register Students from Excel File",
      uploadExcelFile: "Upload File",
      success: "File uploaded successfully",
      mapping: {
        title: "Map Columns",
        instructions:
          "Map the columns in the Excel file to the fields in the database",
        unset: "Select a field",
        success: {
          updateField: "Field mapping updated successfully",
          cancel: "Registration session cancelled successfully",
        },
        error: {
          missingColumns: "Please map all columns",
          updateFailed: "Failed to update field mapping",
          cancelFailed: "Failed to cancel registration session",
        },
      },
      commit: {
        title: "Commit Registration Session",
        success: "Registration session committed successfully",
        error: {
          commitFailed: "Failed to commit registration session",
          row: "Failed to commit row {rowNumber}",
        },
      },
    },
  },
  courses: {
    title: "Courses",
  },
  myCourses: {
    title: "My Courses",
    noCourses: "No courses",
  },
  evaluation: {
    selectRating: "Select Rating",
  },
  announcements: {
    title: "Announcements",
    noAnnouncements: "No announcements",
    create: {
      title: "Create Announcement",
      form: {
        title: "Title",
        content: "Content",
        severity: "Severity",
        info: "Info",
        warning: "Warning",
        danger: "Danger",
      },
      success: "Announcement created successfully",
      error: {
        createFailed: "Failed to create announcement",
      },
    },
  },
  serviceRequests: {
    title: "Service Requests",
    noServiceRequests: "No service requests",
    createServiceRequest: "Create Service Request",
  },
  profile: {
    title: "Profile",
  },
  bylaw: {
    title: "Bylaws",
    create: {
      title: "Create Bylaw",
      form: {
        title: "Title",
        content: "Content",
        required: "Indicate a required field",
        name: "Bylaw Name",
        gpaScale: "GPA Scale",
        useDetailedHours: "Use Detailed Hours",
        useDetailedGraduationProjectHours:
          "Use Detailed Graduation Project Hours",
        yearApplied: "Year Applied",
        gradeWeights: "Grade Weights",
        gradeWeight: "Grade Weight",
        minPercentage: "Minimum Percentage",
        maxPercentage: "Maximum Percentage",
        remove: "Remove",
        addGradeWeight: "Add Grade Weight",
        levelRequirements: "Level Requirements",
        mandatoryHours: "Mandatory Hours",
        electiveHours: "Elective Hours",
        totalHours: "Total Hours",
        maxYears: "Max Years",
        addLevelRequirements: "Add Level Requirements",
        graduationProjectRequirements: "Graduation Project Requirements",
        selectDepartmentCode: "Select Department Code",
        addGraduationProjectRequirements: "Add Graduation Project Requirements",
        graduationRequirement: "Graduation Requirement",
        graduationRequirementDescription:
          "Graduation requirement is the minimum credit hours required to graduate.",
        coursePassCriteria: "Course Pass Criteria",
        coursePassCriteriaDescription:
          "Course pass criteria is the minimum grade required to pass a course.",
        submit: "Submit",
        submitting: "Submitting...",
      },
      success: "Bylaw created successfully",
      error: {
        createFailed: "Failed to create bylaw",
      },
    },
  },
} as const;
