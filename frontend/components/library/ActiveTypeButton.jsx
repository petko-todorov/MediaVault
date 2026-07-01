export default function ActiveTypeButton({
    activeType,
    setActiveType,
    buttonText,
    type
}) {
    return (
        <button
            className={`px-4 py-2 rounded-lg ${
                activeType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-gray-400'
            }`}
            onClick={() => setActiveType(type)}
        >
            {buttonText}
        </button>
    );
}
