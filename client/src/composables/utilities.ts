import { User } from "../../types/types";

export function useUserUtilities() {
  function isUser(user: unknown): user is User {
    if (typeof user !== "object" || user === null) {
      return false;
    }

    const { emailVerified } = user as Partial<User>;

    return typeof emailVerified === "boolean";
  }

  return {
    isUser,
  };
}
