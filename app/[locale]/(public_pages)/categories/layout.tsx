export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-l-m-t-body">
      <div className="page-wrapper">
        <div className="p-w-main page-container category-page-main">
          {children}
        </div>
      </div>
    </div>
  );
}
