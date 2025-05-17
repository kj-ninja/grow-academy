import React, { ReactElement, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
/**
 * @dependencies: react-intersection-observer and cn libraries
 */

interface InfiniteScrollListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => ReactElement;
  onFetchMore: () => void;
  /**
   * A function that extracts a unique key for each data item. This key is used for rendering list items in React.
   * @param item - The data item.
   * @returns A string representing the unique key for the item.
   */
  keyExtractor: (item: T) => string;
  isLoading: boolean;
  hasNextPage: boolean;
  loader?: ReactElement | null;
  /**
   * Additional classes to be applied to the container element.
   */
  className?: string;
}

/**
 * Usage example:
 *
 * <InfiniteScrollList
 *   data={potatoList}
 *   renderItem={(potato) => (
 *     <PotatoCard
 *       key={potato.id}
 *       potato={potato}
 *       onPotatoClick={() => navigate(`/potato/${potato.handle}`)}
 *     />
 *   )}
 *   onFetchMore={() => fetchNextPage()}
 *   keyExtractor={(potato) => potato.id.toString()}
 *   isLoading={isFetchingNextPage}
 *   hasNextPage={hasNextPage}
 * />
 */

export function InfiniteScrollList<T>({
  data,
  renderItem,
  onFetchMore,
  keyExtractor,
  isLoading,
  hasNextPage,
  loader,
  className,
}: InfiniteScrollListProps<T>) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      onFetchMore();
    }
  }, [inView, onFetchMore, hasNextPage]);

  return (
    <>
      <div className={cn("flex flex-col gap-4", className)}>
        {data.map((item, index) => {
          const key = keyExtractor(item);
          return <React.Fragment key={key}>{renderItem(item, index)}</React.Fragment>;
        })}
        {data.length > 0 && <div ref={ref} style={{ height: 1 }} />}
      </div>
      {isLoading && loader}
    </>
  );
}
