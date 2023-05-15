import { defineStore } from "pinia";
import { auth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { FormUser, LoginUser, Product } from "../../types/types";
import { User, Guest } from "../../types/types";
import router from "../router/index";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state() {
    return {
      user:
        JSON.parse(sessionStorage.getItem("user") as string) ||
        ({
          displayName: "Гость",
          cart: [],
          photoURL:
            "https://thinksport.com.au/wp-content/uploads/2020/01/avatar-.jpg",
        } as User | Guest),
    };
  },
  actions: {
    async registerUser(user: FormUser) {
      const { password, email, name, photoURL } = user;
      const currentUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(currentUser.user, {
        displayName: name,
      });

      this.user = {
        ...auth.currentUser,
        photoURL: photoURL,
        cart: [],
        reviews: [],
      } as User;
      router.push("/");
      sessionStorage.setItem("user", JSON.stringify(this.user));
      await fetch("http://localhost:5000/save-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.user),
      });
    },
    continueWithGuest() {
      const guest: Guest = {
        displayName: "Гость",
        cart: [],
        photoURL:
          "https://thinksport.com.au/wp-content/uploads/2020/01/avatar-.jpg",
      };

      this.user = guest;
    },
    async loginUser(user: LoginUser) {
      try {
        const { password, email } = user;
        await signInWithEmailAndPassword(auth, email, password);
        const response = await fetch(`http://localhost:5000/user/${email}`);
        const a = await response.json();
        this.user = structuredClone(a);
        sessionStorage.setItem("user", JSON.stringify(this.user));
        localStorage.setItem("user", JSON.stringify(this.user));
        router.push("/");
      } catch (e) {
        function isFirebaseError(error: any): error is { code: string } {
          return error && typeof error.code === "string";
        }
        if (isFirebaseError(e)) {
          switch (e.code) {
            case "auth/user-not-found":
              throw new Error("Пользователь не найден");
            case "auth/wrong-password":
              throw new Error("Неверный пароль");
            default:
              throw new Error("Непредвиденная ошибка");
          }
        } else {
          throw new Error("An unknown error occurred.");
        }
      }
    },
    async logoutUser() {
      await signOut(auth);
      sessionStorage.removeItem("user");
      this.user = {
        displayName: "Гость",
        basket: [],
        photoURL:
          "https://thinksport.com.au/wp-content/uploads/2020/01/avatar-.jpg",
      };
      router.push("/signin");
    },
    async addToCart(product: Product) {
      const cartedProduct = {
        ...product,
        amount: 1,
      };
      if (this.user.email) {
        console.log("sending response");
        const response = await axios.post(
          `http://localhost:5000/save-to-cart/${this.user.uid}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(cartedProduct),
          }
        );
      } else {
        this.user.cart.push(product);
      }
    },
    async updateUser() {
      const { data: updatedUser } = await axios.get(
        `http://localhost:5000/find-user/${this.user.uid}`
      );
      this.user = updatedUser;
      sessionStorage.setItem("user", JSON.stringify(this.user));
    },
  },
  getters: {},
});
