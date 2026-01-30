// Search Functionality
class SearchEngine {
    constructor() {
        this.searchData = {
            artists: [],
            releases: [],
            posts: []
        };
        this.init();
    }

    async init() {
        await this.loadSearchData();
        this.createSearchUI();
        this.attachEventListeners();
    }

    async loadSearchData() {
        try {
            const [artistsRes, releasesRes, postsRes] = await Promise.all([
                fetch('data/artists.json'),
                fetch('data/releases.json'),
                fetch('data/blog-posts.json')
            ]);

            const artistsData = await artistsRes.json();
            const releasesData = await releasesRes.json();
            const postsData = await postsRes.json();

            this.searchData.artists = artistsData.artists;
            this.searchData.releases = releasesData.releases;
            this.searchData.posts = postsData.posts;
        } catch (error) {
            console.error('Error loading search data:', error);
        }
    }

    createSearchUI() {
        const searchHTML = `
            <div class="search-container" id="search-container">
                <button class="search-trigger" id="search-trigger" title="Search">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                </button>
            </div>

            <div class="search-modal" id="search-modal">
                <div class="search-modal-content">
                    <div class="search-input-wrapper">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                        <input type="text" id="search-input" placeholder="Search artists, releases, or posts..." autocomplete="off">
                        <button class="search-close" id="search-close">&times;</button>
                    </div>
                    <div class="search-results" id="search-results"></div>
                </div>
            </div>
        `;

        const header = document.querySelector('header');
        if (header) {
            header.insertAdjacentHTML('beforeend', searchHTML);
        }
    }

    attachEventListeners() {
        const searchTrigger = document.getElementById('search-trigger');
        const searchModal = document.getElementById('search-modal');
        const searchClose = document.getElementById('search-close');
        const searchInput = document.getElementById('search-input');

        searchTrigger?.addEventListener('click', () => this.openSearch());
        searchClose?.addEventListener('click', () => this.closeSearch());
        searchModal?.addEventListener('click', (e) => {
            if (e.target === searchModal) this.closeSearch();
        });

        searchInput?.addEventListener('input', (e) => this.search(e.target.value));

        // Keyboard shortcut: Ctrl/Cmd + K
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearch();
            }
            if (e.key === 'Escape') {
                this.closeSearch();
            }
        });
    }

    openSearch() {
        const modal = document.getElementById('search-modal');
        const input = document.getElementById('search-input');
        modal?.classList.add('active');
        input?.focus();
    }

    closeSearch() {
        const modal = document.getElementById('search-modal');
        const input = document.getElementById('search-input');
        modal?.classList.remove('active');
        input.value = '';
        this.clearResults();
    }

    search(query) {
        if (!query || query.length < 2) {
            this.clearResults();
            return;
        }

        const results = {
            artists: this.searchArtists(query),
            releases: this.searchReleases(query),
            posts: this.searchPosts(query)
        };

        this.displayResults(results);
    }

    searchArtists(query) {
        return this.searchData.artists.filter(artist =>
            artist.name.toLowerCase().includes(query.toLowerCase()) ||
            artist.bio.toLowerCase().includes(query.toLowerCase()) ||
            artist.genre.some(g => g.toLowerCase().includes(query.toLowerCase()))
        );
    }

    searchReleases(query) {
        return this.searchData.releases.filter(release =>
            release.title.toLowerCase().includes(query.toLowerCase()) ||
            release.artist.toLowerCase().includes(query.toLowerCase()) ||
            release.genre.some(g => g.toLowerCase().includes(query.toLowerCase()))
        );
    }

    searchPosts(query) {
        return this.searchData.posts.filter(post =>
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
            post.category.toLowerCase().includes(query.toLowerCase())
        );
    }

    displayResults(results) {
        const resultsContainer = document.getElementById('search-results');
        if (!resultsContainer) return;

        let html = '';

        if (results.artists.length > 0) {
            html += '<div class="search-category"><h4>Artists</h4>';
            results.artists.forEach(artist => {
                html += `
                    <a href="artists/${artist.slug}.html" class="search-result-item">
                        <img src="${artist.image}" alt="${artist.name}">
                        <div>
                            <div class="search-result-title">${artist.name}</div>
                            <div class="search-result-subtitle">${artist.genre.join(', ')}</div>
                        </div>
                    </a>
                `;
            });
            html += '</div>';
        }

        if (results.releases.length > 0) {
            html += '<div class="search-category"><h4>Releases</h4>';
            results.releases.forEach(release => {
                html += `
                    <a href="#releases" class="search-result-item">
                        <img src="${release.coverImage}" alt="${release.title}">
                        <div>
                            <div class="search-result-title">${release.title}</div>
                            <div class="search-result-subtitle">${release.artist}</div>
                        </div>
                    </a>
                `;
            });
            html += '</div>';
        }

        if (results.posts.length > 0) {
            html += '<div class="search-category"><h4>Blog Posts</h4>';
            results.posts.forEach(post => {
                html += `
                    <a href="blog.html#${post.slug}" class="search-result-item">
                        <div>
                            <div class="search-result-title">${post.title}</div>
                            <div class="search-result-subtitle">${post.category} • ${post.date}</div>
                        </div>
                    </a>
                `;
            });
            html += '</div>';
        }

        if (html === '') {
            html = '<div class="search-no-results">No results found</div>';
        }

        resultsContainer.innerHTML = html;
    }

    clearResults() {
        const resultsContainer = document.getElementById('search-results');
        if (resultsContainer) resultsContainer.innerHTML = '';
    }
}

// Initialize search when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.searchEngine = new SearchEngine();
    });
} else {
    window.searchEngine = new SearchEngine();
}
