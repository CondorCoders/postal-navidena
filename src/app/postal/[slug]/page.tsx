import { getPostalBySlug } from "@/actions/postal";
import { PostalViewer } from "@/components/postal-viewer/postal-viewer";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Postal Navideña",
  description: "¡Tienes correo! Alguien te ha enviado una postal navideña.",
};

export default async function PostalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const postal = await getPostalBySlug(slug);

  if (!postal) {
    redirect("/");
  }

  return <PostalViewer postal={postal!} />;
}
