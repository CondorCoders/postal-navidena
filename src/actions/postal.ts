"use server";

import { Postal } from "@/types/postal.types";

export const createPostal = async (
  data: FormData
): Promise<Pick<Postal, "slug">> => {
  const response = await fetch(process.env.POSTAL_API!, {
    method: "POST",
    body: data,
  });

  const slug = await response.json();

  return slug;
};
