import { AdminAuthProvider } from "./AdminAuthContext";
import { StudyFiltersProvider } from "./StudyFiltersContext";

function AppProviders({ children }) {
  return (
    <AdminAuthProvider>
      <StudyFiltersProvider>
        {children}
      </StudyFiltersProvider>
    </AdminAuthProvider>
  );
}

export default AppProviders;
