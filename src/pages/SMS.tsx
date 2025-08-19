import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Eye } from "lucide-react";
import { api, SMSMessage } from "@/lib/api";

export default function SMS() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: messages = [], isLoading, error } = useQuery<SMSMessage[]>({
    queryKey: ["sms"],
    queryFn: api.sms.list,
  });

  const smsColumns = [
    {
      key: "number" as const,
      label: "Number",
      render: (value: string) => (
        <span className="font-mono text-foreground">{value}</span>
      )
    },
    { key: "user" as const, label: "User" },
    { key: "sender" as const, label: "Sender" },
    {
      key: "message" as const,
      label: "Message",
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      )
    },
    { key: "receivedAt" as const, label: "Received At" },
    {
      key: "status" as const,
      label: "Status",
      render: (value: string) => (
        <span className={`status-badge ${
          value === "delivered" ? "status-active" :
          value === "failed" ? "status-inactive" : "status-pending"
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
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
        <Button variant="ghost" size="sm" title="View Details">
          <Eye className="w-4 h-4" />
        </Button>
      )
    }
  ];

  const filteredSMS = messages.filter(sms =>
    sms.number.includes(searchTerm) ||
    sms.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sms.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sms.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSMS.length / itemsPerPage);

  if (isLoading) {
    return <div className="space-y-6">Loading...</div>;
  }

  if (error) {
    return <div className="space-y-6">Error loading SMS</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">SMS Messages</h1>
          <p className="text-muted-foreground">View and manage received SMS messages</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export SMS
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-2xl font-bold text-foreground">12,847</div>
          <div className="text-sm text-muted-foreground">Total SMS</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-2xl font-bold text-success">12,823</div>
          <div className="text-sm text-muted-foreground">Delivered</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-2xl font-bold text-warning">24</div>
          <div className="text-sm text-muted-foreground">Failed</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-2xl font-bold text-primary">$642.35</div>
          <div className="text-sm text-muted-foreground">Total Cost</div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search SMS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* SMS Table */}
      <DataTable
        data={filteredSMS.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
        columns={smsColumns}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage
        }}
      />
    </div>
  );
}