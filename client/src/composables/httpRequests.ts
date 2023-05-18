import { reactive } from "vue";
import { Product, Category, Guest, User } from "../../types/types";
import axios from "axios";

export const useHttpRequests = (categoryName: string) => {
  const category: Category[] = reactive([]);

  async function fetchCatalog() {
    const response = await axios.get<
      { category: string; products: Product[] }[]
    >(`http://localhost:5000/c/${categoryName}`);
    category.splice(0);
    category.push(...response.data);
  }

  async function changeProductAmount(product: Product, updateUser: () => void, user: User | Guest, increment = true){
    const changeCartContent = () => {
      console.log('dawdadw')
      user.cart = user.cart.map((item: Product & { amount: number }) => {
        if(product.price === product.price && item.images[0] === product.images[0] ){
          return {
            ...item,
            amount: increment ? item.amount + 1 : item.amount - 1
          }
        }else{
          return item
        }
       })
    }

    if ('email' in user) {
      const response = await axios.post(`http://localhost:5000/change-product-amount`, {
        body: {
          price: product.price,
          model: product.model,
          image: product.images[0],
          userId: user.uid,
          increment
        }
      })
      updateUser()
    } else {
      changeCartContent()
    }
  }

  return {
    fetchCatalog,
    category,
    changeProductAmount
  };
};
