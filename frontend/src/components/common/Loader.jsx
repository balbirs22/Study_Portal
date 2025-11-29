function Loader({ fullPage = false, label = "Loading..." }) {
  const Container = fullPage ? "div" : "div";

  return (
    <Container
      className={`flex items-center justify-center ${
        fullPage ? "min-h-[40vh]" : "py-6"
      }`}
    >
      <div className="flex flex-col items-center gap-2 text-slate-500">
        <div className="h-8 w-8 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
        {label && (
          <span className="text-xs font-medium tracking-wide">{label}</span>
        )}
      </div>
    </Container>
  );
}

export default Loader;
