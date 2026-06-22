export const metadata = {
  title: "LeavePayroll",
  description: "LeavePayroll admin UI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
