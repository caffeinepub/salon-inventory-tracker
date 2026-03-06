import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useEntriesFiltered, useStaff } from "@/hooks/useQueries";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Package,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

const PAGE_SIZE = 20;

export function HistoryPage() {
  const { data: staffList = [] } = useStaff();

  const [productSearch, setProductSearch] = useState("");
  const [staffFilter, setStaffFilter] = useState("__all__");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(0);

  const hasFilters =
    !!productSearch || staffFilter !== "__all__" || !!fromDate || !!toDate;

  const filterParams = {
    productName: productSearch.trim() || null,
    staffName: staffFilter === "__all__" ? null : staffFilter,
    fromDate: fromDate || null,
    toDate: toDate || null,
    page,
    pageSize: PAGE_SIZE,
  };

  const { data, isLoading, isError } = useEntriesFiltered(filterParams);
  const entries = data?.entries ?? [];
  const total = Number(data?.total ?? 0);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  function clearFilters() {
    setProductSearch("");
    setStaffFilter("__all__");
    setFromDate("");
    setToDate("");
    setPage(0);
  }

  function handleFilterChange() {
    setPage(0);
  }

  return (
    <div className="px-4 lg:px-8 py-6">
      {/* Page title — mobile only */}
      <div className="mb-4 lg:hidden">
        <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
          Usage History
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {total > 0 ? `${total} entries found` : "All recorded entries"}
        </p>
      </div>

      {/* Desktop subtitle */}
      <div className="hidden lg:flex items-center justify-between mb-5">
        <p className="text-sm text-muted-foreground">
          {total > 0 ? `${total} entries found` : "All recorded entries"}
        </p>
      </div>

      {/* Filters — stacked on mobile, inline on desktop */}
      <Card className="mb-5 shadow-xs">
        <CardContent className="pt-4 pb-4">
          {/* Mobile: stacked layout */}
          <div className="flex flex-col gap-3 lg:hidden">
            <Input
              data-ocid="history.search_input"
              placeholder="Search by product name..."
              value={productSearch}
              onChange={(e) => {
                setProductSearch(e.target.value);
                handleFilterChange();
              }}
              className="h-11 text-base"
            />

            <Select
              value={staffFilter}
              onValueChange={(v) => {
                setStaffFilter(v);
                handleFilterChange();
              }}
            >
              <SelectTrigger
                data-ocid="history.staff.select"
                className="h-11 text-base"
              >
                <SelectValue placeholder="All Staff" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Staff</SelectItem>
                {staffList.map((s) => (
                  <SelectItem key={String(s.id)} value={s.name}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">From</Label>
                <Input
                  data-ocid="history.from_date.input"
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    handleFilterChange();
                  }}
                  className="h-11 text-base"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">To</Label>
                <Input
                  data-ocid="history.to_date.input"
                  type="date"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                    handleFilterChange();
                  }}
                  className="h-11 text-base"
                />
              </div>
            </div>

            {hasFilters && (
              <Button
                data-ocid="history.clear_filters.button"
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="w-full h-9 text-sm"
              >
                <X className="h-3.5 w-3.5 mr-1.5" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Desktop: horizontal inline layout */}
          <div className="hidden lg:flex items-end gap-3">
            <div className="flex-1 min-w-0">
              <Label className="text-xs text-muted-foreground mb-1 block">
                Search product
              </Label>
              <Input
                data-ocid="history.search_input"
                placeholder="Search by product name..."
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  handleFilterChange();
                }}
                className="h-10 text-sm"
              />
            </div>

            <div className="w-44 shrink-0">
              <Label className="text-xs text-muted-foreground mb-1 block">
                Staff
              </Label>
              <Select
                value={staffFilter}
                onValueChange={(v) => {
                  setStaffFilter(v);
                  handleFilterChange();
                }}
              >
                <SelectTrigger
                  data-ocid="history.staff.select"
                  className="h-10 text-sm"
                >
                  <SelectValue placeholder="All Staff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Staff</SelectItem>
                  {staffList.map((s) => (
                    <SelectItem key={String(s.id)} value={s.name}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-36 shrink-0">
              <Label className="text-xs text-muted-foreground mb-1 block">
                From date
              </Label>
              <Input
                data-ocid="history.from_date.input"
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  handleFilterChange();
                }}
                className="h-10 text-sm"
              />
            </div>

            <div className="w-36 shrink-0">
              <Label className="text-xs text-muted-foreground mb-1 block">
                To date
              </Label>
              <Input
                data-ocid="history.to_date.input"
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  handleFilterChange();
                }}
                className="h-10 text-sm"
              />
            </div>

            {hasFilters && (
              <Button
                data-ocid="history.clear_filters.button"
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="h-10 px-3 text-sm shrink-0"
              >
                <X className="h-3.5 w-3.5 mr-1.5" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* List */}
      {isLoading ? (
        <div data-ocid="history.loading_state" className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div
          data-ocid="history.error_state"
          className="text-center py-12 text-muted-foreground"
        >
          <p className="text-sm">Failed to load entries. Please try again.</p>
        </div>
      ) : entries.length === 0 ? (
        <div data-ocid="history.empty_state" className="text-center py-16">
          <div className="text-4xl mb-3">📋</div>
          <p className="font-semibold text-foreground">No entries found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {hasFilters
              ? "Try adjusting your filters."
              : "Start by logging product usage."}
          </p>
        </div>
      ) : (
        <div data-ocid="history.list" className="space-y-2.5">
          {entries.map((entry, idx) => (
            <Card
              key={String(entry.id)}
              data-ocid={`history.item.${idx + 1}`}
              className="shadow-xs border-border overflow-hidden"
            >
              <CardContent className="p-4">
                {/* Mobile layout */}
                <div className="lg:hidden">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm leading-tight truncate">
                        {entry.productName}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge
                          variant="secondary"
                          className="text-xs px-1.5 py-0"
                        >
                          ×{Number(entry.quantity)}
                        </Badge>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2 shrink-0 font-mono">
                      {entry.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {entry.staffName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {entry.time}
                    </span>
                    {entry.clientName && (
                      <span className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        {entry.clientName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Desktop layout — wider row */}
                <div className="hidden lg:flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">
                      {entry.productName}
                    </p>
                    {entry.clientName && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Package className="h-3 w-3" />
                        {entry.clientName}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 w-28 shrink-0">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground truncate">
                      {entry.staffName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 w-20 shrink-0">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {entry.time}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono w-24 shrink-0">
                    {entry.date}
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-xs px-2 py-0.5 shrink-0"
                  >
                    ×{Number(entry.quantity)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 py-2">
          <Button
            data-ocid="history.pagination_prev"
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0 || isLoading}
            className="h-10 px-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Prev
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            data-ocid="history.pagination_next"
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1 || isLoading}
            className="h-10 px-4"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
