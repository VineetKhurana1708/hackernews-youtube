export const CONFIG = {
    itemsPerPage: 20,
    thumbnailQuality: 'mqdefault'
};

export const STATE = {
    filteredVideos: [],
    currentPage: 1,
    currentSort: 'random',
    currentFilters: {
        title: '',
        minPoints: 10,
        dateFrom: '',
        dateTo: ''
    }
};

export function updateState(updates) {
    Object.assign(STATE, updates);
}