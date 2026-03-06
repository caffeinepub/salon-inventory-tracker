import type { Product, Staff } from "@/backend.d";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAddProduct,
  useAddStaff,
  useAllProducts,
  useAllStaff,
  useDeleteProduct,
  useDeleteStaff,
  useUpdateProduct,
  useUpdateStaff,
} from "@/hooks/useQueries";
import { Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CATEGORIES = [
  "Waxing",
  "Facial",
  "Skin Care",
  "Hair Care",
  "Nail Care",
  "Spa",
  "Massage",
  "Threading",
  "Eyebrow",
  "Makeup",
  "Other",
];

// ─── Product Dialog ────────────────────────────────────────────────────────────

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product: Product | null;
}

function ProductDialog({ open, onOpenChange, product }: ProductDialogProps) {
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const [name, setName] = useState(product?.name ?? "");
  const [category, setCategory] = useState(product?.category ?? "");

  // Sync when product changes
  const isEditing = !!product;
  const isPending = addProduct.isPending || updateProduct.isPending;

  async function handleSave() {
    if (!name.trim() || !category) {
      toast.error("Please fill in product name and category.");
      return;
    }
    try {
      if (isEditing && product) {
        await updateProduct.mutateAsync({
          id: product.id,
          name: name.trim(),
          category,
        });
        toast.success("Product updated!");
      } else {
        await addProduct.mutateAsync({ name: name.trim(), category });
        toast.success("Product added!");
      }
      onOpenChange(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  function handleOpenChange(v: boolean) {
    if (!v) {
      setName(product?.name ?? "");
      setCategory(product?.category ?? "");
    }
    onOpenChange(v);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent data-ocid="product.dialog" className="max-w-sm mx-4">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="product-name" className="text-sm font-medium">
              Product Name
            </Label>
            <Input
              id="product-name"
              data-ocid="product.name.input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Brazilian Wax"
              className="h-11 text-base"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger
                data-ocid="product.category.select"
                className="h-11 text-base"
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            data-ocid="product.cancel_button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="flex-1 h-11"
          >
            Cancel
          </Button>
          <Button
            data-ocid="product.save_button"
            onClick={handleSave}
            disabled={isPending}
            className="flex-1 h-11 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isEditing ? (
              "Save Changes"
            ) : (
              "Add Product"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Staff Dialog ──────────────────────────────────────────────────────────────

interface StaffDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  member: Staff | null;
}

function StaffDialog({ open, onOpenChange, member }: StaffDialogProps) {
  const addStaff = useAddStaff();
  const updateStaff = useUpdateStaff();
  const [name, setName] = useState(member?.name ?? "");
  const isEditing = !!member;
  const isPending = addStaff.isPending || updateStaff.isPending;

  async function handleSave() {
    if (!name.trim()) {
      toast.error("Please enter a staff name.");
      return;
    }
    try {
      if (isEditing && member) {
        await updateStaff.mutateAsync({ id: member.id, name: name.trim() });
        toast.success("Staff member updated!");
      } else {
        await addStaff.mutateAsync(name.trim());
        toast.success("Staff member added!");
      }
      onOpenChange(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  }

  function handleOpenChange(v: boolean) {
    if (!v) {
      setName(member?.name ?? "");
    }
    onOpenChange(v);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent data-ocid="staff.dialog" className="max-w-sm mx-4">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Staff Member" : "Add Staff Member"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="staff-name" className="text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="staff-name"
              data-ocid="staff.name.input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Riya"
              className="h-11 text-base"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            data-ocid="staff.cancel_button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="flex-1 h-11"
          >
            Cancel
          </Button>
          <Button
            data-ocid="staff.save_button"
            onClick={handleSave}
            disabled={isPending}
            className="flex-1 h-11 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isEditing ? (
              "Save Changes"
            ) : (
              "Add Staff"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirm ────────────────────────────────────────────────────────────

interface DeleteConfirmProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  label: string;
  onConfirm: () => Promise<void>;
}

function DeleteConfirm({
  open,
  onOpenChange,
  label,
  onConfirm,
}: DeleteConfirmProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleConfirm() {
    setIsDeleting(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        data-ocid="delete.confirm.dialog"
        className="max-w-sm mx-4"
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {label}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <strong>{label}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            data-ocid="delete.cancel_button"
            className="flex-1 h-11"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            data-ocid="delete.confirm_button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 h-11 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Products Panel ────────────────────────────────────────────────────────────

function ProductsPanel() {
  const { data: products = [], isLoading } = useAllProducts();
  const deleteProduct = useDeleteProduct();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("__all__");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const categories = Array.from(
    new Set(products.map((p) => p.category)),
  ).sort();

  const filtered = products.filter((p) => {
    const matchSearch =
      !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      categoryFilter === "__all__" || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  function openAdd() {
    setEditProduct(null);
    setDialogOpen(true);
  }

  function openEdit(p: Product) {
    setEditProduct(p);
    setDialogOpen(true);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteProduct.mutateAsync(deleteTarget.id);
    toast.success(`"${deleteTarget.name}" deleted.`);
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            data-ocid="manage.products.search_input"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 pl-9 text-base"
          />
        </div>
        <Button
          data-ocid="manage.products.add.button"
          onClick={openAdd}
          className="h-11 px-4 bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger
          data-ocid="manage.products.category.select"
          className="h-11 text-base"
        >
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__all__">All Categories</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-3xl mb-3">📦</div>
          <p className="font-semibold text-foreground">No products found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {search || categoryFilter !== "__all__"
              ? "Try adjusting your search or filter."
              : "Add your first product to get started."}
          </p>
        </div>
      ) : (
        <div data-ocid="manage.products.list" className="space-y-2">
          {filtered.map((product, idx) => (
            <Card
              key={String(product.id)}
              data-ocid={`manage.products.item.${idx + 1}`}
              className={`shadow-xs border-border ${!product.active ? "opacity-60" : ""}`}
            >
              <CardContent className="p-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Badge variant="outline" className="text-xs px-1.5 py-0">
                      {product.category}
                    </Badge>
                    {!product.active && (
                      <Badge
                        variant="secondary"
                        className="text-xs px-1.5 py-0"
                      >
                        Inactive
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    data-ocid={`manage.products.edit_button.${idx + 1}`}
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(product)}
                    className="h-9 w-9 text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    data-ocid={`manage.products.delete_button.${idx + 1}`}
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTarget(product)}
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ProductDialog
        open={dialogOpen}
        onOpenChange={(v) => {
          setDialogOpen(v);
          if (!v) setEditProduct(null);
        }}
        product={editProduct}
      />

      <DeleteConfirm
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        label={deleteTarget?.name ?? ""}
        onConfirm={handleDelete}
      />
    </div>
  );
}

// ─── Staff Panel ───────────────────────────────────────────────────────────────

function StaffPanel() {
  const { data: staffList = [], isLoading } = useAllStaff();
  const deleteStaff = useDeleteStaff();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMember, setEditMember] = useState<Staff | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Staff | null>(null);

  function openAdd() {
    setEditMember(null);
    setDialogOpen(true);
  }

  function openEdit(s: Staff) {
    setEditMember(s);
    setDialogOpen(true);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteStaff.mutateAsync(deleteTarget.id);
    toast.success(`"${deleteTarget.name}" removed.`);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          data-ocid="manage.staff.add.button"
          onClick={openAdd}
          className="h-11 px-4 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Staff
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : staffList.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-3xl mb-3">👤</div>
          <p className="font-semibold text-foreground">No staff members yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add your first staff member to get started.
          </p>
        </div>
      ) : (
        <div data-ocid="manage.staff.list" className="space-y-2">
          {staffList.map((member, idx) => (
            <Card
              key={String(member.id)}
              data-ocid={`manage.staff.item.${idx + 1}`}
              className={`shadow-xs border-border ${!member.active ? "opacity-60" : ""}`}
            >
              <CardContent className="p-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {member.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Badge
                      variant={member.active ? "default" : "secondary"}
                      className={`text-xs px-1.5 py-0 ${
                        member.active
                          ? "bg-primary/10 text-primary border-primary/20"
                          : ""
                      }`}
                    >
                      {member.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    data-ocid={`manage.staff.edit_button.${idx + 1}`}
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(member)}
                    className="h-9 w-9 text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    data-ocid={`manage.staff.delete_button.${idx + 1}`}
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTarget(member)}
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <StaffDialog
        open={dialogOpen}
        onOpenChange={(v) => {
          setDialogOpen(v);
          if (!v) setEditMember(null);
        }}
        member={editMember}
      />

      <DeleteConfirm
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        label={deleteTarget?.name ?? ""}
        onConfirm={handleDelete}
      />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function ManagePage() {
  return (
    <div className="px-4 lg:px-8 py-6">
      {/* Mobile title */}
      <div className="mb-4 lg:hidden">
        <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
          Manage
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Products and staff management
        </p>
      </div>

      <Tabs defaultValue="products">
        <TabsList className="w-full h-11 mb-4">
          <TabsTrigger
            data-ocid="manage.products.tab"
            value="products"
            className="flex-1 text-sm"
          >
            Products
          </TabsTrigger>
          <TabsTrigger
            data-ocid="manage.staff.tab"
            value="staff"
            className="flex-1 text-sm"
          >
            Staff
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductsPanel />
        </TabsContent>
        <TabsContent value="staff">
          <StaffPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
