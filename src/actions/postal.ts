"use server";

import { Postal } from "@/types/postal.types";

export const createPostal = async (
  data: FormData
): Promise<Pick<Postal, "slug">> => {
  console.log("Sending postal data to API...", data);
  try {
    const response = await fetch(process.env.POSTAL_API!, {
      method: "POST",
      body: data,
    });

    const slug = await response.json();
    return slug;
  } catch (error) {
    console.error("Error while sending postal data to API:", error);
    throw error;
  }
};
