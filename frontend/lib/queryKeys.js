export const moviesSeriesKeys = {
    all: ['moviesSeries'],
    moviesSeriesQuery: (q) => [...moviesSeriesKeys.all, q],
};

export const gamesKeys = {
    all: ['games'],
    gamesQuery: (q) => [...gamesKeys.all, q],
};

export const libraryKeys = {
    all: ['library'],
};

export const activityKeys = {
    all: ['activities'],
    list: (params) => [...activityKeys.all, params],
};

