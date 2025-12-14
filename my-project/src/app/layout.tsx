"use client"
import "./globals.css";


import { Provider } from "react-redux";
import { store } from "./components/store/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./components/lib/reactQuery";
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <Toaster position="top-right" reverseOrder={false} />

            {children}
          </Provider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
