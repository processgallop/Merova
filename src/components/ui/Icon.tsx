import {
  Car, Clapperboard, Cpu, Factory, Gift, Pill, ShoppingBasket, Store, Truck, UtensilsCrossed, Package,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Pill, Car, UtensilsCrossed, Store, Gift, Factory, Truck, Clapperboard, ShoppingBasket, Cpu,
};

export function IndustryIcon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  const I = ICONS[name] ?? Package;
  return <I className={className} aria-hidden="true" strokeWidth={1.6} />;
}
