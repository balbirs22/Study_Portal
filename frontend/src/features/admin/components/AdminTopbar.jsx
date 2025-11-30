import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

function getInitials(nameOrEmail) {
  if (!nameOrEmail) return "?";
  const parts = nameOrEmail.split(" ");
  if (parts.length >= 2) {
    return (
      (parts[0][0] || "").toUpperCase() +
      (parts[1][0] || "").toUpperCase()
    );
  }
  return (nameOrEmail[0] || "?").toUpperCase();
}

function AdminTopbar() {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("adminUser");
      if (stored) {
        setAdminUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login", { replace: true });
  };

  const displayName =
    adminUser?.name || adminUser?.email || "Admin User";

  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Admin
        </p>
        <p className="text-sm text-slate-700">
          Manage your college study portal
        </p>
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-full border-slate-200 px-2.5 py-1 h-9"
            >
              <Avatar className="h-7 w-7">
                <AvatarImage src="" alt={displayName} />
                <AvatarFallback className="text-[11px]">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-xs text-slate-700 max-w-[140px] truncate">
                {displayName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs">
              Signed in as
              <span className="block text-[11px] font-normal text-slate-500 truncate">
                {adminUser?.email || "admin"}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-xs text-rose-600 focus:bg-rose-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-3.5 w-3.5" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default AdminTopbar;
