import { auth } from "../firebase";

export type FormUser = {
  name: string;
  password: string;
  email: string;
  photoURL: string;
};

type currentUser = typeof auth.currentUser;

type Review = {
  author: string;
  content: string;
};

export type Guest = {
  photoURL: string;
  displayName: string;
  basket: Record<string, any>;
};

export type User = {
  photoURL: string;
  basket: Record<string, any>;
  reviews: Review[];
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
  _id?: string
};

export type Phone = {
  id: string;
  model: string;
  current_bundle: {
    memory: number;
    price: string;
  };
  bundle: {
    memory: number;
    price: string;
  }[];
  reviews: {
    author: string;
    content: string;
  }[];
  current_type: {
    color: string;
    images: string[];
  };
  types: {
    color: string;
    images: string[];
  }[];
  screen_type: string;
  RAM: string;
  CPU: string;
  battery_capacity: string;
  description: string;
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
  current_type: {
    images: string[];
  };
  colors: Record<string, string[]>;
  current_bundle: {
    size: number;
    price: string;
  };
  bundles: {
    size: number;
    price: string;
  }[];
  autonomy: number;
  energy_saving: number;
  material: string;
  screen: string;
  memory: number;
};

export type Product = Phone | Clock | Charger;
