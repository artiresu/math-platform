import { NavBar } from "./NavBar";
import { PromoBanner } from "./PromoBanner";

export function SiteHeader() {
  return (
    <div className="sticky top-0 z-50">
      <PromoBanner />
      <NavBar />
    </div>
  );
}
