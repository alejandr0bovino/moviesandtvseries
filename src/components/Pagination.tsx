import React from 'react';
import ButtonArrow from '@/components/ui/button-arrow';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  loading,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12 mb-8">
      {currentPage === 1 || loading ? (
        <ButtonArrow direction="left" text="Previous" disabled />
      ) : (
        <ButtonArrow direction="left" text="Previous" onClick={() => onPageChange(currentPage - 1)} />
      )}

      <span className="text-gray-700 font-medium mx-4">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage === totalPages || loading ? (
        <ButtonArrow direction="right" text="Next" disabled />

      ) : (
        <ButtonArrow direction="right" text="Next" onClick={() => onPageChange(currentPage + 1)} />
      )}
    </div>
  );
};

export default Pagination;