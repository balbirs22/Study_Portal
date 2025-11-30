import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

function SearchBar({
  placeholder = "Search courses, materials, topics...",
  value,
  onChange,
}) {
  return (
    <div className="mb-8">
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <Input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="pl-12 pr-4 py-6 text-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm bg-white/90"
        />
      </div>
    </div>
  );
}

export default SearchBar;
