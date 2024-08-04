import { DndContext, DragEndEvent, useDroppable } from '@dnd-kit/core'
import React from 'react'

const Canvas: React.FC = () => {
  const { setNodeRef } = useDroppable({ id: 'canvas' });

  const handleDragEnd = (event: DragEndEvent) => {
    console.log(event);
  };

  return (
    <div ref={setNodeRef} className="flex-grow bg-gray-900 p-4">
      <DndContext onDragEnd={handleDragEnd}>
        {/* Render draggable components here */}
      </DndContext>
    </div>
  );
};

export default Canvas;
