import React from "react";
import { VscChevronRight, VscChevronLeft } from "react-icons/vsc";

const Pagination: React.FC<any> = ({
  pages,
  setCurrentPage,
  currentPage,
}) => {
  const numOfPages = [];

  // getting number of the pages
  for (let i = 1; i <= pages; i++) {
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
          <button
            className="page-link min-w-8 h-8 text-sm text-gray-600 hover:text-white hover:bg-primary border border-gray-300 hover:border-primary rounded px-0 focus:shadow-none"
            onClick={() =>
              setCurrentPage(currentPage === 1 ? currentPage : currentPage - 1)
            }
            disabled={currentPage === 1}
          >
            <VscChevronLeft className="text-lg w-8" />
          </button>
        </li>
        {numOfPages.map((page, index) => (
          <li
            key={index}
            className={currentPage === page ? "active" : ""}
          >
            <button
              className={`min-w-8 h-8 text-sm border rounded px-0 transition-colors ${
                currentPage === page
                  ? "text-white bg-primary border-primary"
                  : "text-gray-600 border-gray-300 hover:text-white hover:bg-primary hover:border-primary"
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          </li>
        ))}
        <li
          className={`${
            currentPage === numOfPages.length
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <button
            className="page-link min-w-8 h-8 text-sm text-gray-600 hover:text-white hover:bg-primary border border-gray-300 hover:border-primary rounded px-0 focus:shadow-none"
            onClick={() =>
              setCurrentPage(
                currentPage === numOfPages.length
                  ? currentPage
                  : currentPage + 1
              )
            }
            disabled={currentPage === numOfPages.length}
          >
            <VscChevronRight className="text-lg w-8" />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
