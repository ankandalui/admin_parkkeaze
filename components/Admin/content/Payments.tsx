import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

export function Payments() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Transaction ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>{/* Add your payment rows */}</TableBody>
        </Table>
      </Card>
    </div>
  );
}
