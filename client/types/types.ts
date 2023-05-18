import type { Component } from "vue";
import { auth } from "../firebase";

export type FormUser = {
  name: string;
  password: string;
  email: string;
  photoURL: string;
};

type currentUser = typeof auth.currentUser;

export type Review = {
  author: string;
  message: string;
  createdAt: number;
  rate: number;
  id: string;
};

export type Guest = {
  photoURL: string;
  displayName: string;
  cart: Cart;
};

export type User = {
  photoURL: string;
  cart: Cart;
  reviews: Review[];
  email: string,
  uid: string
} & currentUser;

export type LoginUser = {
  password: string;
  email: string;
};

export type DropdownFilterType = {
  value: string;
  opened: boolean;
  children: DropdownFilterType[];
  id: string;
  category: string;
};

export type FilterType = "default" | "range";

export type EmittedFilterType = {
  property: string;
  values: string[];
  empty: boolean;
  type: FilterType;
};

export type totalFilterItemType =
  | {
      values: string[];
      type: FilterType;
    }
  | boolean;

export type FilterBooleanOff = Exclude<totalFilterItemType, boolean>;
// export type Category = Omit<DropdownFilterType, 'opened'>

export type CategoryExplorerType = {
  name: string;
  children: CategoryExplorerType[];
  id: string;
  category: string;
  value?: string;
};

export type Filter = {
  value: string;
  title: { ru: string; kz: string };
  values: { value: string; title: string; checked: boolean }[];
  type: "default" | "range";
};

export type Category = {
  category: string;
  products: Product[];
  filters?: Filter[];
  _id?: string;
};

export type ProductParametersType = {
  title: {
    ru: string;
    kz: string;
  };
  type: string;
  properties: string[];
  values: Record<string, any>;
};

export type Phone = {
  id: string;
  model: string;
  price: string;
  memory: string;
  images: string[];
  reviews: {
    author: string;
    content: string;
  }[];
  parameters: ProductParametersType[];
  screen_type: string;
  RAM: string;
  CPU: string;
  battery_capacity: string;
};

export type Charger = {
  id: string;
  model: string;
  price: string;
  type: string;
  fast_charge: boolean;
  connector_type: string;
  images: string[];
};

export type ProductType = {
  color: string;
  images: string[];
};

export type Bundle =
  | {
      memory: number;
      price: string;
    }
  | {
      size: number;
      price: string;
    };

export type Clock = {
  id: string;
  model: string;
  color: string;
  size: number;
  price: string;
  images: string[];
  autonomy: number;
  energy_saving: number;
  material: string;
  screen: string;
  memory: number;
};

export type Cart = (Product & { amount: number })[];

export type Product = (Phone | Clock | Charger) & { category: string };
