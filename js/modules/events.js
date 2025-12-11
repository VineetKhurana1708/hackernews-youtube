import { STATE, updateState } from './state.js';
import { updateFiltersFromUI, resetFilters } from './filters.js';

export function setupEventListeners(app, elements) {
    elements.applyFilters.addEventListener('click', () => {
        updateFiltersFromUI(elements);
        updateState({ currentPage: 1 });
        app.applyFiltersAndSort();
    });
    
    elements.resetFilters.addEventListener('click', () => {
        resetFilters(elements);
        updateState({ currentPage: 1 });
        app.applyFiltersAndSort();
    });
    
    elements.sortButtons.forEach(button => {
        button.addEventListener('click', () => {
            elements.sortButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateState({ currentSort: button.dataset.sort, currentPage: 1 });
            app.applyFiltersAndSort();
        });
    });
    
    elements.prevPage.addEventListener('click', () => {
        if (STATE.currentPage > 1) {
            updateState({ currentPage: STATE.currentPage - 1 });
            app.applyFiltersAndSort();
        }
    });
    
    elements.nextPage.addEventListener('click', () => {
        const totalPages = Math.ceil(STATE.filteredVideos.length / CONFIG.itemsPerPage);
        if (STATE.currentPage < totalPages) {
            updateState({ currentPage: STATE.currentPage + 1 });
            app.applyFiltersAndSort();
        }
    });
    
    elements.searchTitle.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            elements.applyFilters.click();
        }
    });
    
    elements.pageNumbers.addEventListener('click', (event) => {
        if (event.target.classList.contains('page-btn')) {
            const page = parseInt(event.target.textContent);
            if (page && page !== STATE.currentPage) {
                updateState({ currentPage: page });
                app.applyFiltersAndSort();
            }
        }
    });
}