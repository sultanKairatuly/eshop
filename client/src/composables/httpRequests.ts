import { reactive } from "vue";
import { Product, Category } from "../../types/types";
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

  return {
    fetchCatalog,
    category,
  };
};
