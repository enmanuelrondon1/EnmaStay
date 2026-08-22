// app/(main)/layout.tsx
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}