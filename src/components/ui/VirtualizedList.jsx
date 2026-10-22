import React, { useRef, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import PropTypes from 'prop-types';

/**
 * iOS-compatible VirtualizedList component
 * Replaces react-virtualized AutoSizer + List with modern, performant solution
 */
const VirtualizedList = ({
  items = [],
  renderItem,
  itemHeight = 50,
  height = 250,
  overscan = 5,
  onScroll,
  className = '',
  ...props
}) => {
  const parentRef = useRef(null);

  // Create virtualizer instance with iOS optimizations
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan,
  });

  // Handle scroll events for infinite loading
  useEffect(() => {
    if (onScroll && parentRef.current) {
      const handleScroll = (e) => {
        const target = e.target;
        onScroll({
          scrollTop: target.scrollTop,
          scrollHeight: target.scrollHeight,
          clientHeight: target.clientHeight,
        });
      };

      const element = parentRef.current;
      element.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
        element.removeEventListener('scroll', handleScroll);
      };
    }
  }, [onScroll]);

  return (
    <div
      ref={parentRef}
      className={`ios-scroll-container ${className}`}
      style={{
        height: `${height}px`,
        overflow: 'auto',
        // iOS-specific optimizations
        WebkitOverflowScrolling: 'touch',
        touchAction: 'pan-y',
        willChange: 'scroll-position',
      }}
      {...props}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem({
              index: virtualItem.index,
              style: { width: '100%', height: '100%' },
              item: items[virtualItem.index],
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

VirtualizedList.propTypes = {
  items: PropTypes.array.isRequired,
  renderItem: PropTypes.func.isRequired,
  itemHeight: PropTypes.number,
  height: PropTypes.number,
  overscan: PropTypes.number,
  onScroll: PropTypes.func,
  className: PropTypes.string,
};

export default VirtualizedList;