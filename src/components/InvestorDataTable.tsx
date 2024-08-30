import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

interface InvestorData {
  _id: string;
  website: string;
  investor_type: string;
  hq_location: string;
  total_investments: number;
  investmentCounts: Record<string, number>;
}

interface InvestorDataTableProps {
  data: InvestorData[];
}

export function InvestorDataTable({ data }: InvestorDataTableProps) {
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const allInvestmentCountKeys = useMemo(() => {
    const keySet = new Set<string>();
    data.forEach(investor => {
      Object.keys(investor.investmentCounts).forEach(key => keySet.add(key));
    });
    return Array.from(keySet);
  }, [data]);

  const filteredData = data.filter(investor =>
    investor.website.toLowerCase().includes(filter.toLowerCase()) ||
    investor.investor_type.toLowerCase().includes(filter.toLowerCase())
  );

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleRowSelection = (id: string) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map(investor => investor._id));
    }
  };

  const copySelectedData = () => {
    const selectedData = filteredData.filter(investor => selectedRows.includes(investor._id));
    const csvContent = [
      ["Website", "Investor Type", "HQ Location", "Total Investments", ...allInvestmentCountKeys].join(","),
      ...selectedData.map(investor => [
        investor.website,
        investor.investor_type,
        investor.hq_location,
        investor.total_investments,
        ...allInvestmentCountKeys.map(key => investor.investmentCounts[key] || "")
      ].join(","))
    ].join("\n");

    navigator.clipboard.writeText(csvContent);
    toast({
      title: "Copied to clipboard",
      description: `${selectedData.length} investor${selectedData.length !== 1 ? 's' : ''} copied.`
    });
  };

  const downloadSelectedData = () => {
    const selectedData = filteredData.filter(investor => selectedRows.includes(investor._id));
    const csvContent = [
      ["Website", "Investor Type", "HQ Location", "Total Investments", ...allInvestmentCountKeys].join(","),
      ...selectedData.map(investor => [
        investor.website,
        investor.investor_type,
        investor.hq_location,
        investor.total_investments,
        ...allInvestmentCountKeys.map(key => investor.investmentCounts[key] || "")
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "investor_data.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(pageCount, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    buttons.push(
      <Button
        key="prev"
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
    );

    if (start > 1) {
      buttons.push(
        <Button key="ellipsis-start" variant="outline" size="sm" disabled>
          ...
        </Button>
      );
    }

    for (let i = start; i <= end; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Button>
      );
    }

    if (end < pageCount) {
      buttons.push(
        <Button key="ellipsis-end" variant="outline" size="sm" disabled>
          ...
        </Button>
      );
    }

    buttons.push(
      <Button
        key="next"
        variant="outline"
        size="sm"
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
        disabled={currentPage === pageCount}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    );

    return buttons;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Filter investors..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => {}}>
              Website
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => {}}>
              Investor Type
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => {}}>
              HQ Location
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => {}}>
              Total Investments
            </DropdownMenuItem>
            {allInvestmentCountKeys.map(key => (
              <DropdownMenuItem key={key} onSelect={() => {}}>
                {key}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedRows.length === paginatedData.length}
                  onCheckedChange={toggleAllRows}
                />
              </TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Investor Type</TableHead>
              <TableHead>HQ Location</TableHead>
              <TableHead>Total Investments</TableHead>
              {allInvestmentCountKeys.map(key => (
                <TableHead key={key}>{key}</TableHead>
              ))}
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((investor) => (
              <TableRow key={investor._id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(investor._id)}
                    onCheckedChange={() => toggleRowSelection(investor._id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{investor.website}</TableCell>
                <TableCell>{investor.investor_type}</TableCell>
                <TableCell>{investor.hq_location}</TableCell>
                <TableCell>{investor.total_investments}</TableCell>
                {allInvestmentCountKeys.map(key => (
                  <TableCell key={key}>{investor.investmentCounts[key] || "-"}</TableCell>
                ))}
                <TableCell>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    ...
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 30, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-x-2 flex items-center">
          <div className="text-sm text-muted-foreground mr-4">
            {selectedRows.length} of {filteredData.length} row(s) selected.
          </div>
          {renderPaginationButtons()}
        </div>
      </div>
      <div className="space-x-2">
        <Button onClick={copySelectedData} disabled={selectedRows.length === 0}>
          Copy Selected
        </Button>
        <Button onClick={downloadSelectedData} disabled={selectedRows.length === 0}>
          Download Selected CSV
        </Button>
      </div>
    </div>
  );
}