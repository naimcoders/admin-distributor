import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
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
  });

  const newRange = range.filter(
    (f) => f === "prev" || f === "next" || f === activePage
  );

  const left = () => {
    if (!prev) return null;
    prev();
    onPrevious();
  };

  const right = () => {
    if (!next) return null;
    next();
    onNext();
  };

  return (
    <main>
      <ul className="flex gap-2 justify-center">
        {newRange.map((page) => (
          <Fragment key={page}>
            {page === PaginationItemType.PREV && (
              <Button
                isIconOnly
                color="default"
                aria-label="prev"
                onClick={left}
                isDisabled={activePage > 1 ? false : true}
                title="Previous"
              >
                <ChevronLeftIcon width={16} color="#1E1E1E" />
              </Button>
            )}

            {activePage === page && (
              <Button
                isIconOnly
                color="default"
                aria-label="active page"
                className="font-interMedium"
                variant="shadow"
              >
                {activePage}
              </Button>
            )}

            {page === PaginationItemType.NEXT && (
              <Button
                isIconOnly
                color="default"
                aria-label="next"
                onClick={right}
                isDisabled={isNext ? false : true}
                title="Next"
              >
                <ChevronRightIcon width={16} color="#1E1E1E" />
              </Button>
            )}
          </Fragment>
        ))}
      </ul>
    </main>
  );
};

export default Pagination;
