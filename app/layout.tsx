import { ModalProvider } from "@/components/modal/ModalContext";
import "@/style/globals.scss";
import Head from "next/head";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <body>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />

        <ModalProvider>{children}</ModalProvider>
      </body>
    </html>
  );
}
