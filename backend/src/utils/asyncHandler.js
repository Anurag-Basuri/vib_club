const asyncHandler = fn => {
    // Early validation during middleware setup
    if (typeof fn !== 'function') {
        throw new TypeError('asyncHandler requires a function argument');
    }

    return (req, res, next) => {
        // Handle both async functions and synchronous errors
        Promise.resolve(fn(req, res, next))
            .catch(error => {
                // Preserve existing HTTP status or default to 500
                if (!error.statusCode) {
                    error.statusCode = 500;
                }
                next(error);
            });
    };
};

export { asyncHandler };