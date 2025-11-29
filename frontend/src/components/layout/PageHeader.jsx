function PageHeader({ title, subtitle, badge }) {
  return (
    <div className="mb-6">
      {badge ? (
        <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 mb-2">
          {badge}
        </span>
      ) : null}

      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
        {title}
      </h1>

      {subtitle ? (
        <p className="mt-1 text-sm text-slate-500 max-w-2xl">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export default PageHeader;
