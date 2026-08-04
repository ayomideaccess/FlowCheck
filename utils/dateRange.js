export const getDateRange = (period) => {
    const now = new Date();
    let start;
    let end = now;

    switch (period) {
        case 'daily':
            start = new Date(now);
            start.setHours(0, 0, 0, 0);
            break;
        case 'monthly':
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        default:
            return null;
    }

    return { start, end };
};