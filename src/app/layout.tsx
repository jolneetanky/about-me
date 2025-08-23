import "@mantine/core/styles.css";
import "./globals.css";
import { Roboto_Mono } from "next/font/google";
import { Group, Anchor, Container, Box, createTheme } from "@mantine/core";

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

const theme = createTheme({
  fontFamily: '"Roboto Mono", sans-serif', // Set default font family
  fontFamilyMonospace: '"Roboto Mono", monospace', // Set monospace font family
  headings: {
    fontFamily: '"Roboto Mono", ${DEFAULT_THEME.fontFamily}', // Optionally set heading font
  },
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
        <MantineProvider theme={theme}>
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
            {/* <Container size="md" style={{ height: "100%", display: "flex" }}> */}
            {children}
            {/* </Container> */}
          </Box>
        </MantineProvider>
      </body>
    </html>
  );
}
