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
import {
  useAddEntry,
  useEntriesFiltered,
  useProducts,
  useStaff,
} from "@/hooks/useQueries";
import { Clock, Loader2, Package, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const today = () => new Date().toISOString().split("T")[0];
const currentTime = () => new Date().toTimeString().slice(0, 5);

export function EntryPage() {
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: staff = [], isLoading: staffLoading } = useStaff();
  const addEntry = useAddEntry();

  // Fetch recent entries for the info panel (desktop)
  const { data: recentData } = useEntriesFiltered({
    productName: null,
    staffName: null,
    fromDate: null,
    toDate: null,
    page: 0,
    pageSize: 5,
  });
  const recentEntries = recentData?.entries ?? [];

  const [date, setDate] = useState(today());
  const [productId, setProductId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [time, setTime] = useState(currentTime());
  const [clientName, setClientName] = useState("");

  const selectedProduct = products.find((p) => String(p.id) === productId);
  const selectedStaff = staff.find((s) => String(s.id) === staffId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!productId || !staffId) {
      toast.error("Please select a product and staff member.");
      return;
    }
    if (!selectedProduct || !selectedStaff) {
      toast.error("Invalid selection.");
      return;
    }

    try {
      await addEntry.mutateAsync({
        date,
        productId: BigInt(productId),
        productName: selectedProduct.name,
        staffId: BigInt(staffId),
        staffName: selectedStaff.name,
        quantity: BigInt(quantity || "1"),
        time,
        clientName: clientName.trim() || null,
      });
      toast.success("Entry saved!");
      // Reset product, quantity, client — keep date and staff
      setProductId("");
      setQuantity("1");
      setClientName("");
      setTime(currentTime());
    } catch {
      toast.error("Failed to save entry. Please try again.");
    }
  }

  const isLoading = productsLoading || staffLoading;

  return (
    <div className="px-4 lg:px-8 py-6">
      {/* Page title — shown on mobile only (desktop has header bar) */}
      <div className="mb-6 lg:hidden">
        <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
          Quick Entry
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Log product usage for a client
        </p>
      </div>

      {/* Desktop two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,480px)_1fr] gap-6 lg:gap-8">
        {/* Left: Entry form */}
        <div>
          <Card className="shadow-xs border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-foreground">
                Usage Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Date */}
                <div className="space-y-1.5">
                  <Label htmlFor="entry-date" className="text-sm font-medium">
                    Date
                  </Label>
                  <Input
                    id="entry-date"
                    data-ocid="entry.date.input"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="h-12 lg:h-10 text-base"
                  />
                </div>

                {/* Product */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Product</Label>
                  <Select
                    value={productId}
                    onValueChange={setProductId}
                    disabled={isLoading}
                  >
                    <SelectTrigger
                      data-ocid="entry.product.select"
                      className="h-12 lg:h-10 text-base"
                    >
                      <SelectValue
                        placeholder={
                          isLoading ? "Loading..." : "Select product"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem key={String(p.id)} value={String(p.id)}>
                          <span className="flex flex-col items-start">
                            <span>{p.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {p.category}
                            </span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Staff */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Staff Member</Label>
                  <Select
                    value={staffId}
                    onValueChange={setStaffId}
                    disabled={isLoading}
                  >
                    <SelectTrigger
                      data-ocid="entry.staff.select"
                      className="h-12 lg:h-10 text-base"
                    >
                      <SelectValue
                        placeholder={isLoading ? "Loading..." : "Select staff"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {staff.map((s) => (
                        <SelectItem key={String(s.id)} value={String(s.id)}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quantity + Time row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="entry-qty" className="text-sm font-medium">
                      Quantity
                    </Label>
                    <Input
                      id="entry-qty"
                      data-ocid="entry.quantity.input"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                      className="h-12 lg:h-10 text-base"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="entry-time" className="text-sm font-medium">
                      Time
                    </Label>
                    <Input
                      id="entry-time"
                      data-ocid="entry.time.input"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                      className="h-12 lg:h-10 text-base"
                    />
                  </div>
                </div>

                {/* Client Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="entry-client" className="text-sm font-medium">
                    Client Name{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="entry-client"
                    data-ocid="entry.client.input"
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Client name (optional)"
                    className="h-12 lg:h-10 text-base"
                  />
                </div>

                <Button
                  data-ocid="entry.submit_button"
                  type="submit"
                  className="w-full h-12 lg:h-10 text-base font-semibold mt-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={addEntry.isPending || isLoading}
                >
                  {addEntry.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Entry"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right: Info panel (desktop only) */}
        <div className="hidden lg:flex flex-col gap-5">
          {/* Tips card */}
          <Card className="shadow-xs border-border">
            <CardHeader className="pb-3 pt-4">
              <CardTitle className="text-sm font-semibold text-foreground">
                Tips for Quick Entry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pb-4">
              <div className="flex gap-3 items-start">
                <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-primary text-xs font-bold">1</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Select the date and staff member first — both fields are
                  remembered for the next entry.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-primary text-xs font-bold">2</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Products are grouped by category in the dropdown for faster
                  lookup.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-primary text-xs font-bold">3</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Adding a client name helps track usage patterns in monthly
                  reports.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent entries panel */}
          {recentEntries.length > 0 && (
            <Card className="shadow-xs border-border flex-1">
              <CardHeader className="pb-3 pt-4">
                <CardTitle className="text-sm font-semibold text-foreground">
                  Recent Entries
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-2.5">
                  {recentEntries.map((entry) => (
                    <div
                      key={String(entry.id)}
                      className="flex items-start justify-between gap-3 pb-2.5 border-b border-border last:border-0 last:pb-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {entry.productName}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
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
                      <div className="text-right shrink-0">
                        <span className="text-sm font-semibold text-foreground">
                          ×{Number(entry.quantity)}
                        </span>
                        <p className="text-xs text-muted-foreground font-mono">
                          {entry.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
