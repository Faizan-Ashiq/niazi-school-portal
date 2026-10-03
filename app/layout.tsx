import "./globals.css";

export const metadata = {
  title: "NIAZI REHNUMA - School Portal",
  description: "25 Years of Academic Excellence · School Management & Academic Portal",
  icons: {
    icon: "/logo.jpeg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-indigo-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
