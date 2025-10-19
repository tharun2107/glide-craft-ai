import React, { useState, useRef, useEffect } from 'react';

interface DraggableResizableProps {
  children: React.ReactNode;
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number };
  onDragStop?: (position: { x: number; y: number }) => void;
  onResizeStop?: (size: { width: number; height: number }, position: { x: number; y: number }) => void;
  selected?: boolean;
  onSelect?: () => void;
  bounds?: 'parent' | HTMLElement;
}

export const DraggableResizable: React.FC<DraggableResizableProps> = ({
  children,
  initialPosition,
  initialSize,
  onDragStop,
  onResizeStop,
  selected = false,
  onSelect,
  bounds = 'parent',
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const elementRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0, elementX: 0, elementY: 0 });
  const resizeStartPos = useRef({ x: 0, y: 0, width: 0, height: 0, elementX: 0, elementY: 0 });

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition.x, initialPosition.y]);

  useEffect(() => {
    setSize(initialSize);
  }, [initialSize.width, initialSize.height]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('resize-handle')) {
      return;
    }
    
    e.stopPropagation();
    setIsDragging(true);
    onSelect?.();
    
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      elementX: position.x,
      elementY: position.y,
    };
  };

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    onSelect?.();
    
    resizeStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      elementX: position.x,
      elementY: position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStartPos.current.x;
        const deltaY = e.clientY - dragStartPos.current.y;
        
        let newX = dragStartPos.current.elementX + deltaX;
        let newY = dragStartPos.current.elementY + deltaY;

        // Bounds checking
        if (bounds === 'parent' && elementRef.current?.parentElement) {
          const parent = elementRef.current.parentElement;
          const parentRect = parent.getBoundingClientRect();
          
          newX = Math.max(0, Math.min(newX, parentRect.width - size.width));
          newY = Math.max(0, Math.min(newY, parentRect.height - size.height));
        }
        
        setPosition({ x: newX, y: newY });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStartPos.current.x;
        const deltaY = e.clientY - resizeStartPos.current.y;
        
        let newWidth = size.width;
        let newHeight = size.height;
        let newX = position.x;
        let newY = position.y;

        if (resizeDirection.includes('e')) {
          newWidth = Math.max(50, resizeStartPos.current.width + deltaX);
        }
        if (resizeDirection.includes('s')) {
          newHeight = Math.max(30, resizeStartPos.current.height + deltaY);
        }
        if (resizeDirection.includes('w')) {
          newWidth = Math.max(50, resizeStartPos.current.width - deltaX);
          newX = resizeStartPos.current.elementX + deltaX;
        }
        if (resizeDirection.includes('n')) {
          newHeight = Math.max(30, resizeStartPos.current.height - deltaY);
          newY = resizeStartPos.current.elementY + deltaY;
        }

        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        onDragStop?.(position);
      }
      if (isResizing) {
        setIsResizing(false);
        onResizeStop?.(size, position);
      }
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, position, size, onDragStop, onResizeStop]);

  return (
    <div
      ref={elementRef}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        transition: isDragging || isResizing ? 'none' : 'box-shadow 0.2s',
        zIndex: selected ? 1000 : 1,
      }}
      className={`${selected ? 'ring-2 ring-primary shadow-lg' : ''} ${isDragging ? 'shadow-2xl' : ''}`}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
    >
      {children}
      
      {selected && (
        <>
          {/* Corner handles */}
          <div
            className="resize-handle absolute -top-1 -left-1 w-3 h-3 bg-primary rounded-full cursor-nw-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
          />
          <div
            className="resize-handle absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full cursor-ne-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
          />
          <div
            className="resize-handle absolute -bottom-1 -left-1 w-3 h-3 bg-primary rounded-full cursor-sw-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
          />
          <div
            className="resize-handle absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full cursor-se-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
          />
          
          {/* Edge handles */}
          <div
            className="resize-handle absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full cursor-n-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'n')}
          />
          <div
            className="resize-handle absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full cursor-s-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 's')}
          />
          <div
            className="resize-handle absolute top-1/2 -translate-y-1/2 -left-1 w-3 h-3 bg-primary rounded-full cursor-w-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'w')}
          />
          <div
            className="resize-handle absolute top-1/2 -translate-y-1/2 -right-1 w-3 h-3 bg-primary rounded-full cursor-e-resize"
            onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
          />
        </>
      )}
    </div>
  );
};
