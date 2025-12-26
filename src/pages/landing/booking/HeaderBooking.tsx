
import { LangToggleFlags } from "@/components/landing/lang-toggle-flags";

export default function HeaderBooking() {
  return (
    <header className="  bg-primary flex items-center justify-between p-4 relative min-h-24">
        <div className="w-12"></div>
        <img src="/logo.png" alt="Booking Header" className="absolute left-1/2 transform -translate-x-1/2 h-20" />
        <LangToggleFlags />
    </header>
  );
}