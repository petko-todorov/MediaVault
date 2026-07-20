import { useDraggable } from '@dnd-kit/react';

export default function Draggable({ id, data, children, className = '' }) {
    const { ref, isDragging } = useDraggable({
        id,
        data,
    });

    return (
        <div
            ref={ref}
            className={`${className} ${isDragging ? 'opacity-60' : ''}`.trim()}
        >
            {children}
        </div>
    );
}
