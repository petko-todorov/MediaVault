import { useDroppable } from '@dnd-kit/react';

export default function Droppable({ id, data, children, className = '' }) {
    const { ref, isDropTarget } = useDroppable({
        id,
        data,
    });

    return (
        <div
            ref={ref}
            className={`${className} ${isDropTarget ? 'ring-2 ring-sky-400' : ''}`.trim()}
        >
            {children}
        </div>
    );
}
