import { CONFIG } from './state.js';
import { extractVideoId, formatDate, lazyLoadThumbnails } from './utils.js';

export function renderVideos(videos, elements) {
    elements.videoGrid.innerHTML = '';
    
    if (videos.length === 0) {
        showNoResults(elements);
        return;
    }
    
    videos.forEach((video, index) => {
        const videoCard = createVideoCard(video, index);
        elements.videoGrid.appendChild(videoCard);
    });
    
    lazyLoadThumbnails();
}

function createVideoCard(video, index) {
    const card = document.createElement('div');
    card.className = 'video-card';
    
    const dateStr = formatDate(video.created_at || video.date);
    const videoId = video.video_id || extractVideoId(video.url);
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/${CONFIG.thumbnailQuality}.jpg`;
    const youtubeUrl = video.url || (videoId ? `https://youtu.be/${videoId}` : '#');
    
    card.innerHTML = `
        <div class="thumbnail-container">
            <div class="thumbnail-placeholder" data-src="${thumbnailUrl}" data-index="${index}">
                <i class="fab fa-youtube" style="font-size: 2rem; color: #666;"></i>
            </div>
            <div class="points-badge">
                <i class="fas fa-caret-up"></i> ${video.points || 0}
            </div>
        </div>
        <div class="video-info">
            <div class="video-title">
                <a href="${youtubeUrl}" target="_blank" title="${video.title}">${(video.title || 'Untitled Video').replace(/\[video\]/gi, '').trim()}</a>
            </div>
            <div class="meta-info">
                <div class="meta-item">
                    <i class="far fa-calendar"></i> ${dateStr}
                </div>
                <div class="meta-item">
                    <i class="fas fa-user"></i> ${video.author || 'Unknown'}
                </div>
                <div class="meta-item">
                    <i class="far fa-comment"></i> ${video.num_comments || 0}
                </div>
            </div>
            <div class="links">
                <a href="${youtubeUrl}" class="btn btn-primary" target="_blank">
                    <i class="fab fa-youtube"></i> Watch
                </a>
            </div>
        </div>
    `;
    
    return card;
}

function showNoResults(elements) {
    elements.videoGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 50px;">
            <i class="fas fa-video-slash fa-3x" style="color: #ccc; margin-bottom: 20px;"></i>
            <h3>No videos found</h3>
            <p>Try adjusting your filters to see more results</p>
            <button onclick="document.getElementById('resetFilters').click()" 
                    style="margin-top: 15px; padding: 10px 20px; background: var(--hn-orange); color: white; border: none; border-radius: 4px; cursor: pointer;">
                <i class="fas fa-redo"></i> Reset All Filters
            </button>
        </div>
    `;
}

export function updateResultsInfo(total, filtered, elements) {
    elements.resultCount.textContent = filtered.toLocaleString();
    
    let summary = '';
    const filters = [];
    
    if (STATE.currentFilters.title) {
        filters.push(`search: "${STATE.currentFilters.title}"`);
    }
    if (STATE.currentFilters.minPoints > 10) {
        filters.push(`min points: ${STATE.currentFilters.minPoints}+`);
    }
    if (STATE.currentFilters.dateFrom || STATE.currentFilters.dateTo) {
        const from = STATE.currentFilters.dateFrom ? new Date(STATE.currentFilters.dateFrom).toLocaleDateString() : 'any';
        const to = STATE.currentFilters.dateTo ? new Date(STATE.currentFilters.dateTo).toLocaleDateString() : 'any';
        filters.push(`date: ${from} to ${to}`);
    }
    
    if (filters.length === 0) {
        summary = 'Showing all videos';
    } else {
        summary = `Filtered by: ${filters.join(', ')}`;
    }
    
    if (filtered < total) {
        summary += ` (${filtered.toLocaleString()} of ${total.toLocaleString()} videos)`;
    }
    
    elements.filterSummary.textContent = summary;
}