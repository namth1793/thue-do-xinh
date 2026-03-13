import { categories } from '@/data/products';

interface ProductFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function ProductFilter({
  selectedCategory,
  onCategoryChange,
}: ProductFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`px-3 py-1.5 text-sm rounded-full border whitespace-nowrap transition-colors ${
            selectedCategory === cat
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card text-muted-foreground border-border hover:border-primary'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
