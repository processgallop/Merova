import {
  Boxes, Building2, Car, ConciergeBell, Cpu, Factory, Gift, HardHat, Pill, Popcorn, Shapes, ShoppingBag, ShoppingCart, Truck, UtensilsCrossed, Wheat, Package, type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Pill, Car, UtensilsCrossed, ShoppingBag, Gift, Factory, Truck, Popcorn, ShoppingCart, Cpu, HardHat, Building2, ConciergeBell, Wheat, Shapes, Boxes, Package,
  // aliases used by earlier content
  Film: Popcorn, Clapperboard: Popcorn, Utensils: UtensilsCrossed, Package2: Package, PackageOpen: Package, Smartphone: Cpu, Laptop: Cpu, Store: ShoppingBag, Sparkles: Gift,
};

export const ICON_NAMES = Object.keys(ICONS);

export function Icon({ name, className = "size-5", strokeWidth = 1.6 }: { name: string; className?: string; strokeWidth?: number }) {
  const C = ICONS[name] ?? Boxes;
  return <C className={className} strokeWidth={strokeWidth} aria-hidden />;
}
