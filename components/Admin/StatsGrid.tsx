import { StatsCard } from "./StatsCard";

export function StatsGrid() {
  const stats = [
    { title: "Total Users", value: "1,234" },
    { title: "Available Spaces", value: "45/100" },
    { title: "Today's Revenue", value: "$2,567" },
    { title: "Active Bookings", value: "89" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
