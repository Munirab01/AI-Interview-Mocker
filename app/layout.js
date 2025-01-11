import { Plus_Jakarta_Sans, Fira_Code } from "next/font/google"; // Trending fonts
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";

// Plus Jakarta Sans for sans-serif style
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"], // You can adjust the weights as needed
});

// Fira Code for monospace style
const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "AI Interview Mocker",
  description: "Enhance your interview preparation with AI-driven feedback and insights.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${plusJakartaSans.variable} ${firaCode.variable} antialiased`}
        >
          <Toaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
