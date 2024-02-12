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
