import { Card } from "@/components/ui/card";
import { BarChart } from "recharts";

export function Overview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          {/* Add your recent activity content */}
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Statistics</h3>
          {/* Add your statistics chart */}
        </Card>
      </div>
    </div>
  );
}
