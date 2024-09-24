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
import { ChevronDown, ChevronLeft, ChevronRight, Copy, Download, ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
  onBack: () => void;
}

export function InvestorDataTable({ data, onBack }: InvestorDataTableProps) {
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
    investor && (
      investor.website?.toLowerCase().includes(filter.toLowerCase()) ||
      investor.investor_type?.toLowerCase().includes(filter.toLowerCase())
    )
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

  const escapeCSV = (value: string | number) => {
    if (typeof value === 'string') {
      return value.replace(/\t/g, ' ').replace(/\n/g, ' ');
    }
    return value;
  };

  const generateCSVContent = (selectedData: InvestorData[]) => {
    const headers = ["Investor", "Investor Type", "HQ Location", "Total Investments", ...allInvestmentCountKeys];
    const tsvRows = [
      headers.map(escapeCSV).join('\t'),
      ...selectedData.map(investor => [
        investor.website,
        investor.investor_type,
        investor.hq_location,
        investor.total_investments,
        ...allInvestmentCountKeys.map(key => investor.investmentCounts[key] || "")
      ].map(escapeCSV).join('\t'))
    ];
    return tsvRows.join("\n");
  };

  const copySelectedData = () => {
    const selectedData = filteredData.filter(investor => selectedRows.includes(investor._id));
    const tsvContent = generateCSVContent(selectedData);

    // Create a temporary textarea element to hold the TSV content
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = tsvContent;
    document.body.appendChild(tempTextArea);

    // Select and copy the content
    tempTextArea.select();
    document.execCommand('copy');

    // Remove the temporary textarea
    document.body.removeChild(tempTextArea);

    toast({
      title: "Copied to clipboard",
      description: `${selectedData.length} investor${selectedData.length !== 1 ? 's' : ''} copied. Paste into a spreadsheet for best results.`
    });
  };

  const downloadSelectedData = () => {
    const selectedData = filteredData.filter(investor => selectedRows.includes(investor._id));
    const csvContent = generateCSVContent(selectedData);

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
    const maxButtons = 3;
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
    <div className="w-full max-w-[1400px] mx-auto space-y-4 px-2 sm:px-4">
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle>Investor Matches</CardTitle>
          <CardDescription>Review and select potential investors for your startup</CardDescription>
        </CardHeader>
        <CardContent className="px-2 sm:px-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Input
                placeholder="Filter investors..."
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="max-w-sm"
              />
              <div className="flex space-x-2">
                <Button 
                  className="flex items-center space-x-2" 
                  onClick={copySelectedData} 
                  disabled={selectedRows.length === 0}
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy Selected</span>
                </Button>
                <Button 
                  className="flex items-center space-x-2" 
                  onClick={downloadSelectedData} 
                  disabled={selectedRows.length === 0}
                >
                  <Download className="h-4 w-4" />
                  <span>Download Selected</span>
                </Button>
              </div>
            </div>
            <div className="rounded-md border">
              <div className="relative h-[500px] overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={selectedRows.length === paginatedData.length}
                          onCheckedChange={toggleAllRows}
                        />
                      </TableHead>
                      <TableHead className="w-[250px]">Investor</TableHead>
                      <TableHead className="w-[250px]">Investor Type</TableHead>
                      <TableHead className="w-[250px]">HQ Location</TableHead>
                      <TableHead className="w-[150px]">Total Investments</TableHead>
                      {allInvestmentCountKeys.map(key => (
                        <TableHead key={key} className="w-[150px]">{key}</TableHead>
                      ))}
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((investor) => (
                      <TableRow key={investor._id}>
                        <TableCell className="w-[50px]">
                          <Checkbox
                            checked={selectedRows.includes(investor._id)}
                            onCheckedChange={() => toggleRowSelection(investor._id)}
                          />
                        </TableCell>
                        <TableCell className="w-[250px]">{investor.website}</TableCell>
                        <TableCell className="w-[250px]">{investor.investor_type}</TableCell>
                        <TableCell className="w-[250px]">{investor.hq_location}</TableCell>
                        <TableCell className="w-[150px]">{investor.total_investments}</TableCell>
                        {allInvestmentCountKeys.map(key => (
                          <TableCell key={key} className="w-[150px]">{investor.investmentCounts[key] || "-"}</TableCell>
                        ))}
                        <TableCell className="w-[50px]">
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            ...
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[70px]">
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
              <div className="space-x-2">
                {renderPaginationButtons()}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
                {selectedRows.length} of {filteredData.length} row(s) selected
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-start mt-4">
        <Button 
          onClick={onBack}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Fundraising Details</span>
        </Button>
      </div>
    </div>
  );
}