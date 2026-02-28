import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PlanProvider } from "./hooks/usePlan";
import { LanguageProvider } from "./hooks/useLanguage";
import { ThemeProvider } from "./hooks/useTheme";
import { OnboardingProvider, useOnboarding } from "./hooks/useOnboarding";
import { StoreProvider } from "./hooks/useStores";
import Home from "./pages/Home";
import Index from "./pages/Index";
import AddProduct from "./pages/AddProduct";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Coupons from "./pages/Coupons";
import Stores from "./pages/Stores";
import Team from "./pages/Team";
import Templates from "./pages/Templates";
import Delivery from "./pages/Delivery";
import Tracking from "./pages/Tracking";
import Stats from "./pages/Stats";
import Profile from "./pages/Profile";
import More from "./pages/More";
import Plans from "./pages/Plans";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import BottomBar from "./components/BottomBar";
import { useInventory } from "./hooks/useInventory";

const queryClient = new QueryClient();

const AddProductWrapper = () => {
  const { addProduct, categories, addCategory } = useInventory();
  return <AddProduct categories={categories} onAdd={addProduct} onAddCategory={addCategory} />;
};

const AppRoutes = () => {
  const { isOnboarded } = useOnboarding();

  if (!isOnboarded) {
    return (
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={<Index />} />
        <Route path="/add" element={<AddProductWrapper />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/coupons" element={<Coupons />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/team" element={<Team />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/more" element={<More />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/register" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomBar />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PlanProvider>
      <ThemeProvider>
      <LanguageProvider>
      <OnboardingProvider>
      <StoreProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </StoreProvider>
      </OnboardingProvider>
      </LanguageProvider>
      </ThemeProvider>
      </PlanProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
