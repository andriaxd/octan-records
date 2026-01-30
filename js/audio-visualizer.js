// Audio Visualizer
class AudioVisualizer {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.bufferLength = null;
        this.animationId = null;
        this.isActive = false;

        this.init();
    }

    init() {
        this.createCanvas();
        this.createToggleButton();
    }

    createCanvas() {
        const canvasHTML = `
            <canvas id="audio-visualizer" class="audio-visualizer"></canvas>
        `;

        // Insert into music player if it exists
        const player = document.getElementById('music-player');
        if (player) {
            player.insertAdjacentHTML('afterbegin', canvasHTML);
            this.canvas = document.getElementById('audio-visualizer');
            this.ctx = this.canvas.getContext('2d');
            this.resizeCanvas();

            window.addEventListener('resize', () => this.resizeCanvas());
        }
    }

    createToggleButton() {
        const btnHTML = `
            <button class="visualizer-toggle" id="visualizer-toggle" title="Toggle Visualizer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18V5l12-2v13"></path>
                    <circle cx="6" cy="18" r="3"></circle>
                    <circle cx="18" cy="16" r="3"></circle>
                </svg>
            </button>
        `;

        const player = document.getElementById('music-player');
        if (player) {
            player.insertAdjacentHTML('beforeend', btnHTML);
            document.getElementById('visualizer-toggle')?.addEventListener('click', () => this.toggle());
        }
    }

    resizeCanvas() {
        if (!this.canvas) return;
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    async setupAudioContext(audioElement) {
        if (this.audioContext) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;

            const source = this.audioContext.createMediaElementSource(audioElement);
            source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);

            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
        } catch (error) {
            console.error('Error setting up audio context:', error);
        }
    }

    toggle() {
        if (this.isActive) {
            this.stop();
        } else {
            this.start();
        }
    }

    start() {
        if (!this.canvas) return;

        this.isActive = true;
        this.canvas.classList.add('active');
        this.visualize();
    }

    stop() {
        this.isActive = false;
        if (this.canvas) this.canvas.classList.remove('active');
        if (this.animationId) cancelAnimationFrame(this.animationId);
        if (this.ctx) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    visualize() {
        if (!this.isActive || !this.analyser) {
            return;
        }

        this.animationId = requestAnimationFrame(() => this.visualize());

        this.analyser.getByteFrequencyData(this.dataArray);

        this.ctx.fillStyle = 'rgba(13, 13, 13, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const barWidth = (this.canvas.width / this.bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < this.bufferLength; i++) {
            barHeight = (this.dataArray[i] / 255) * this.canvas.height * 0.8;

            const hue = (i / this.bufferLength) * 60 + 180; // Blue to cyan range
            this.ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;

            this.ctx.fillRect(
                x,
                this.canvas.height - barHeight,
                barWidth,
                barHeight
            );

            x += barWidth + 1;
        }
    }

    // Alternative waveform visualization
    visualizeWaveform() {
        if (!this.isActive || !this.analyser) return;

        this.animationId = requestAnimationFrame(() => this.visualizeWaveform());

        this.analyser.getByteTimeDomainData(this.dataArray);

        this.ctx.fillStyle = 'rgba(13, 13, 13, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#6cf';
        this.ctx.beginPath();

        const sliceWidth = this.canvas.width / this.bufferLength;
        let x = 0;

        for (let i = 0; i < this.bufferLength; i++) {
            const v = this.dataArray[i] / 128.0;
            const y = (v * this.canvas.height) / 2;

            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
        this.ctx.stroke();
    }
}

// Initialize visualizer when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.audioVisualizer = new AudioVisualizer();
    });
} else {
    window.audioVisualizer = new AudioVisualizer();
}
