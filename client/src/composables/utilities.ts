import {
  User,
  DropdownFilterType,
  Phone,
  Clock,
  Charger,
  Bundle,
  ProductType,
  Category,
} from "../../types/types";

export function useUserUtilities() {
  type findTreeLinkAndDepthType = {
    depth: number;
    item: DropdownFilterType;
  };

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
    return (
      typeof value === "object" &&
      value !== null &&
      "depth" in value &&
      "item" in value &&
      typeof (value as any).depth === "number"
    );
  }

  function isHasBundle(value: unknown): value is { current_bundle: Bundle } {
    return (
      value !== null &&
      typeof value === "object" &&
      "current_bundle" in value &&
      typeof (value as any).current_bundle === "object"
    );
  }

  function isHasImages(value: unknown): value is { images: string[] } {
    return (
      value !== null &&
      typeof value === "object" &&
      "images" in value &&
      typeof (value as any).images === "object"
    );
  }

  function isHasCurrentType(
    value: unknown
  ): value is { current_type: ProductType } {
    return (
      value !== null &&
      typeof value === "object" &&
      "current_type" in value &&
      typeof (value as any).current_type === "object"
    );
  }

  function isCategory(value: unknown): value is Category {
    return (
      value !== null &&
      typeof value === "object" &&
      "category" in value &&
      "children" in value &&
      "id" in value &&
      "name" in value
    );
  }

  function findTreeLinkAndDepth(
    id: string,
    items: DropdownFilterType[],
    depth: number = 1,
    category?: string
  ): { depth: number; item: DropdownFilterType } | number {
    if (category) {
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (item.category === category) {
          return { depth, item };
        } else {
          item.opened = true;
          let result = findTreeLinkAndDepth(
            id,
            item.children,
            depth + 1,
            category
          );
          if (result !== -1) {
            return result;
          }
        }
      }
      return -1; // if value not found
    } else {
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
  }

  return {
    isUser,
    findTreeLinkAndDepth,
    isHasDepth,
    getImageUrl,
    isHasBundle,
    isHasImages,
    isHasCurrentType,
    isCategory,
  };
}
