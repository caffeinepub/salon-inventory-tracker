import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDailyReport, useMonthlyReport } from "@/hooks/useQueries";
import { BarChart3, Calendar, Loader2 } from "lucide-react";
import { useState } from "react";

const today = () => new Date().toISOString().split("T")[0];

const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

function getYearOptions(): string[] {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let y = currentYear - 5; y <= currentYear + 1; y++) {
    years.push(String(y));
  }
  return years;
}

export function ReportsPage() {
  // Daily
  const [dailyDate, setDailyDate] = useState(today());
  const [loadDaily, setLoadDaily] = useState(false);

  // Monthly
  const now = new Date();
  const [month, setMonth] = useState(
    String(now.getMonth() + 1).padStart(2, "0"),
  );
  const [year, setYear] = useState(String(now.getFullYear()));
  const [loadMonthly, setLoadMonthly] = useState(false);

  const dailyReport = useDailyReport(dailyDate, loadDaily);
  const monthlyReport = useMonthlyReport(month, year, loadMonthly);

  const yearOptions = getYearOptions();

  return (
    <div className="px-4 lg:px-8 py-6">
      {/* Mobile title */}
      <div className="mb-4 lg:hidden">
        <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
          Reports
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Daily and monthly usage reports
        </p>
      </div>

      <Tabs defaultValue="daily">
        <TabsList className="w-full h-11 mb-4">
          <TabsTrigger
            data-ocid="reports.daily.tab"
            value="daily"
            className="flex-1 text-sm"
          >
            <Calendar className="h-4 w-4 mr-1.5" />
            Daily
          </TabsTrigger>
          <TabsTrigger
            data-ocid="reports.monthly.tab"
            value="monthly"
            className="flex-1 text-sm"
          >
            <BarChart3 className="h-4 w-4 mr-1.5" />
            Monthly
          </TabsTrigger>
        </TabsList>

        {/* Daily Report */}
        <TabsContent value="daily" className="space-y-4">
          <Card className="shadow-xs">
            <CardContent className="pt-4 pb-4">
              <div className="flex gap-3 items-end">
                <div className="flex-1 space-y-1.5">
                  <Label htmlFor="daily-date" className="text-sm font-medium">
                    Select Date
                  </Label>
                  <Input
                    id="daily-date"
                    data-ocid="reports.daily.date.input"
                    type="date"
                    value={dailyDate}
                    onChange={(e) => {
                      setDailyDate(e.target.value);
                      setLoadDaily(false);
                    }}
                    className="h-11 text-base"
                  />
                </div>
                <Button
                  data-ocid="reports.daily.load.button"
                  onClick={() => setLoadDaily(true)}
                  className="h-11 px-5 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={dailyReport.isFetching}
                >
                  {dailyReport.isFetching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Load"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {dailyReport.isFetching && (
            <div className="space-y-3">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
          )}

          {!dailyReport.isFetching &&
            loadDaily &&
            dailyReport.data &&
            (dailyReport.data.staffGroups.length === 0 ? (
              <div
                data-ocid="reports.daily.empty_state"
                className="text-center py-16"
              >
                <div className="text-4xl mb-3">📊</div>
                <p className="font-semibold text-foreground">
                  No data for this date
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  No usage was recorded on {dailyDate}.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {dailyReport.data.staffGroups.map((group) => (
                  <Card
                    key={group.staffName}
                    className="shadow-xs border-border"
                  >
                    <CardHeader className="pb-2 pt-4 px-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold text-foreground">
                          {group.staffName}
                        </CardTitle>
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          {Number(group.totalQuantity)} used
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="space-y-2">
                        {group.entries.map((entry) => (
                          <div
                            key={String(entry.id)}
                            className="flex items-center justify-between py-1 border-b border-border last:border-0"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-foreground truncate">
                                {entry.productName}
                              </p>
                              {entry.clientName && (
                                <p className="text-xs text-muted-foreground">
                                  {entry.clientName}
                                </p>
                              )}
                            </div>
                            <div className="text-right ml-3 shrink-0">
                              <span className="text-sm font-semibold text-foreground">
                                ×{Number(entry.quantity)}
                              </span>
                              <p className="text-xs text-muted-foreground">
                                {entry.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Card className="shadow-xs border-primary/20 bg-primary/5">
                  <CardContent className="p-4 flex items-center justify-between">
                    <span className="font-semibold text-foreground">
                      Grand Total
                    </span>
                    <span className="font-bold text-primary text-lg">
                      {Number(dailyReport.data.grandTotal)} items
                    </span>
                  </CardContent>
                </Card>
              </div>
            ))}
        </TabsContent>

        {/* Monthly Report */}
        <TabsContent value="monthly" className="space-y-4">
          <Card className="shadow-xs">
            <CardContent className="pt-4 pb-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Month</Label>
                  <Select
                    value={month}
                    onValueChange={(v) => {
                      setMonth(v);
                      setLoadMonthly(false);
                    }}
                  >
                    <SelectTrigger
                      data-ocid="reports.monthly.month.select"
                      className="h-11 text-base"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTHS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Year</Label>
                  <Select
                    value={year}
                    onValueChange={(v) => {
                      setYear(v);
                      setLoadMonthly(false);
                    }}
                  >
                    <SelectTrigger
                      data-ocid="reports.monthly.year.select"
                      className="h-11 text-base"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map((y) => (
                        <SelectItem key={y} value={y}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                data-ocid="reports.monthly.load.button"
                onClick={() => setLoadMonthly(true)}
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={monthlyReport.isFetching}
              >
                {monthlyReport.isFetching ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load Report"
                )}
              </Button>
            </CardContent>
          </Card>

          {monthlyReport.isFetching && (
            <div className="space-y-3">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
          )}

          {!monthlyReport.isFetching &&
            loadMonthly &&
            monthlyReport.data &&
            (monthlyReport.data.productTotals.length === 0 &&
            monthlyReport.data.staffTotals.length === 0 ? (
              <div
                data-ocid="reports.monthly.empty_state"
                className="text-center py-16"
              >
                <div className="text-4xl mb-3">📊</div>
                <p className="font-semibold text-foreground">
                  No data for this month
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  No usage was recorded in{" "}
                  {MONTHS.find((m) => m.value === month)?.label} {year}.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Products Table */}
                {monthlyReport.data.productTotals.length > 0 && (
                  <Card className="shadow-xs">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-sm font-semibold">
                        Products Used
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="space-y-2">
                        {[...monthlyReport.data.productTotals]
                          .sort(
                            (a, b) =>
                              Number(b.totalQuantity) - Number(a.totalQuantity),
                          )
                          .map((pt) => (
                            <div
                              key={pt.productName}
                              className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-foreground truncate font-medium">
                                  {pt.productName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {pt.category}
                                </p>
                              </div>
                              <Badge
                                variant="secondary"
                                className="ml-3 shrink-0 font-semibold"
                              >
                                {Number(pt.totalQuantity)} units
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Separator />

                {/* Staff Table */}
                {monthlyReport.data.staffTotals.length > 0 && (
                  <Card className="shadow-xs">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-sm font-semibold">
                        Staff Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="space-y-2">
                        {[...monthlyReport.data.staffTotals]
                          .sort(
                            (a, b) =>
                              Number(b.totalQuantity) - Number(a.totalQuantity),
                          )
                          .map((st) => (
                            <div
                              key={st.staffName}
                              className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium text-foreground">
                                  {st.staffName}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {Number(st.entryCount)} entries
                                </p>
                              </div>
                              <Badge className="ml-3 bg-primary/10 text-primary border-primary/20 shrink-0 font-semibold">
                                {Number(st.totalQuantity)} total
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
