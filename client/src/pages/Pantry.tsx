import { useState } from "react";
import { PantryItem, type PantryItemData } from "@/components/PantryItem";
import { AddItemDialog } from "@/components/AddItemDialog";
import { BarcodeScannerModal } from "@/components/BarcodeScannerModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Filter } from "lucide-react";
import { addDays } from "date-fns";

const mockPantryItems: PantryItemData[] = [
  { id: "1", name: "Organic Milk", category: "Dairy", quantity: 2, unit: "L", expiryDate: addDays(new Date(), 3) },
  { id: "2", name: "Fresh Spinach", category: "Produce", quantity: 200, unit: "g", expiryDate: addDays(new Date(), 5) },
  { id: "3", name: "Chicken Breast", category: "Meat", quantity: 500, unit: "g", expiryDate: addDays(new Date(), 2) },
  { id: "4", name: "Greek Yogurt", category: "Dairy", quantity: 500, unit: "g", expiryDate: addDays(new Date(), 7) },
  { id: "5", name: "Brown Rice", category: "Grains", quantity: 1, unit: "kg", expiryDate: addDays(new Date(), 90) },
  { id: "6", name: "Orange Juice", category: "Beverages", quantity: 1, unit: "L", expiryDate: addDays(new Date(), 14) },
  { id: "7", name: "Cheddar Cheese", category: "Dairy", quantity: 250, unit: "g", expiryDate: addDays(new Date(), 21) },
  { id: "8", name: "Fresh Salmon", category: "Meat", quantity: 300, unit: "g", expiryDate: addDays(new Date(), 1) },
  { id: "9", name: "Frozen Peas", category: "Frozen", quantity: 500, unit: "g", expiryDate: addDays(new Date(), 180) },
];

const categories = ["All", "Dairy", "Produce", "Meat", "Grains", "Beverages", "Frozen", "Snacks", "Condiments"];

export default function Pantry() {
  const [items, setItems] = useState(mockPantryItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddItem = (newItem: {
    name: string;
    category: string;
    quantity: number;
    unit: string;
    expiryDate: Date;
  }) => {
    const item: PantryItemData = {
      id: Date.now().toString(),
      ...newItem,
    };
    setItems((prev) => [item, ...prev]);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Pantry</h1>
          <p className="text-muted-foreground">{items.length} items in your pantry</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} data-testid="button-add-pantry-item">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-pantry"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-category-filter">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No items found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <PantryItem
              key={item.id}
              item={item}
              onEdit={(i) => console.log("Edit:", i.name)}
              onDelete={handleDeleteItem}
              onAddToList={(i) => console.log("Add to list:", i.name)}
            />
          ))}
        </div>
      )}

      <AddItemDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddItem}
        onScanBarcode={() => {
          setAddDialogOpen(false);
          setScannerOpen(true);
        }}
      />

      <BarcodeScannerModal
        open={scannerOpen}
        onOpenChange={setScannerOpen}
        onBarcodeScanned={(barcode) => console.log("Scanned:", barcode)}
      />
    </div>
  );
}
