import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

/**
 * items: array of { label, href? }
 * last item is considered the current page
 */
function Breadcrumbs({ items = [] }) {
  if (!items.length) return null;

  const lastIndex = items.length - 1;

  return (
    <Breadcrumb className="mb-5 text-sm text-slate-500">
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === lastIndex;
          const label = item.label;
          const href = item.href;

          return (
            <BreadcrumbItem key={label}>
              {isLast ? (
                <BreadcrumbPage className="text-slate-500">
                  {label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  href={href || "#"}
                  className="text-slate-500 hover:text-slate-700"
                >
                  {label}
                </BreadcrumbLink>
              )}

              {!isLast && <BreadcrumbSeparator />}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default Breadcrumbs;
