export function sortVideos(videos, sortType) {
    const sortFunctions = {
        'date-desc': (a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date),
        'date-asc': (a, b) => new Date(a.created_at || a.date) - new Date(b.created_at || b.date),
        'points-desc': (a, b) => (b.points || 0) - (a.points || 0),
        'points-asc': (a, b) => (a.points || 0) - (b.points || 0),
        'comments-desc': (a, b) => (b.num_comments || 0) - (a.num_comments || 0),
        'comments-asc': (a, b) => (a.num_comments || 0) - (b.num_comments || 0),
        'random': () => Math.random() - 0.5
    };
    
    return [...videos].sort(sortFunctions[sortType] || sortFunctions['date-desc']);
}