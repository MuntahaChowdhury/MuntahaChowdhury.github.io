/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/button";
import { Card } from "@/components/shared/card";
import { Carousel, CarouselItem } from "@/components/shared/carousel";
import { Star } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  category: string;
  image: string;
}

export default function Bsell() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = `/jds/hp/bsellprod.json`; // Relative URL (no window.location.origin needed)
        console.log("Fetching from:", url);

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        console.log("Fetched data:", data);

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          throw new Error("Invalid JSON format");
        }
      } catch (err: any) {
        console.error("Error loading products:", err.message);
        setError("Failed to load products. Please check the console for details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-4">🔥 Bestselling Products</h2>

      {loading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : products.length > 0 ? (
        <div className="overflow-x-auto flex-nowrap">
          <Carousel className="w-full flex space-x-4">
            {products.map((product) => (
              <CarouselItem key={product.id} className="w-[250px]">
                <Card className="shadow-lg rounded-lg overflow-hidden">
                  <div className="p-0">
                    <Image
                      src={`https://ridbizecom.s3.ap-southeast-1.amazonaws.com/buyerpanda.com/hp/${product.image}`}
                      alt={product.name}
                      width={250}
                      height={250}
                      className="w-full h-40 object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h3
                      className="text-lg font-semibold cursor-pointer hover:underline"
                      onClick={() => router.push(`/product/${product.id}`)}
                    >
                      {product.name}
                    </h3>
                    <p className="text-green-600 font-bold">${product.price}</p>
                    <div className="flex items-center text-yellow-500">
                      {[...Array(Math.floor(product.rating))].map((_, i) => (
                        <Star key={i} size={16} />
                      ))}
                    </div>
                    <p
                      className="text-sm text-gray-500 cursor-pointer hover:underline"
                      onClick={() => router.push(`/category/${product.category}`)}
                    >
                      {product.category}
                    </p>
                  </div>
                  <div className="p-4">
                    <Button
                      className="w-full"
                      onClick={() => alert(`Added ${product.name} to cart!`)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </Carousel>
        </div>
      ) : (
        <p className="text-gray-500">No bestselling products available.</p>
      )}
    </section>
  );
}
