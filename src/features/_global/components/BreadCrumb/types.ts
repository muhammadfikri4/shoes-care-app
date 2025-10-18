import { ReactNode } from "react";

export interface BreadCrumbItem {
  to: string;
  name: string;
}

export interface BreadCrumbProps {
  items: BreadCrumbItem[];
  icon?: ReactNode;
}
