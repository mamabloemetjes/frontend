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
    <Button size="lg" onClick={() => addToCart(product)}>
      {title}
    </Button>
  );
};

export default AddToCart;
