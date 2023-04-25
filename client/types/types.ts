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
  id: string,
  catalog: string;
};