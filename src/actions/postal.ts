"use server";

import { Postal } from "@/types/postal.types";

export const createPostal = async (
  data: FormData
): Promise<Pick<Postal, "slug">> => {
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

export const getPostalBySlug = async (slug: string): Promise<Postal | null> => {
  try {
    const response = await fetch(`${process.env.POSTAL_API}/${slug}`, {
      method: "GET",
    });

    if (response.status === 404) {
      return null;
    }

    const postal = await response.json();
    return postal;
  } catch (error) {
    console.error("Error while fetching postal data from API:", error);
    throw error;
  }
};
