import { cn } from "@/utils/cn";

export function CortexLogo({ className }: { className: string }) {
  return (
    <span
      role="img"
      aria-label="Cortex"
      className={cn("inline-flex shrink-0 items-center gap-1.5", className)}
    >
      <img
        src="/images/cortex-mark.svg"
        alt=""
        aria-hidden="true"
        className="block h-[88%] w-auto"
      />
      <img
        src="/images/image copy.png"
        alt=""
        aria-hidden="true"
        className="block h-full w-auto"
      />
    </span>
  );
}