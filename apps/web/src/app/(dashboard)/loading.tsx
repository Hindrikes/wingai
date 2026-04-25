export default function DashboardLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-pulse">
      <div className="h-8 bg-wing-100 rounded-lg w-48" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-wing-100 rounded-2xl" />
        ))}
      </div>
      <div className="h-64 bg-wing-100 rounded-2xl" />
      <div className="h-48 bg-wing-100 rounded-2xl" />
    </div>
  );
}
