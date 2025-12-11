export function extractVideoId(url) {
    if (!url) return 'dQw4w9WgXcQ';
    
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
        /youtu\.be\/([a-zA-Z0-9_-]{11})/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return 'dQw4w9WgXcQ';
}

export function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    } catch (e) {
        return 'Unknown date';
    }
}

export function lazyLoadThumbnails() {
    const placeholders = document.querySelectorAll('.thumbnail-placeholder');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const placeholder = entry.target;
                const img = document.createElement('img');
                img.className = 'thumbnail';
                img.src = placeholder.dataset.src;
                img.alt = '';
                img.onerror = function() {
                    this.src = 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg';
                };
                
                placeholder.parentNode.replaceChild(img, placeholder);
                observer.unobserve(placeholder);
            }
        });
    }, {
        rootMargin: '100px 0px',
        threshold: 0.1
    });
    
    placeholders.forEach(placeholder => {
        observer.observe(placeholder);
    });
}