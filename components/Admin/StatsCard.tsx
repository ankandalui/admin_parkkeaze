import { Card } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
}

export function StatsCard({ title, value }: StatsCardProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </Card>
  );
}
