import React from "react";
import { Button } from "../../_global/components/Button";

interface HeaderQRCheckProps {
  mode: "manual" | "scan";
  setMode: React.Dispatch<React.SetStateAction<"manual" | "scan">>;
}

export const HeaderQRCheck: React.FC<HeaderQRCheckProps> = ({
  mode,
  setMode,
}) => {
  return (
    <div className="bg-slate-100 rounded-xl p-1 flex w-full items-center gap-4">
      <Button
        variant={mode === "manual" ? "primary" : "secondary"}
        onClick={() => setMode("manual")}
      >
        Manual
      </Button>
      <Button
        variant={mode === "scan" ? "primary" : "secondary"}
        onClick={() => setMode("scan")}
      >
        Scan
      </Button>
    </div>
  );
};
