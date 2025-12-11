import { CONFIG, STATE, updateState } from './modules/state.js';
import { initializeFilters, applyFilters } from './modules/filters.js';
import { sortVideos } from './modules/sorting.js';
import { renderVideos, updateResultsInfo } from './modules/renderer.js';
import { updatePagination, getPaginatedVideos } from './modules/pagination.js';
import { setupEventListeners } from './modules/events.js';

class App {
    constructor() {
        this.elements = this.getDOMElements();
        this.initialize();
    }

    getDOMElements() {
        return {
            videoGrid: document.getElementById('videoGrid'),
            resultCount: document.getElementById('resultCount'),
            filterSummary: document.getElementById('filterSummary'),
            searchTitle: document.getElementById('searchTitle'),
            filterPoints: document.getElementById('filterPoints'),
            minPointsValue: document.getElementById('minPointsValue'),
            maxPointsValue: document.getElementById('maxPointsValue'),
            dateFrom: document.getElementById('dateFrom'),
            dateTo: document.getElementById('dateTo'),
            applyFilters: document.getElementById('applyFilters'),
            resetFilters: document.getElementById('resetFilters'),
            sortButtons: document.querySelectorAll('.sort-btn'),
            prevPage: document.getElementById('prevPage'),
            nextPage: document.getElementById('nextPage'),
            pageNumbers: document.getElementById('pageNumbers'),
            currentDate: document.getElementById('currentDate'),
            // Inline video player elements
            videoModal: document.getElementById('videoModal'),
            videoPlayer: document.getElementById('videoPlayer'),
            closeVideoModal: document.getElementById('closeVideoModal'),
            videoModalTitle: document.getElementById('videoModalTitle')
        };
    }

    initialize() {
        console.log("🚀 Initializing Hacker News YouTube Browser...");
        
        this.elements.currentDate.textContent = new Date().toLocaleDateString();
        
        if (!window.allVideos || window.allVideos.length === 0) {
            this.showErrorMessage("No video data loaded. Check data.js file.");
            return;
        }
        
        console.log(`✅ Loaded ${window.allVideos.length} videos from Hacker News`);
        
        initializeFilters(this.elements);
        setupEventListeners(this, this.elements);
        this.applyFiltersAndSort();
    }

    applyFiltersAndSort() {
        this.showLoading();
        
        setTimeout(() => {
            STATE.filteredVideos = applyFilters(window.allVideos, STATE.currentFilters);
            STATE.filteredVideos = sortVideos(STATE.filteredVideos, STATE.currentSort);
            
            const pageVideos = getPaginatedVideos(STATE.filteredVideos, STATE.currentPage, CONFIG.itemsPerPage);
            
            renderVideos(pageVideos, this.elements);
            updatePagination(STATE.filteredVideos.length, STATE.currentPage, this.elements);
            updateResultsInfo(window.allVideos.length, STATE.filteredVideos.length, this.elements);
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);
    }

    showLoading() {
        this.elements.videoGrid.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin fa-2x"></i>
                <p style="margin-top: 15px;">Applying filters...</p>
            </div>
        `;
    }

    showErrorMessage(message) {
        this.elements.videoGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 50px;">
                <i class="fas fa-exclamation-triangle fa-3x" style="color: #ff6600; margin-bottom: 20px;"></i>
                <h3>Data Loading Error</h3>
                <p style="margin: 20px 0; color: var(--text-secondary); max-width: 600px; margin-left: auto; margin-right: auto;">
                    ${message}
                </p>
                <button onclick="location.reload()" 
                        style="margin-top: 20px; padding: 12px 24px; background: var(--hn-orange); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                    <i class="fas fa-redo"></i> Reload Page
                </button>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});