"use client";

import { Product } from "@/lib/api";
import { Button } from "./ui/button";
import { addToCartAtom } from "@/store/cart";
import { useSetAtom } from "jotai";

interface AddToCartProps {
  product: Product;
  title: string | React.ReactNode;
  className?: string;
}

const AddToCart = ({ product, title, className }: AddToCartProps) => {
  const addToCart = useSetAtom(addToCartAtom);
  return (
    <Button size="lg" onClick={() => addToCart(product)} className={className}>
      {title}
    </Button>
  );
};

export default AddToCart;
