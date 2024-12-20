"use client";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react"; // Add this import

// Create a loading component
const LoadingState = () => (
  <div className="h-screen w-full flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Create the client-side only wrapper
const CheckoutPageClient = dynamic(() => import("./_components/checkout"), {
  ssr: false,
  loading: () => <LoadingState />,
});

// Main component becomes very simple
export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
