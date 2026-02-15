import { DATA, type Project } from "../config/data";

export type ExperimentLogo = Project["logo"];

export interface ExperimentDetail {
  description: string;
  href: string;
  hrefLabel: string;
  analyticsLabel: string;
  tags: string[];
  previewImage: string;
}

export interface Experiment {
  id: string;
  title: string;
  year: string;
  isOpen: boolean;
  logo: ExperimentLogo;
  panelStyleText: string;
  detail?: ExperimentDetail;
}

const DEFAULT_PANEL_STYLE =
  "--radix-accordion-content-height: var(--radix-collapsible-content-height); --radix-accordion-content-width: var(--radix-collapsible-content-width);";

function getExperimentYear(periodLabel: string): string {
  const year = periodLabel.match(/\b(19|20)\d{2}\b/);
  return year ? year[0] : "----";
}

function getHrefLabel(href: string): string {
  return href
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/+$/, "");
}

function toExperimentDetail(project: Project): ExperimentDetail {
  const href = project.primaryUrl;

  return {
    description: project.summary,
    href,
    hrefLabel: getHrefLabel(href),
    analyticsLabel: `🔗 ${project.title} [Link Click]`,
    tags: project.technologies.slice(0, 3),
    previewImage: project.previewImage,
  };
}

export const EXPERIMENTS: Experiment[] = DATA.projects.map((project, index) => ({
  id: project.id,
  title: project.title,
  year: getExperimentYear(project.periodLabel),
  isOpen: index < 3,
  logo: project.logo,
  panelStyleText: DEFAULT_PANEL_STYLE,
  detail: toExperimentDetail(project),
}));
