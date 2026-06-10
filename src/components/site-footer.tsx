import { Camera, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-[#29211c] text-[#f7f0e6]">
      <div className="page-shell grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl font-bold">LUMIÈRE</p>
          <p className="mt-4 max-w-sm text-sm leading-7 text-[#c9bdb2]">
            Considered pieces for everyday life, selected in Malaysia with comfort,
            quality, and repeat wear in mind.
          </p>
          <div className="mt-5 flex gap-2">
            <a className="grid h-9 w-9 place-items-center rounded-full border border-white/20" href="#">
              <Camera size={16} />
            </a>
            <a className="grid h-9 w-9 place-items-center rounded-full border border-white/20" href="mailto:hello@lumiere.my">
              <Mail size={16} />
            </a>
          </div>
        </div>
        <div>
          <p className="mb-4 text-xs font-extrabold tracking-[0.15em] uppercase">Visit us</p>
          <p className="flex gap-3 text-sm leading-6 text-[#c9bdb2]">
            <MapPin size={17} className="mt-1 shrink-0" />
            28 Jalan Telawi, Bangsar Baru, 59100 Kuala Lumpur
          </p>
          <p className="mt-3 flex gap-3 text-sm text-[#c9bdb2]">
            <Phone size={17} /> +60 3 2201 8820
          </p>
        </div>
        <div>
          <p className="mb-4 text-xs font-extrabold tracking-[0.15em] uppercase">Shop</p>
          <div className="space-y-3 text-sm text-[#c9bdb2]">
            <Link className="block hover:text-white" href="/#shop">All products</Link>
            <Link className="block hover:text-white" href="/account/orders">Track an order</Link>
            <Link className="block hover:text-white" href="/dashboard">Owner dashboard</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-[11px] text-[#9f9187]">
        © 2026 Lumière Atelier. Demo storefront built for a Malaysian fashion shop.
      </div>
    </footer>
  );
}
