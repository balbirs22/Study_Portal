import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

function SearchBar({ placeholder = "Search courses, materials, topics...", value, onChange }) {
  return (
    <div className="mb-6">
      <div className="relative w-full max-w-2xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="pl-9 h-11 rounded-xl border-slate-200 bg-white/70 shadow-sm focus-visible:ring-indigo-500"
        />
      </div>
    </div>
  );
}

export default SearchBar;
