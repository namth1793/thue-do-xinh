import { categories } from '@/data/products';

interface ProductFilterProps {
  selectedCategory: string;
  selectedCondition: string;
  onCategoryChange: (category: string) => void;
  onConditionChange: (condition: string) => void;
}

export default function ProductFilter({
  selectedCategory,
  selectedCondition,
  onCategoryChange,
  onConditionChange,
}: ProductFilterProps) {
  return (
    <div className="space-y-3">
      {/* Condition filter */}
      <div className="flex gap-2">
        {['Tất cả', 'Đồ mới', 'Đồ cũ'].map(cond => (
          <button
            key={cond}
            onClick={() => onConditionChange(cond)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
              selectedCondition === cond
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border hover:border-primary'
            }`}
          >
            {cond}
          </button>
        ))}
      </div>

      {/* Category filter - horizontal scroll on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
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
    </div>
  );
}
