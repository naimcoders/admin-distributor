import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { usePagination, PaginationItemType, Button } from "@nextui-org/react";

interface IPagination {
  page: number;
  isNext?: boolean;
}

const Pagination: React.FC<IPagination> = ({ page, isNext }) => {
  const { activePage, range, onNext, onPrevious } = usePagination({
    total: isNext ? page + 1 : page,
    showControls: true,
  });

  const newRange = range.filter(
    (f) => f === "prev" || f === "next" || f === activePage
  );

  return (
    <main>
      <ul className="flex gap-2 justify-center">
        {newRange.map((page) => (
          <div key={page}>
            {page === PaginationItemType.PREV && (
              <Button
                isIconOnly
                color="default"
                aria-label="prev"
                onClick={onPrevious}
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
                onClick={onNext}
                isDisabled={isNext ? false : true}
                title="Next"
              >
                <ChevronRightIcon width={16} color="#1E1E1E" />
              </Button>
            )}
          </div>
        ))}
      </ul>
    </main>
  );
};

export default Pagination;
