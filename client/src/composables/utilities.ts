import { User, DropdownFilterType, Phone, Clock, Charger } from "../../types/types";

export function useUserUtilities() {
  type findTreeLinkAndDepthType = {
    depth: number,
    item: DropdownFilterType
  }

  const getImageUrl = (name: string) => {
    return new URL(name, import.meta.url).href;
  };

  function isUser(user: unknown): user is User {
    if (typeof user !== "object" || user === null) {
      return false;
    }

    const { emailVerified } = user as Partial<User>;

    return typeof emailVerified === "boolean";
  }
  
  function isHasDepth(value: unknown): value is findTreeLinkAndDepthType {
    return typeof value === 'object' && value !== null && 'depth' in value && 'item' in value && typeof (value as any).depth === 'number';
  }

  function isPhone(value: unknown): value is Phone {
    return value && typeof value === 'object' && 'current_bundle' in value
  }


  
function findTreeLinkAndDepth(
  id: string,
  items: DropdownFilterType[],
  depth: number = 1
): { depth: number, item: DropdownFilterType} | number {
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    if (item.id === id) {
      return { depth, item };
    } else {
      let result = findTreeLinkAndDepth(id, item.children, depth + 1);
      if (result !== -1) {
        return result;
      }
    }
  }
  return -1; // if value not found
}

  return {
    isUser,
    findTreeLinkAndDepth,
    isHasDepth,
    getImageUrl
  };
}


