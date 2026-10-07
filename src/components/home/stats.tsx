import { site } from "@/lib/site";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

export function StatsBar() {
  return (
    <section className="bg-gold" aria-label="Nuvene Beauty in numbers">
      <div className="section">
        {/* The 1px gaps over an ink tint draw the dividers at every breakpoint. */}
        <Stagger className="grid grid-cols-2 gap-px bg-ink/15 sm:grid-cols-5">
          {site.stats.map((stat, i) => (
            <StaggerItem
              key={stat.label}
              className={`flex flex-col items-center gap-1.5 bg-gold px-3 py-6 text-center ${
                i === site.stats.length - 1 ? "col-span-2 sm:col-span-1" : ""
              }`}
            >
              {/* Word values (Guaranteed) step down on phones so they clear the dividers. */}
              <span
                className={`font-serif leading-none text-ink ${
                  stat.value.length > 6 ? "text-[1.3rem] sm:text-[1.75rem]" : "text-[1.75rem]"
                }`}
              >
                {stat.value}
              </span>
              <span className="text-[0.6rem] font-medium uppercase tracking-[0.16em] text-ink/80">
                {stat.label}
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
