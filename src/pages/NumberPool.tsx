import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Upload, Download, Eye } from "lucide-react";
import { api, NumberItem } from "@/lib/api";

export default function NumberPool() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: numbers = [], isLoading, error } = useQuery<NumberItem[]>({
    queryKey: ["numbers"],
    queryFn: api.numbers.list,
  });

  const numberColumns = [
    {
      key: "number" as const,
      label: "Phone Number",
      render: (value: string) => (
        <span className="font-mono text-foreground">{value}</span>
      )
    },
    { key: "vendor" as const, label: "Vendor" },
    { key: "user" as const, label: "Assigned User" },
    { key: "purchaseDate" as const, label: "Purchase Date" },
    { key: "expiryDate" as const, label: "Expiry Date" },
    {
      key: "status" as const,
      label: "Status",
      render: (value: string) => (
        <span className={`status-badge ${
          value === "active" ? "status-active" :
          value === "expired" ? "status-inactive" : "status-pending"
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    { key: "smsReceived" as const, label: "SMS Count" },
    {
      key: "cost" as const,
      label: "Cost",
      render: (value: string) => (
        <span className="font-medium text-foreground">{value}</span>
      )
    },
    {
      key: "actions" as const,
      label: "Actions",
      render: () => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  const filteredNumbers = numbers.filter(number =>
    number.number.includes(searchTerm) ||
    number.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    number.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNumbers.length / itemsPerPage);

  if (isLoading) {
    return <div className="space-y-6">Loading...</div>;
  }

  if (error) {
    return <div className="space-y-6">Error loading numbers</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Number Pool</h1>
          <p className="text-muted-foreground">Manage phone numbers and assignments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Bulk Upload
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Number
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-2xl font-bold text-foreground">3,891</div>
          <div className="text-sm text-muted-foreground">Total Numbers</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-2xl font-bold text-success">3,456</div>
          <div className="text-sm text-muted-foreground">Active Numbers</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-2xl font-bold text-warning">289</div>
          <div className="text-sm text-muted-foreground">Expiring Soon</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-2xl font-bold text-danger">146</div>
          <div className="text-sm text-muted-foreground">Expired</div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search numbers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Numbers Table */}
      <DataTable
        data={filteredNumbers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
        columns={numberColumns}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage
        }}
      />
    </div>
  );
}