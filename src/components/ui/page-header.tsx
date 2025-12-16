import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
}

export function PageHeader({ title, subtitle, className }: PageHeaderProps) {
  return (
    <section className={cn("page-header page-header--auto-animate container-content", className)}>
      <div className="page-header__grid">
        <div className="page-header__title-col">
          <h1 className="font-page-header-title page-header__title">{title}</h1>
        </div>
        <div className="page-header__subtitle-col">
          <div className="page-header__accent-line" />
          <p className="font-page-header-subtitle page-header__subtitle">{subtitle}</p>
        </div>
      </div>
      <div className="page-header__divider" />
    </section>
  );
}
