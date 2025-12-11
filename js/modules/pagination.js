import { STATE } from './state.js';

export function getPaginatedVideos(videos, page, itemsPerPage) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return videos.slice(start, end);
}

export function updatePagination(totalItems, currentPage, elements) {
    const totalPages = Math.ceil(totalItems / CONFIG.itemsPerPage);
    
    elements.prevPage.disabled = currentPage === 1;
    elements.nextPage.disabled = currentPage === totalPages;
    
    elements.pageNumbers.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    const pages = [];
    
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        pages.push(1);
        
        if (currentPage > 3) pages.push('...');
        
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        
        if (currentPage < totalPages - 2) pages.push('...');
        pages.push(totalPages);
    }
    
    pages.forEach(page => {
        if (page === '...') {
            const span = document.createElement('span');
            span.textContent = '...';
            span.style.padding = '8px 12px';
            span.style.color = 'var(--text-secondary)';
            elements.pageNumbers.appendChild(span);
        } else {
            const button = document.createElement('button');
            button.className = `page-btn ${page === currentPage ? 'active' : ''}`;
            button.textContent = page;
            button.addEventListener('click', () => {
                STATE.currentPage = page;
                return true;
            });
            elements.pageNumbers.appendChild(button);
        }
    });
}