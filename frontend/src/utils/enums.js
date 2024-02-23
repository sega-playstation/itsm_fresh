/**
 * User roles within the application.
 * Warning: The server-side implmentation as of 2023-12-08 is not an enum.
 */
export const UserRole = Object.freeze({
  /** @deprecated */
  DUMMY: 5,
  /** Student. */
  STUDENT: 4,
  /** @deprecated */
  TECHNICIAN: 2,
  /** Instructor. */
  INSTRUCTOR: 3,
  /** Administrator. */
  ADMIN: 1,
});

/**
 * Asset statuses.
 */
export const AssetStatus = Object.freeze({
  /* None. */
  NONE: 0,
  /* In use. */
  IN_USE: 1,
  /* In maintenance. */
  IN_MAINTENANCE: 2,
  /* In inventory. */
  IN_INVENTORY: 3,
  /* Unassigned. */
  UNASSIGNED: 4,
});

/**
 * Asset categories.
 */
export const AssetCategory = Object.freeze({
  /* None. */
  NONE: 'NONE',
  /* Hardware. */
  HARDWARE: 'HARDWARE',
  /* Software. */
  SOFTWARE: 'SOFTWARE',
  /* Other. */
  OTHER: 'OTHER',
});

/**
 * Change Request Types.
 */
export const RequestType = Object.freeze({
  STANDARD: "Standard",
  NORMAL: "Normal",
  MAJOR: "Major",
  EMERGENCY: "Emergency",
  LATENT: "Latent",
});

/**
 * Change History Options.
 */
export const ChangeHistory = Object.freeze({
  NOTBEFORE: "Change has not been completed before",
  FAILED: "Previous change attempted, failed",
  ERRORS: "Previous change completed, with errors",
  SUCCESS: "Previous change completed successfully",
});

/**
 * Change Request Environments.
 */
export const Environment = Object.freeze({
  NOTBEFORE: "Information Only",
  FAILED: "Test",
  ERRORS: "Production",
});

/**
 * Documentation of Configuration States.
 */
export const DocumentationOfConfiguration = Object.freeze({
  COMPLETE: "Complete/Up to Date",
  INCOMPLETE: "Incomplete/Out of date",
  HALFLESSER: "Less than half complete",
  HALFGREATER: "More than half complete",
});

/**
 * Number of Employees Required for Install/Backout Plan.
 */
export const NumberOfEmployeesRequired = Object.freeze({
  STAFF: "1-3 staff members required",
  TEAM: "1 team required",
  TEAMS: "Multiple teams required",
});

/**
 * BackOut Plan Difficulty Levels.
 */
export const BackOutPlanDifficulty = Object.freeze({
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
});

/**
 * Duration Options for Business Plan.
 */
export const Duration = Object.freeze({
  ONEWEEK: "1 week",
  TWOWEEKS: "2 weeks",
  ONEMO: "1 months",
  THREEMO: "3 months",
  SIXMO: "6 months",
});
