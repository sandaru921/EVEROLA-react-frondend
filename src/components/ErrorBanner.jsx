export const ErrorBanner = ({message = 'Default text', onClose }) => {
    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{message}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer text-red-700 text-xl font-bold"
                  onClick={onClose}>
                ×
            </span>
        </div>
    );
}