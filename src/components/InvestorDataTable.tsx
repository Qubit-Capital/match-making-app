import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface InvestorData {
  _id: string;
  website: string;
  investor_type: string;
  hq_location: string;
  total_investments: number;
  preferred_vertical: string[];
  preferred_industry: string[];
}

interface InvestorDataTableProps {
  data: InvestorData[];
}

export function InvestorDataTable({ data }: InvestorDataTableProps) {
  const [filter, setFilter] = React.useState("");

  const filteredData = data.filter(investor =>
    investor.website.toLowerCase().includes(filter.toLowerCase()) ||
    investor.investor_type.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Input
        placeholder="Filter investors..."
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
        className="max-w-sm"
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Website</TableHead>
              <TableHead>Investor Type</TableHead>
              <TableHead>HQ Location</TableHead>
              <TableHead>Total Investments</TableHead>
              <TableHead>Preferred Verticals</TableHead>
              <TableHead>Preferred Industries</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((investor) => (
              <TableRow key={investor._id}>
                <TableCell className="font-medium">{investor.website}</TableCell>
                <TableCell>{investor.investor_type}</TableCell>
                <TableCell>{investor.hq_location}</TableCell>
                <TableCell>{investor.total_investments}</TableCell>
                <TableCell>{investor.preferred_vertical.join(", ")}</TableCell>
                <TableCell>{investor.preferred_industry.join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="text-sm text-muted-foreground">
        Showing {filteredData.length} of {data.length} investors
      </div>
    </div>
  );
}