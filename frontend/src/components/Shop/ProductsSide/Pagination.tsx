'use client'

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { VscChevronRight, VscChevronLeft } from "react-icons/vsc";

const Pagination: React.FC<any> = ({
  totalPages,
  currentPage,
}) => {
  const searchParams = useSearchParams();

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `/shop?${params.toString()}`;
  };

  const numOfPages = [];
  for (let i = 1; i <= totalPages; i++) {
    numOfPages.push(i);
  }

  return (
    <nav
      aria-label="Page navigation example"
      className="flex justify-center pt-10"
    >
      <ul className="flex gap-2.5">
        <li
          className={`${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Link
            href={buildPageUrl(currentPage === 1 ? 1 : currentPage - 1)}
            className="page-link min-w-8 h-8 text-sm text-gray-600 hover:text-white hover:bg-primary border border-gray-300 hover:border-primary rounded px-0 focus:shadow-none inline-flex items-center justify-center"
          >
            <VscChevronLeft className="text-lg w-8" />
          </Link>
        </li>
        {numOfPages.map((page, index) => (
          <li
            key={index}
            className={currentPage === page ? "active" : ""}
          >
            <Link
              href={buildPageUrl(page)}
              className={`min-w-8 h-8 text-sm border rounded px-0 transition-colors inline-flex items-center justify-center ${
                currentPage === page
                  ? "text-white bg-primary border-primary"
                  : "text-gray-600 border-gray-300 hover:text-white hover:bg-primary hover:border-primary"
              }`}
            >
              {page}
            </Link>
          </li>
        ))}
        <li
          className={`${
            currentPage === numOfPages.length
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <Link
            href={buildPageUrl(
              currentPage === numOfPages.length
                ? currentPage
                : currentPage + 1
            )}
            className="page-link min-w-8 h-8 text-sm text-gray-600 hover:text-white hover:bg-primary border border-gray-300 hover:border-primary rounded px-0 focus:shadow-none inline-flex items-center justify-center"
          >
            <VscChevronRight className="text-lg w-8" />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
