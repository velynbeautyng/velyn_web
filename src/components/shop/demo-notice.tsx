import { IconShield } from "@/components/ui/icons";

/** Shown while the live ops catalogue is still being imported. */
export function DemoNotice() {
  return (
    <div className="section">
      <div className="flex items-start gap-3 border border-gold-pale bg-gold-faint px-4 py-3">
        <IconShield width={16} height={16} className="mt-0.5 shrink-0 text-gold-dim" />
        <p className="text-[0.8rem] leading-relaxed text-cocoa">
          <strong className="font-semibold text-espresso">
            Catalogue preview.
          </strong>{" "}
          These are sample products shown while our full range is being loaded
          from the Velyn inventory system. Live pricing and stock go live
          automatically once import completes.
        </p>
      </div>
    </div>
  );
}
