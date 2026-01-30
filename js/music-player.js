// Music Player with Playlist
class MusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.playlist = [];
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.isRepeat = false;
        this.isShuffle = false;

        this.init();
    }

    async init() {
        await this.loadPlaylist();
        this.createPlayerUI();
        this.attachEventListeners();
    }

    async loadPlaylist() {
        try {
            const response = await fetch('data/releases.json');
            const data = await response.json();

            // Extract all tracks from releases
            data.releases.forEach(release => {
                if (release.tracks && !release.upcoming) {
                    release.tracks.forEach(track => {
                        this.playlist.push({
                            title: track.title,
                            artist: release.artist,
                            album: release.title,
                            cover: release.coverImage,
                            duration: track.duration,
                            // In a real app, you'd have actual audio file URLs
                            audioUrl: `#` // Placeholder
                        });
                    });
                }
            });
        } catch (error) {
            console.error('Error loading playlist:', error);
        }
    }

    createPlayerUI() {
        const playerHTML = `
            <div class="music-player" id="music-player">
                <div class="player-track-info">
                    <img src="Octan Cover.png" alt="Album Art" class="player-album-art" id="player-album-art">
                    <div class="player-text">
                        <div class="player-track-title" id="player-track-title">Select a track</div>
                        <div class="player-artist" id="player-artist">Octan Records</div>
                    </div>
                </div>
                
                <div class="player-controls">
                    <button class="player-btn" id="player-prev" title="Previous">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="19 20 9 12 19 4 19 20"></polygon>
                            <line x1="5" y1="19" x2="5" y2="5"></line>
                        </svg>
                    </button>
                    
                    <button class="player-btn player-btn-play" id="player-play" title="Play">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" id="play-icon">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" id="pause-icon" style="display: none;">
                            <rect x="6" y="4" width="4" height="16"></rect>
                            <rect x="14" y="4" width="4" height="16"></rect>
                        </svg>
                    </button>
                    
                    <button class="player-btn" id="player-next" title="Next">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="5 4 15 12 5 20 5 4"></polygon>
                            <line x1="19" y1="5" x2="19" y2="19"></line>
                        </svg>
                    </button>
                </div>

                <div class="player-progress">
                    <span class="player-time" id="player-current-time">0:00</span>
                    <div class="player-progress-bar" id="player-progress-bar">
                        <div class="player-progress-fill" id="player-progress-fill"></div>
                    </div>
                    <span class="player-time" id="player-duration">0:00</span>
                </div>

                <div class="player-volume">
                    <button class="player-btn" id="player-volume-btn" title="Volume">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        </svg>
                    </button>
                    <input type="range" min="0" max="100" value="70" class="player-volume-slider" id="player-volume-slider">
                </div>

                <button class="player-btn player-playlist-btn" id="player-playlist-btn" title="Playlist">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                    </svg>
                </button>
            </div>

            <div class="playlist-modal" id="playlist-modal">
                <div class="playlist-content">
                    <div class="playlist-header">
                        <h3>Playlist</h3>
                        <button class="playlist-close" id="playlist-close">&times;</button>
                    </div>
                    <div class="playlist-items" id="playlist-items"></div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', playerHTML);
        this.renderPlaylist();
    }

    renderPlaylist() {
        const playlistContainer = document.getElementById('playlist-items');
        if (!playlistContainer) return;

        playlistContainer.innerHTML = this.playlist.map((track, index) => `
            <div class="playlist-item ${index === this.currentTrackIndex ? 'active' : ''}" data-index="${index}">
                <img src="${track.cover}" alt="${track.album}">
                <div class="playlist-item-info">
                    <div class="playlist-item-title">${track.title}</div>
                    <div class="playlist-item-artist">${track.artist}</div>
                </div>
                <div class="playlist-item-duration">${track.duration}</div>
            </div>
        `).join('');

        // Add click listeners to playlist items
        document.querySelectorAll('.playlist-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                this.loadTrack(index);
                this.play();
            });
        });
    }

    attachEventListeners() {
        const playBtn = document.getElementById('player-play');
        const prevBtn = document.getElementById('player-prev');
        const nextBtn = document.getElementById('player-next');
        const progressBar = document.getElementById('player-progress-bar');
        const volumeSlider = document.getElementById('player-volume-slider');
        const playlistBtn = document.getElementById('player-playlist-btn');
        const playlistModal = document.getElementById('playlist-modal');
        const playlistClose = document.getElementById('playlist-close');

        playBtn?.addEventListener('click', () => this.togglePlay());
        prevBtn?.addEventListener('click', () => this.previous());
        nextBtn?.addEventListener('click', () => this.next());

        progressBar?.addEventListener('click', (e) => this.seek(e));
        volumeSlider?.addEventListener('input', (e) => this.setVolume(e.target.value));

        playlistBtn?.addEventListener('click', () => playlistModal?.classList.add('active'));
        playlistClose?.addEventListener('click', () => playlistModal?.classList.remove('active'));
        playlistModal?.addEventListener('click', (e) => {
            if (e.target === playlistModal) playlistModal.classList.remove('active');
        });

        // Audio event listeners
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.next());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());

        // Set initial volume
        this.setVolume(70);
    }

    loadTrack(index) {
        if (index < 0 || index >= this.playlist.length) return;

        this.currentTrackIndex = index;
        const track = this.playlist[index];

        // Update UI
        document.getElementById('player-track-title').textContent = track.title;
        document.getElementById('player-artist').textContent = track.artist;
        document.getElementById('player-album-art').src = track.cover;

        // In a real app, load the actual audio file
        // this.audio.src = track.audioUrl;

        this.renderPlaylist();
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        // this.audio.play(); // Uncomment when you have actual audio files
        this.isPlaying = true;
        document.getElementById('play-icon').style.display = 'none';
        document.getElementById('pause-icon').style.display = 'block';
    }

    pause() {
        // this.audio.pause(); // Uncomment when you have actual audio files
        this.isPlaying = false;
        document.getElementById('play-icon').style.display = 'block';
        document.getElementById('pause-icon').style.display = 'none';
    }

    next() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.loadTrack(this.currentTrackIndex);
        if (this.isPlaying) this.play();
    }

    previous() {
        this.currentTrackIndex = this.currentTrackIndex - 1;
        if (this.currentTrackIndex < 0) this.currentTrackIndex = this.playlist.length - 1;
        this.loadTrack(this.currentTrackIndex);
        if (this.isPlaying) this.play();
    }

    seek(e) {
        const progressBar = document.getElementById('player-progress-bar');
        const clickX = e.offsetX;
        const width = progressBar.offsetWidth;
        const duration = this.audio.duration;

        this.audio.currentTime = (clickX / width) * duration;
    }

    setVolume(value) {
        this.audio.volume = value / 100;
    }

    updateProgress() {
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        document.getElementById('player-progress-fill').style.width = `${progress}%`;
        document.getElementById('player-current-time').textContent = this.formatTime(this.audio.currentTime);
    }

    updateDuration() {
        document.getElementById('player-duration').textContent = this.formatTime(this.audio.duration);
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize player when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.musicPlayer = new MusicPlayer();
    });
} else {
    window.musicPlayer = new MusicPlayer();
}
