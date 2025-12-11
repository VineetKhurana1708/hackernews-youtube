import { STATE } from './state.js';

export function initializeFilters(elements) {
    elements.filterPoints.addEventListener('input', function() {
        const val = this.value;
        elements.minPointsValue.textContent = val;
        STATE.currentFilters.minPoints = Number(val);
    });
    

    const jan2010 = new Date('2010-01-01');
    elements.dateFrom.valueAsDate = jan2010;
    elements.dateTo.valueAsDate = new Date();

    
    STATE.currentFilters.dateFrom = elements.dateFrom.value;
    STATE.currentFilters.dateTo = elements.dateTo.value;
}

export function applyFilters(videos, filters) {
    return videos.filter(video => {
        if (filters.title) {
            const title = (video.title || '').toLowerCase();
            const searchTerm = filters.title.toLowerCase();
            if (!title.includes(searchTerm)) return false;
        }
        
        if ((video.points || 0) < filters.minPoints) {
            return false;
        }
        
        try {
            const videoDate = new Date(video.created_at || video.date);
            
            if (filters.dateFrom) {
                const fromDate = new Date(filters.dateFrom);
                fromDate.setHours(0, 0, 0, 0);
                if (videoDate < fromDate) return false;
            }
            
            if (filters.dateTo) {
                const toDate = new Date(filters.dateTo);
                toDate.setHours(23, 59, 59, 999);
                if (videoDate > toDate) return false;
            }
        } catch (e) {
            console.warn("Error parsing date for video:", video);
        }
        
        return true;
    });
}

export function updateFiltersFromUI(elements) {
    STATE.currentFilters.title = elements.searchTitle.value.trim();
    STATE.currentFilters.dateFrom = elements.dateFrom.value;
    STATE.currentFilters.dateTo = elements.dateTo.value;
}

export function resetFilters(elements) {
    elements.searchTitle.value = '';
    elements.filterPoints.value = 10;
    elements.minPointsValue.textContent = '10';
    
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    elements.dateFrom.valueAsDate = sixMonthsAgo;
    elements.dateTo.valueAsDate = new Date();
    
    STATE.currentFilters = {
        title: '',
        minPoints: 10,
        dateFrom: elements.dateFrom.value,
        dateTo: elements.dateTo.value
    };
}