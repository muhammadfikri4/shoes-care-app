import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ConditionNode } from "../ConditionNode";

export interface IPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<IPaginationProps> = ({
  currentPage,
  onPageChange,
  totalPages,
}) => {
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const delta = 2;

    const range = {
      start: Math.max(2, currentPage - delta),
      end: Math.min(totalPages - 1, currentPage + delta),
    };

    pageNumbers.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        className={`w-9 h-9 ${
          currentPage === 1
            ? "border border-solid bg-indigo-500 shadow-[#466c8e] rounded-md text-white"
            : "border border-solid border-gray-800 rounded-md text-black"
        }`}
      >
        1
      </button>
    );

    if (range.start > 2) {
      pageNumbers.push(<span key="start-ellipsis w-9">...</span>);
    }

    for (let i = range.start; i <= range.end; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-9 h-9 ${
            i === totalPages
              ? "border border-solid bg-indigo-500 shadow-[#466c8e] border-gray-800 rounded-md text-white"
              : "border border-solid border-gray-800 rounded-md text-black"
          }`}
        >
          {i}
        </button>
      );
    }

    if (range.end < totalPages - 1) {
      pageNumbers.push(<span key="end-ellipsis text-black w-9">...</span>);
    }

    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`w-9 h-9 ${
            currentPage === totalPages
              ? "border border-solid bg-indigo-500 shadow-[#466c8e] rounded-md text-white"
              : "border border-solid border-gray-800 rounded-md text-black"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <ConditionNode condition={totalPages > 1}>
      <div className="pagination my-6 flex items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
          h-9 w-9 flex items-center justify-center ${
            currentPage === 1
              ? "border border-solid bg-gray-400 border-gray-400 rounded-md px-2 text-xs text-white"
              : "border border-solid border-gray-800 rounded-md px-2 text-black text-xs"
          }`}
        >
          <FaChevronLeft size={14} />
        </button>
        <div className="flex items-center gap-2">{renderPageNumbers()}</div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
          h-9 w-9 flex items-center justify-center ${
            currentPage === totalPages
              ? "border border-solid bg-gray-400 border-gray-400 rounded-md px-2 text-xs text-white"
              : "border border-solid border-gray-800 rounded-md px-2 text-black text-xs"
          }`}
        >
          <FaChevronRight size={14} />
        </button>
      </div>
    </ConditionNode>
  );
};
