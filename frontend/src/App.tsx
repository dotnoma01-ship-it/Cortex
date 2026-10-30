import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { StoreProvider, useStore } from "@/context/Store";
import { cn } from "@/utils/cn";
import { Header, MobileMenu } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Overlays } from "@/components/Overlays";
import Home from "@/pages/Home";
import AdminApp from "@/admin/Admin";
import { CheckoutPage, CollectionPage, MarbleProductsPage, ProductPage, SearchPage } from "@/pages/Shop";
import {
  AboutPage,
  AccountPage,
  BlogPage,
  CollectionsIndex,
  ComparePage,
  ContactPage,
  FaqPage,
  FeaturesPage,
  NotFound,
  PoliciesPage,
  PostPage,
  QuickOrderPage,
  StoresPage,
  WishlistPage,
} from "@/pages/Info";

function Scroll() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Shell() {
  const { compare } = useStore();
  return (
    <div className={cn("min-h-screen overflow-x-hidden bg-white text-[#111]", compare.length > 0 && "pb-24")}>
      <Scroll />
      <Header />
      <MobileMenu />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections/:handle" element={<CollectionPage />} />
          <Route path="/pages/marble-products" element={<MarbleProductsPage />} />
          <Route path="/products/:handle" element={<ProductPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/pages/about" element={<AboutPage />} />
          <Route path="/pages/contact" element={<ContactPage />} />
          <Route path="/pages/faqs" element={<FaqPage />} />
          <Route path="/pages/find-a-store" element={<StoresPage />} />
          <Route path="/pages/blog" element={<BlogPage />} />
          <Route path="/pages/blog/:slug" element={<PostPage />} />
          <Route path="/pages/theme-features" element={<FeaturesPage />} />
          <Route path="/pages/compare" element={<ComparePage />} />
          <Route path="/pages/wishlist" element={<WishlistPage />} />
          <Route path="/pages/policies" element={<PoliciesPage />} />
          <Route path="/pages/quick-order" element={<QuickOrderPage />} />
          <Route path="/pages/collections" element={<CollectionsIndex />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Overlays />
    </div>
  );
}

function RouteSurface() {
  const { pathname } = useLocation();
  return pathname.startsWith("/admin") ? <AdminApp /> : <Shell />;
}

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <RouteSurface />
      </HashRouter>
    </StoreProvider>
  );
}
