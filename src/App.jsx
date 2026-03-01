import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import Header           from "./components/Header";
import Home             from "./pages/Home";
import Market           from "./pages/Market";
import LocationSelector from "./pages/LocationSelector";
import PricingPage      from "./pages/PricingPage";
import PaymentGateway   from "./pages/PaymentGateway";
import Profile          from "./pages/Profile";
import Products         from "./pages/Products";
import Contact          from "./pages/Contact";
import ActiveOrders     from "./pages/ActiveOrders";
import ProductQuote     from "./pages/ProductQuote";

const PT = ({ children }) => (
  <motion.div
    initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-16 }}
    transition={{ duration:0.42, ease:[0.22,1,0.36,1] }}>
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"                         element={<PT><Home /></PT>} />
        <Route path="/market"                   element={<PT><Market /></PT>} />
        <Route path="/products"                 element={<PT><Products /></PT>} />
        <Route path="/products/quote"           element={<PT><ProductQuote /></PT>} />
        <Route path="/profile"                  element={<PT><Profile /></PT>} />
        <Route path="/contact"                  element={<PT><Contact /></PT>} />
        <Route path="/active-orders"            element={<PT><ActiveOrders /></PT>} />
        <Route path="/trade/:type"              element={<PT><LocationSelector /></PT>} />
        <Route path="/trade/:type/pricing"      element={<PT><PricingPage /></PT>} />
        <Route path="/trade/:type/payment"      element={<PT><PaymentGateway /></PT>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <div id="cursor-dot" />
      <div id="cursor-custom" />
      <Header />
      <AnimatedRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
