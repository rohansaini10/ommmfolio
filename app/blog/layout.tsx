import "./blog-code.css";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full min-h-screen bg-white">
      {children}
    </div>
  );
}