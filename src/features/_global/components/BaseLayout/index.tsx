import { ChevronLeft } from "lucide-react";
import React, { ReactNode } from "react";
import { To, useNavigate } from "react-router-dom";
import { BreadCrumb } from "../BreadCrumb";
import { BreadCrumbProps } from "../BreadCrumb/types";
import { Poppins } from "../Text";
import { Button, IButtonProps } from "../Button";
import { useAtom } from "jotai";
import { SidebarAtom } from "../../store";

export type BackButtonConfig = {
  title: string;
  navigateTo?: To;
  onClick?: () => void;
};

export interface PageLayoutProps {
  title?: React.ReactNode;
  backButton?: BackButtonConfig;
  breadcrumb?: BreadCrumbProps; // urutan kiri->kanan
  className?: string; // tambahan kelas wrapper
  headerClassName?: string; // tambahan kelas header
  children: React.ReactNode;
  action?: IButtonProps | ReactNode;
  actionType?: "button" | "node";
}

export const BaseLayout: React.FC<PageLayoutProps> = ({
  title,
  backButton,
  breadcrumb,
  className,
  headerClassName,
  children,
  action,
  actionType = "button",
}) => {
  const navigate = useNavigate();
  const [open] = useAtom(SidebarAtom);
  const handleBack = () => {
    if (backButton?.onClick) return backButton.onClick();
    if (typeof backButton?.navigateTo !== "undefined") {
      if (typeof backButton.navigateTo === "number") {
        navigate(backButton.navigateTo);
      } else {
        navigate(backButton.navigateTo);
      }
      return;
    }
    navigate(-1); // default
  };

  return (
    <div
      className={[
        `w-full duration-300 ${
          open ? "md:pl-64" : "md:pl-16"
        } py-4 mx-auto space-y-6`,
        className || "",
      ].join()}
    >
      {/* Header */}
      <div className="flex md:items-center md:justify-between md:gap-0 gap-6">
        {(title || backButton || breadcrumb) && (
          <div
            className={[
              "mb-4 md:px-0 px-4 flex flex-col gap-2",
              headerClassName || "",
            ].join(" ")}
          >
            {/* Back Button + Title */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {backButton && (
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={handleBack}
                  >
                    <ChevronLeft size={18} />
                    <span className="text-sm font-medium">
                      {backButton.title}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {title ? (
              <Poppins className="text-2xl md:text-3xl font-semibold text-slate-900">
                {title}
              </Poppins>
            ) : null}
            {/* Step Page / Breadcrumb */}
            {breadcrumb && (
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <BreadCrumb {...breadcrumb} />;
              </div>
            )}
          </div>
        )}
      {!!action && (  /* <- cast ke boolean agar bukan children */
          <div>
            {actionType === "node" ? (
              action as ReactNode
            ) : (
              <Button {...(action as IButtonProps)} />
            )}
          </div>
        )}
      </div>

      {/* Body */}
      <div>{children}</div>
    </div>
  );
};
