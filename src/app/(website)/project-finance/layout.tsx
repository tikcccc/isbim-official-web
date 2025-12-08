import { HideDefaultFooter } from "@/components/services-products/hide-default-footer";

export default function ProjectFinanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HideDefaultFooter />
      {children}
    </>
  );
}
