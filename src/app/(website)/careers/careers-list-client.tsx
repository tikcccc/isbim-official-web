"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Calendar,
  ChevronDown,
  MapPin,
  Timer,
  Users,
} from "lucide-react";
import type { Career } from "@/sanity/lib/types";
import { Link } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  formatDate,
  formatEmploymentType,
  formatExperience,
  formatWorkModel,
} from "./careers-formatters";
import styles from "./careers-list.module.css";

type FilterOption = {
  value: string;
  label: string;
  order: number;
};

type Job = {
  id: string;
  slug: string;
  title: string;
  teamKey: string;
  teamTitle: string;
  teamOrder: number;
  categoryTitle: string;
  categoryOrder: number;
  location: string;
  employmentTypeLabel?: string | null;
  workModelLabel?: string | null;
  experienceLabel?: string | null;
  tags: string[];
  postedAt?: string | null;
  expiresAt?: string | null;
};

const FILTER_ALL = "all";

const formatRelativeTime = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  const timestamp = date.getTime();
  if (Number.isNaN(timestamp)) return null;

  const diffMs = Date.now() - timestamp;
  if (diffMs < 0) return formatDate(value);

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;

  if (diffMs < minute) return "Just now";
  if (diffMs < hour) {
    const minutes = Math.floor(diffMs / minute);
    return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  }
  if (diffMs < day) {
    const hours = Math.floor(diffMs / hour);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  if (diffMs < week) {
    const days = Math.floor(diffMs / day);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }
  if (diffMs < 30 * day) {
    const weeks = Math.floor(diffMs / week);
    return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  }
  return formatDate(value);
};

const normalizeCareers = (careers: Career[]): Job[] =>
  careers.map((career) => {
    const locations = (career.locations || [])
      .map((loc) => loc?.title)
      .filter(Boolean) as string[];

    const teamTitle = career.team?.title || "General Team";
    const teamKey = career.team?.slug?.current || career.team?._id || teamTitle;
    const pillarTitle = career.team?.pillar?.title || "Open Roles";

    return {
      id: career._id,
      slug: career.slug?.current || career._id,
      title: career.title,
      teamKey,
      teamTitle,
      teamOrder: career.team?.sortOrder ?? 999,
      categoryTitle: pillarTitle,
      categoryOrder: career.team?.pillar?.sortOrder ?? 999,
      location: locations[0] || "Global / Flexible",
      employmentTypeLabel: formatEmploymentType(career.employmentType),
      workModelLabel: formatWorkModel(career.workModel),
      experienceLabel: formatExperience(career.experienceLevel),
      tags: career.tags || [],
      postedAt: career.postedAt || null,
      expiresAt: career.expiresAt || null,
    };
  });

