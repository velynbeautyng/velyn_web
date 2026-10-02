import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

export function StatsBar() {
  return (
    <section className="bg-gold" aria-label="Nuvene Beauty in numbers">
      <Stagger className="section grid grid-cols-2 lg:grid-cols-4">
        {site.stats.map((stat, i) => (
          <StaggerItem
            key={stat.label}
            className={cn(
              "flex flex-col items-center gap-1.5 px-3 py-7 text-center",
              i % 2 === 0 && "border-r border-ink/15",
              i < 2 && "border-b border-ink/15 lg:border-b-0",
              i === 1 && "lg:border-r",
            )}
          >
            <span className="font-serif text-[1.9rem] leading-none text-ink">{stat.value}</span>
            <span className="max-w-[22ch] text-[0.62rem] font-medium uppercase tracking-[0.16em] text-ink/80">
              {stat.label}
            </span>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
