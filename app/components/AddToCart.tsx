"use client";

import { Product } from "@/lib/api";
import { Button } from "./ui/button";
import { addToCartAtom } from "@/store/cart";
import { useSetAtom } from "jotai";

interface AddToCartProps {
  product: Product;
  title: string | React.ReactNode;
}

const AddToCart = ({ product, title }: AddToCartProps) => {
  const addToCart = useSetAtom(addToCartAtom);
  return (
    <Button
      size="lg"
      onClick={() =>
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          discount: product.discount || 0,
          image: product.images?.[0]?.url,
          availableStock: 1,
        })
      }
    >
      {title}
    </Button>
  );
};

export default AddToCart;
