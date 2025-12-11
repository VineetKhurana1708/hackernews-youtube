import { CONFIG, STATE, updateState } from './state.js';
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

    // -------------------------
    //   INLINE VIDEO PLAYER
    // -------------------------

    elements.videoGrid.addEventListener('click', (event) => {
        const clickable = event.target.closest('.thumbnail-container, .video-title-link');
        if (!clickable) return;

        event.preventDefault();

        const videoId = clickable.dataset.videoId;
        const title = clickable.dataset.videoTitle || '';
        if (!videoId) return;

        if (!elements.videoModal || !elements.videoPlayer) {
            window.open(`https://youtu.be/${videoId}`, '_blank');
            return;
        }

        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        elements.videoPlayer.src = embedUrl;

        if (elements.videoModalTitle) {
            elements.videoModalTitle.textContent = title;
        }

        elements.videoModal.classList.add('is-visible');
        elements.videoModal.setAttribute('aria-hidden', 'false');
    });

    function closeVideoModal() {
        if (!elements.videoModal || !elements.videoPlayer) return;
        elements.videoModal.classList.remove('is-visible');
        elements.videoModal.setAttribute('aria-hidden', 'true');
        elements.videoPlayer.src = '';
    }

    if (elements.closeVideoModal) {
        elements.closeVideoModal.addEventListener('click', () => {
            closeVideoModal();
        });
    }

    if (elements.videoModal) {
        elements.videoModal.addEventListener('click', (event) => {
            if (
                event.target.classList.contains('video-modal') ||
                event.target.classList.contains('video-modal-backdrop')
            ) {
                closeVideoModal();
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && elements.videoModal?.classList.contains('is-visible')) {
            closeVideoModal();
        }
    });
}