const FilterDropdown = ({
  label,
  value,
  options,
  onChange,
  icon: Icon,
}: {
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  icon?: React.ElementType;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isOpen) return;
      if (!ref.current) return;
      const target = event.target as Node | null;
      if (target && !ref.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const selectedLabel =
    value === FILTER_ALL
      ? label
      : options.find((opt) => opt.value === value)?.label || label;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          styles.filterButton,
          "font-body-base",
          value !== FILTER_ALL ? styles.filterButtonActive : styles.filterButtonInactive
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {Icon && <Icon size={14} />}
        {selectedLabel}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className={cn(styles.dropdownMenu, styles.fadeInUp)}
        >
          <button
            type="button"
            role="option"
            aria-selected={value === FILTER_ALL}
            onClick={() => {
              onChange(FILTER_ALL);
              setIsOpen(false);
            }}
            className={cn(
              styles.dropdownOption,
              "font-body-base",
              value === FILTER_ALL && styles.dropdownOptionSelected
            )}
          >
            {label}
          </button>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={value === opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={cn(
                styles.dropdownOption,
                "font-body-base",
                value === opt.value && styles.dropdownOptionSelected
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const HoverCard = ({ job }: { job: Job }) => (
  <div className={cn(styles.hoverCard, styles.fadeInUp, "font-legal")}>
    <div className={styles.hoverCardHeader}>
      <div className={cn(styles.hoverCardTeam, "font-body-base font-semibold max-w-[70%] truncate")}>
        {job.teamTitle}
      </div>
      <span className={cn(styles.hoverCardBadge, "font-legal")}>
        {job.employmentTypeLabel || "Role"}
      </span>
    </div>

    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className={cn(styles.hoverCardMetaKey, "font-legal")}>
          <Briefcase size={12} />
          <span>Seniority</span>
        </div>
        <div className={cn(styles.hoverCardMetaValue, "font-legal")}>
          {job.experienceLabel || "—"}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className={cn(styles.hoverCardMetaKey, "font-legal")}>
          <MapPin size={12} />
          <span>Location</span>
        </div>
        <div className={cn(styles.hoverCardMetaValue, "font-legal")}>
          {job.location}
        </div>
      </div>

      {job.postedAt && (
        <div className="flex justify-between items-center">
          <div className={cn(styles.hoverCardMetaKey, "font-legal")}>
            <Calendar size={12} />
            <span>Posted</span>
          </div>
          <div className={cn(styles.hoverCardMetaValue, "font-legal")}>
            {formatRelativeTime(job.postedAt)}
          </div>
        </div>
      )}

      {job.expiresAt && (
        <div className={cn(styles.hoverCardDeadlineRow, "flex justify-between items-center")}>
          <div className={cn(styles.hoverCardMetaKey, "font-legal")}>
            <Timer size={12} />
            <span>Deadline</span>
          </div>
          <div className={cn(styles.hoverCardDeadlineValue, "font-legal")}>
            {formatDate(job.expiresAt)}
          </div>
        </div>
      )}
    </div>
  </div>
);

const SingleTeamListView = ({ jobs }: { jobs: Job[] }) => {
  return (
    <div className={cn(styles.fadeIn, "container-content flex flex-col gap-0")}>
      <div
        className={cn(
          styles.listHeaderRow,
          "hidden md:grid grid-cols-12 gap-4 pb-4 mb-2 px-2 font-legal uppercase tracking-[0.24em] font-semibold"
        )}
      >
        <div className="col-span-5">Role</div>
        <div className="col-span-2">Seniority</div>
        <div className="col-span-2">Location</div>
        <div className="col-span-2">Work Mode</div>
        <div className="col-span-1 text-right">Apply</div>
      </div>

      {jobs.length > 0 ? (
        jobs.map((job) => (
          <Link
            key={job.id}
            href={`/careers/${job.slug}`}
            className={cn(
              styles.listRow,
              "group relative grid grid-cols-1 md:grid-cols-12 gap-4 py-5 items-center px-2"
            )}
          >
            <div className="col-span-5 relative">
              <span className={cn(styles.listRowTitle, "font-body-base")}>
                {job.title}
              </span>

              <div className={cn(styles.listRowMobileMeta, "md:hidden flex gap-2 mt-1 font-legal")}>
                <span>{job.location}</span> •{" "}
                <span>{job.employmentTypeLabel || "Role"}</span>
              </div>

              <div
                className={cn(
                  styles.hoverPopover,
                  "absolute left-10 bottom-full mb-2 hidden group-hover:block pointer-events-none transform -translate-x-0"
                )}
              >
                <HoverCard job={job} />
                <div className={styles.popoverArrow} />
              </div>
            </div>

            <div className={cn(styles.listRowMeta, "hidden md:block col-span-2 font-body-base")}>
              {job.experienceLabel || "—"}
            </div>
            <div className={cn(styles.listRowMeta, "hidden md:block col-span-2 font-body-base")}>
              {job.location}
            </div>
            <div className={cn(styles.listRowMeta, "hidden md:block col-span-2 font-body-base")}>
              <span className={styles.workModelBadge}>
                {job.workModelLabel || "—"}
              </span>
            </div>
            <div className="hidden md:flex col-span-1 text-right justify-end">
              <span className={styles.applyIcon}>
                <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        ))
      ) : (
        <div className={cn(styles.emptyState, "font-body-base italic")}>
          No current openings for this team.
        </div>
      )}
    </div>
  );
};

const NewspaperItem = ({ job }: { job: Job }) => (
  <div className="relative group">
    <Link
      href={`/careers/${job.slug}`}
      className={cn(styles.newspaperItemRow, "flex justify-between items-start py-3")}
    >
      <div className="flex flex-col gap-1 pr-4">
        <h4 className={cn(styles.newspaperItemTitle, "font-body-base leading-snug")}>
          {job.title}
        </h4>
        <div className={cn(styles.newspaperMeta, "flex items-center gap-3 font-legal uppercase tracking-[0.2em]")}>
          <span>{job.location}</span>
          <span className={cn(styles.newspaperDot, "w-1 h-1 rounded-full")} />
          <span>{job.workModelLabel || "Flexible"}</span>
        </div>
      </div>
      <ArrowRight
        size={14}
        className={cn(styles.newspaperArrow, "flex-shrink-0 mt-1")}
      />
    </Link>

    <div
      className={cn(
        styles.hoverPopover,
        "absolute left-0 bottom-full mb-2 hidden group-hover:block pointer-events-none transform -translate-x-2"
      )}
    >
      <HoverCard job={job} />
      <div className={styles.popoverArrow} />
    </div>
  </div>
);

type CategoryGroup = {
  key: string;
  title: string;
  order: number;
  teams: Array<{
    key: string;
    title: string;
    order: number;
    jobs: Job[];
  }>;
};

const groupForNewspaperLayout = (data: Job[]): CategoryGroup[] => {
  const categories = new Map<
    string,
    {
      key: string;
      title: string;
      order: number;
      teams: Map<
        string,
        { key: string; title: string; order: number; jobs: Job[] }
      >;
    }
  >();

  data.forEach((job) => {
    const categoryKey = job.categoryTitle;
    const category =
      categories.get(categoryKey) ||
      (() => {
        const next = {
          key: categoryKey,
          title: job.categoryTitle,
          order: job.categoryOrder,
          teams: new Map<
            string,
            { key: string; title: string; order: number; jobs: Job[] }
          >(),
        };
        categories.set(categoryKey, next);
        return next;
      })();

    category.order = Math.min(category.order, job.categoryOrder);

    const team =
      category.teams.get(job.teamKey) ||
      (() => {
        const next = {
          key: job.teamKey,
          title: job.teamTitle,
          order: job.teamOrder,
          jobs: [] as Job[],
        };
        category.teams.set(job.teamKey, next);
        return next;
      })();

    team.order = Math.min(team.order, job.teamOrder);
    team.jobs.push(job);
  });

  return Array.from(categories.values())
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
    .map((category) => ({
      key: category.key,
      title: category.title,
      order: category.order,
      teams: Array.from(category.teams.values()).sort(
        (a, b) => a.order - b.order || a.title.localeCompare(b.title)
      ),
    }));
};

const NewspaperLayout = ({ data }: { data: Job[] }) => {
  const groupedData = useMemo(() => groupForNewspaperLayout(data), [data]);

  return (
    <div className={cn(styles.fadeIn, "grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20")}>
      {groupedData.map((category) => (
        <div key={category.key} className="flex flex-col gap-10">
          <h2 className={cn(styles.newspaperCategoryTitle, "font-container-subtitle tracking-tight mb-2")}>
            {category.title}
          </h2>

          {category.teams.length > 0 ? (
            category.teams.map((team) => (
              <div key={team.key} className="mb-4">
                <h3 className={cn(styles.newspaperTeamTitle, "font-label-sm mb-4 flex items-center gap-2")}>
                  {team.title}
                </h3>
                <div className="flex flex-col gap-1">
                  {team.jobs.map((job) => (
                    <NewspaperItem key={job.id} job={job} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className={cn(styles.emptyState, "font-body-base italic mt-2")}>No positions.</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default function CareersListClient({ careers }: { careers: Career[] }) {
  const jobs = useMemo(() => normalizeCareers(careers), [careers]);
  const [filterTeam, setFilterTeam] = useState(FILTER_ALL);

  const teamOptions = useMemo(() => {
    const map = new Map<string, FilterOption>();
    jobs.forEach((job) => {
      if (!map.has(job.teamKey)) {
        map.set(job.teamKey, {
          value: job.teamKey,
          label: job.teamTitle,
          order: job.teamOrder,
        });
      }
    });
    return Array.from(map.values()).sort(
      (a, b) => a.order - b.order || a.label.localeCompare(b.label)
    );
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    if (filterTeam === FILTER_ALL) return jobs;
    return jobs.filter((job) => job.teamKey === filterTeam);
  }, [jobs, filterTeam]);

  if (!jobs.length) {
    return (
      <section className="container-content section-padding pb-24">
        <div className={cn(styles.emptyCard, "p-8 text-center")}>
          <p className={cn(styles.emptyCardText, "font-body-lg")}>
            No open positions right now. Check back soon or contact us for upcoming roles.
          </p>
        </div>
      </section>
    );
  }

  const showNewspaperLayout = filterTeam === FILTER_ALL;

  return (
    <section className="container-content section-padding pb-24">
      <div className={styles.fadeIn}>
        <div className={styles.controlsBar}>
          <div className="flex items-center gap-4">
            {filterTeam !== FILTER_ALL && (
              <button
                type="button"
                onClick={() => setFilterTeam(FILTER_ALL)}
                className={styles.clearFilterButton}
                title="Clear Filter"
              >
                <ArrowLeft size={14} />
              </button>
            )}

            <div className="flex flex-wrap gap-6 w-full md:w-auto">
              <FilterDropdown
                label="All Teams"
                value={filterTeam}
                options={teamOptions}
                onChange={setFilterTeam}
                icon={Users}
              />
            </div>
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <span className={cn(styles.resultCount, "font-legal uppercase tracking-[0.24em] font-semibold")}>
              {filteredJobs.length} Positions Found
            </span>
          </div>
        </div>

        <div className="min-h-[500px]">
          {showNewspaperLayout ? (
            <NewspaperLayout data={filteredJobs} />
          ) : (
            <SingleTeamListView jobs={filteredJobs} />
          )}
        </div>
      </div>
    </section>
  );
}
