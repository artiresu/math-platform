type CollapsibleRevealProps = {
  open: boolean;
  children: React.ReactNode;
  className?: string;
};

export function CollapsibleReveal({
  open,
  children,
  className = "",
}: CollapsibleRevealProps) {
  return (
    <div
      className={`grid transition-[grid-template-rows,opacity,margin-top] duration-300 ease-out ${
        open ? "mt-6 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
      } ${className}`}
      aria-hidden={!open}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}
