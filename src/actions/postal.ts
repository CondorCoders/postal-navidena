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

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    if (!text) {
      throw new Error("Empty response from API");
    }

    const slug = JSON.parse(text);
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

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    if (!text) {
      throw new Error("Empty response from API");
    }

    const postal = JSON.parse(text);
    return postal;
  } catch (error) {
    console.error("Error while fetching postal data from API:", error);
    throw error;
  }
};
