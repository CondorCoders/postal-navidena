import { getPostalBySlug } from "@/actions/postal";
import { PostalViewer } from "@/components/postal-viewer/postal-viewer";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const postal = await getPostalBySlug(slug);

  if (!postal) {
    return {
      title: "Postal Navideña",
      description: "¡Tienes correo! Alguien te ha enviado una postal navideña.",
    };
  }

  const title = `¡Tienes correo! ${postal.fromName} te ha enviado una postal navideña.`;
  const description = "Descubre el mensaje que tiene para ti.";
  const imageUrl = postal.imageUrl;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

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
