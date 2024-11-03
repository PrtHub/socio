import { useEffect, useState } from "react";

type ChatScrollProps = {
  topRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  count: number;
};

export const useChatScroll = ({
  topRef,
  bottomRef,
  shouldLoadMore,
  loadMore,
  count,
}: ChatScrollProps) => {
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const topDiv = topRef?.current;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      setIsScrolling(true);

      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
        const scrollTop = topDiv?.scrollTop;

        if (scrollTop === 0 && shouldLoadMore) {
          loadMore();
        }
      }, 150);
    };

    if (topDiv) {
      topDiv.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (topDiv) {
        topDiv.removeEventListener("scroll", handleScroll);
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }
      }
    };
  }, [loadMore, shouldLoadMore, topRef]);

  useEffect(() => {
    const bottomDiv = bottomRef?.current;
    const topDiv = topRef?.current;

    const shouldAutoScroll = () => {
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true);
        return true;
      }

      if (!topDiv) return false;

      const distFromBottom =
        topDiv.scrollHeight - (topDiv.scrollTop + topDiv.clientHeight);
      
      return distFromBottom <= 100 && !isScrolling;
    };

    if (bottomDiv && shouldAutoScroll()) {
      requestAnimationFrame(() => {
        bottomDiv.scrollIntoView({ 
          behavior: count === 0 ? 'auto' : 'smooth',
          block: 'end'
        });
      });
    }
  }, [bottomRef, topRef, hasInitialized, count, isScrolling]);
};
