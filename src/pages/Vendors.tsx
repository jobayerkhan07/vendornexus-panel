import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Settings, Zap } from "lucide-react";
import { api, Vendor } from "@/lib/api";

export default function Vendors() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: vendors = [], isLoading, error } = useQuery<Vendor[]>({
    queryKey: ["vendors"],
    queryFn: api.vendors.list,
  });

  const deleteVendor = useMutation({
    mutationFn: (id: string) => api.vendors.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vendors"] }),
  });

  const vendorColumns = [
    {
      key: "name" as const,
      label: "Vendor Name",
      render: (value: string) => (
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
      render: (_: unknown, row: Vendor) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-danger hover:text-danger"
            onClick={() => deleteVendor.mutate(row.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);

  if (isLoading) {
    return <div className="space-y-6">Loading...</div>;
  }

  if (error) {
    return <div className="space-y-6">Error loading vendors</div>;
  }

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
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}