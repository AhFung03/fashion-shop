import { ProductDetail } from "@/components/product-detail";
import { products } from "@/data/products";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((candidate) => candidate.slug === slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
