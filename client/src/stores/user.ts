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
import { useHttpRequests } from "../composables/httpRequests";
import { BlockquoteHTMLAttributes } from "vue";

export const useUserStore = defineStore("user", {
  state() {
    return {
      user:
        JSON.parse(sessionStorage.getItem("user") as string) ||
        ({
          displayName: "Гость",
          cart: JSON.parse(sessionStorage.getItem('guest_cart' || null) as string) || [],
          photoURL: 
            "https://thinksport.com.au/wp-content/uploads/2020/01/avatar-.jpg",
        } as User | Guest),
      http: useHttpRequests('_'),
      checkedProducts: JSON.parse(sessionStorage.getItem('checkedProducts') as string) ||  [] as (Product & { amount: number})[]
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
        checked: false
      };
      if (this.user.email) {
        const response = await axios.post(
          `http://localhost:5000/save-to-cart/${this.user.uid}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(cartedProduct),
          }
        );
        this.updateUser()
      } else {
        const { images, model, price } = product
        const exist = this.user.cart.findIndex((item: Product, index: number) =>  {
          if(item.model === model && item.images[0] === images[0] && item.price === price){
            return true
          }

        }
          )
          if(exist !== -1){
            if(this.user.cart[exist].amount === 5){
              return
            }
            this.user.cart = this.user.cart.map((item: Product & { amount: number }, idx: number) => {
              if(idx === exist){
                return {
                  ...item,
                  amount: item.amount + 1
                }
              }else{
                return item
              }
            })
          sessionStorage.setItem('guest_cart', JSON.stringify(this.user.cart))
          }else{
          this.user.cart.push(cartedProduct)
          sessionStorage.setItem('guest_cart', JSON.stringify(this.user.cart))
        }
      }

    },
    async removeFromCart(product: Product){
      const { price, model, images } = product
      if (this.user.email) {
        await axios.delete(
          `http://localhost:5000/remove-from-cart/${this.user.uid}`, {
            params: {
              price: product.price,
              model: product.model,
              image: product.images[0]
            }
          }
        );
        this.updateUser()
      } else {
        this.user.cart = this.user.cart.filter((product: Product) => product.images[0] !== images[0] || product.price !== price)
       sessionStorage.setItem('guest_cart', JSON.stringify(this.user.cart))
      }
    },
    changeCart(cart: (Product & {amount: number, checked: boolean})[
      ]){
        this.user.cart = cart
    },
    async incrementProductAmount(product: Product){
      const { changeProductAmount } = this.http
      changeProductAmount(product, this.updateUser, this.user)
    },
    async decrementProductAmount(product: Product){
      const { changeProductAmount } = this.http
      changeProductAmount(product, this.updateUser, this.user, false)
    },
    async updateUser() {
      const { data: updatedUser } = await axios.get(
        `http://localhost:5000/find-user/${this.user.uid}`
      );
      console.log(updatedUser)

      this.user = updatedUser;
      sessionStorage.setItem("user", JSON.stringify(this.user));
    },
  },
  getters: {},
});
