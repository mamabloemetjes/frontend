"use server";

import { revalidatePath as invalidatePath, revalidateTag } from "next/cache";

export async function revalidatePaths(paths: string[]): Promise<boolean> {
  paths.forEach((path) => invalidatePath(path));
  return true;
}

export async function revalidateProductTag(tag: string): Promise<boolean> {
  revalidateTag(tag, "max");
  return true;
}
