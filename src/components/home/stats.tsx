import { site } from "@/lib/site";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

export function StatsBar() {
  return (
    <section className="bg-gold" aria-label="Velyn by the numbers">
      <Stagger className="section grid grid-cols-2 divide-x divide-white/15 sm:grid-cols-3 lg:grid-cols-5 [&>*:nth-child(2n)]:border-r-0 sm:[&>*]:border-r lg:[&>*]:border-r [&>*]:border-white/15">
        {site.stats.map((stat) => (
          <StaggerItem
            key={stat.label}
            className="flex flex-col items-center gap-1 px-2 py-6"
          >
            <span className="font-serif text-[1.7rem] font-medium leading-none text-white">
              {stat.value}
            </span>
            <span className="text-center text-[0.58rem] uppercase tracking-[0.14em] text-white/70">
              {stat.label}
            </span>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
