import "@mantine/core/styles.css";
import "./globals.css";
import { Roboto_Mono } from "next/font/google";
import { Group, Anchor, Container, Box } from "@mantine/core";

import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import { Navbar } from "./components/Navbar";

export const metadata = {
  title: "My Mantine app",
  description: "I have followed setup instructions carefully",
};

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body
        className={robotoMono.className}
        style={{
          margin: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MantineProvider>
          {/* Navbar stays at the top */}
          <Navbar />

          {/* Children are centered in remaining space */}
          <Box
            style={{
              flex: 1, // take remaining height after navbar
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Container size="md">{children}</Container>
          </Box>
        </MantineProvider>
      </body>
    </html>
  );
}
