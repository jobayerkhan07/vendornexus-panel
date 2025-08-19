import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Settings, Zap } from "lucide-react";

// Mock data
const mockVendors = [
  {
    id: "1",
    name: "Twilio",
    type: "API",
    status: "active",
    purchasePrice: "$15.00",
    inboundPrice: "$0.05",
    numbersAvailable: 1250,
    totalPurchased: 3456,
    lastSync: "2024-01-15 14:30:00"
  },
  {
    id: "2",
    name: "MessageBird",
    type: "API", 
    status: "active",
    purchasePrice: "$12.00",
    inboundPrice: "$0.04",
    numbersAvailable: 890,
    totalPurchased: 2134,
    lastSync: "2024-01-15 14:25:00"
  },
  {
    id: "3",
    name: "Plivo",
    type: "Manual",
    status: "active",
    purchasePrice: "$10.00", 
    inboundPrice: "$0.03",
    numbersAvailable: 456,
    totalPurchased: 1678,
    lastSync: "-"
  },
  {
    id: "4",
    name: "Vonage",
    type: "API",
    status: "inactive",
    purchasePrice: "$18.00",
    inboundPrice: "$0.06",
    numbersAvailable: 0,
    totalPurchased: 234,
    lastSync: "2024-01-12 09:15:00"
  }
];

const vendorColumns = [
  { 
    key: "name" as const, 
    label: "Vendor Name",
    render: (value: string, row: any) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <Zap className="w-4 h-4 text-primary" />
        </div>
        <span className="font-medium">{value}</span>
      </div>
    )
  },
  {
    key: "type" as const,
    label: "Type",
    render: (value: string) => (
      <Badge variant={value === "API" ? "default" : "secondary"}>
        {value}
      </Badge>
    )
  },
  {
    key: "status" as const,
    label: "Status",
    render: (value: string) => (
      <span className={`status-badge ${
        value === "active" ? "status-active" : "status-inactive"
      }`}>
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </span>
    )
  },
  { 
    key: "purchasePrice" as const, 
    label: "Purchase Price",
    render: (value: string) => (
      <span className="font-medium text-foreground">{value}</span>
    )
  },
  { 
    key: "inboundPrice" as const, 
    label: "Inbound SMS Price",
    render: (value: string) => (
      <span className="font-medium text-foreground">{value}</span>
    )
  },
  { key: "numbersAvailable" as const, label: "Available" },
  { key: "totalPurchased" as const, label: "Total Purchased" },
  { key: "lastSync" as const, label: "Last Sync" },
  {
    key: "actions" as const,
    label: "Actions",
    render: (_, row: any) => (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-danger hover:text-danger">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    )
  }
];

export default function Vendors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredVendors = mockVendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendors</h1>
          <p className="text-muted-foreground">Manage SMS service providers and configurations</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Vendor
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-2xl font-bold text-foreground">4</div>
          <div className="text-sm text-muted-foreground">Total Vendors</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-2xl font-bold text-success">3</div>
          <div className="text-sm text-muted-foreground">Active Vendors</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-2xl font-bold text-primary">2,596</div>
          <div className="text-sm text-muted-foreground">Available Numbers</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-2xl font-bold text-foreground">7,502</div>
          <div className="text-sm text-muted-foreground">Total Purchased</div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Vendors Table */}
      <DataTable
        data={filteredVendors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
        columns={vendorColumns}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage
        }}
      />
    </div>
  );
}