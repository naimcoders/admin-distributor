import { HiOutlineChevronRight, HiOutlineChevronLeft } from "react-icons/hi";
import { usePagination, PaginationItemType, Button } from "@nextui-org/react";
import { Fragment } from "react";

interface IPagination {
  page: number;
  prev?: () => void;
  next?: () => void;
  isNext?: boolean;
}

const Pagination: React.FC<IPagination> = ({ page, next, prev, isNext }) => {
  const { activePage, range, onNext, onPrevious } = usePagination({
    total: isNext ? page + 1 : page,
    showControls: true,
    page,
  });

  const newRange = range.filter(
    (f) => f === "prev" || f === "next" || f === activePage
  );

  const left = () => {
    if (!prev) return;
    prev();
    onPrevious();
  };

  const right = () => {
    if (!next) return;
    next();
    onNext();
  };

  return (
    <main>
      <ul className="flex gap-2 justify-end">
        {newRange.map((page) => (
          <Fragment key={page}>
            {page === PaginationItemType.PREV && (
              <Button
                isIconOnly
                color="secondary"
                aria-label="prev"
                onClick={left}
                isDisabled={activePage > 1 ? false : true}
                title="Previous"
                size="sm"
              >
                <HiOutlineChevronLeft width={16} color="#1E1E1E" />
              </Button>
            )}

            {activePage === page && (
              <Button
                isIconOnly
                color="secondary"
                aria-label="active page"
                className="text-[#27272A]"
                size="sm"
              >
                {page}
              </Button>
            )}

            {page === PaginationItemType.NEXT && (
              <Button
                isIconOnly
                color="secondary"
                aria-label="next"
                onClick={right}
                isDisabled={isNext ? false : true}
                title="Next"
                size="sm"
              >
                <HiOutlineChevronRight width={16} color="#1E1E1E" />
              </Button>
            )}
          </Fragment>
        ))}
      </ul>
    </main>
  );
};

export default Pagination;
