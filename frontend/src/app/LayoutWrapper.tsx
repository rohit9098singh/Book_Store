"use client"
import BookLoader from "@/lib/BookLoader";
import { persistor, store } from "@/store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast"
import AuthCheck from "@/store/Provider/AuthProvider";
import Header from "./component/Header/Header";
import { usePathname } from "next/navigation";
import Footer from "./component/Footer/Footer";
const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  // const pathname = usePathname();
  // const isAdminRoute=pathname.startsWith("/admin");
  return (
    <Provider store={store}>
      <PersistGate loading={<BookLoader />} persistor={persistor}>
        <Toaster />
        <AuthCheck>
          <Header />
          {children}
          <Footer />
        </AuthCheck>
      </PersistGate>
    </Provider>
  )

};

export default LayoutWrapper;
