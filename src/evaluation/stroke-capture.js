// Stroke capture for canvas writing
// Captures pointer events and converts to normalized stroke data

export class StrokeCapture {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.isDrawing = false;
        this.currentStroke = [];
        this.strokes = [];

        this.setupCanvas();
        this.attachEvents();
    }

    setupCanvas() {
        // Set canvas size
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        // Drawing style
        this.ctx.lineWidth = 4;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.strokeStyle = '#ffffff';
    }

    attachEvents() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.startStroke(e));
        this.canvas.addEventListener('mousemove', (e) => this.continueStroke(e));
        this.canvas.addEventListener('mouseup', () => this.endStroke());
        this.canvas.addEventListener('mouseleave', () => this.endStroke());

        // Touch events
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startStroke(e.touches[0]);
        });
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.continueStroke(e.touches[0]);
        });
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.endStroke();
        });
    }

    getCoords(event) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            timestamp: Date.now()
        };
    }

    startStroke(event) {
        this.isDrawing = true;
        const coords = this.getCoords(event);
        this.currentStroke = [coords];

        this.ctx.beginPath();
        this.ctx.moveTo(coords.x, coords.y);
    }

    continueStroke(event) {
        if (!this.isDrawing) return;

        const coords = this.getCoords(event);
        this.currentStroke.push(coords);

        this.ctx.lineTo(coords.x, coords.y);
        this.ctx.stroke();
    }

    endStroke() {
        if (!this.isDrawing) return;
        this.isDrawing = false;

        if (this.currentStroke.length > 2) {
            this.strokes.push([...this.currentStroke]);
        }
        this.currentStroke = [];
    }

    clear() {
        const rect = this.canvas.getBoundingClientRect();
        this.ctx.clearRect(0, 0, rect.width, rect.height);
        this.strokes = [];
        this.currentStroke = [];
    }

    getStrokes() {
        return this.strokes;
    }

    // Draw a guide (for trace mode)
    drawGuide(kanaChar) {
        this.ctx.save();
        this.ctx.font = '200px "Kiwi Maru", sans-serif';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        const rect = this.canvas.getBoundingClientRect();
        this.ctx.fillText(kanaChar, rect.width / 2, rect.height / 2);
        this.ctx.restore();
    }

    // Normalize strokes to standard coordinates
    normalizeStrokes() {
        if (this.strokes.length === 0) return [];

        // Find bounding box
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        this.strokes.forEach(stroke => {
            stroke.forEach(point => {
                minX = Math.min(minX, point.x);
                minY = Math.min(minY, point.y);
                maxX = Math.max(maxX, point.x);
                maxY = Math.max(maxY, point.y);
            });
        });

        const width = maxX - minX;
        const height = maxY - minY;
        const scale = Math.max(width, height);

        if (scale === 0) return [];

        // Normalize to 0-1 range, centered
        return this.strokes.map(stroke => {
            return stroke.map(point => ({
                x: (point.x - minX) / scale,
                y: (point.y - minY) / scale
            }));
        });
    }

    // Smooth strokes using moving average
    smoothStrokes(strokes, windowSize = 3) {
        return strokes.map(stroke => {
            if (stroke.length < windowSize) return stroke;

            const smoothed = [];
            for (let i = 0; i < stroke.length; i++) {
                const start = Math.max(0, i - Math.floor(windowSize / 2));
                const end = Math.min(stroke.length, i + Math.ceil(windowSize / 2));
                const window = stroke.slice(start, end);

                const avgX = window.reduce((sum, p) => sum + p.x, 0) / window.length;
                const avgY = window.reduce((sum, p) => sum + p.y, 0) / window.length;

                smoothed.push({ x: avgX, y: avgY });
            }
            return smoothed;
        });
    }

    // Resample stroke to fixed number of points
    resampleStroke(stroke, numPoints = 32) {
        if (stroke.length === 0) return [];
        if (stroke.length === 1) return stroke;

        // Calculate total path length
        let totalLength = 0;
        for (let i = 1; i < stroke.length; i++) {
            const dx = stroke[i].x - stroke[i - 1].x;
            const dy = stroke[i].y - stroke[i - 1].y;
            totalLength += Math.sqrt(dx * dx + dy * dy);
        }

        if (totalLength === 0) return [stroke[0]];

        const segmentLength = totalLength / (numPoints - 1);
        const resampled = [stroke[0]];
        let accumulatedLength = 0;

        for (let i = 1; i < stroke.length; i++) {
            const dx = stroke[i].x - stroke[i - 1].x;
            const dy = stroke[i].y - stroke[i - 1].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            accumulatedLength += dist;

            while (accumulatedLength >= segmentLength && resampled.length < numPoints) {
                const t = (accumulatedLength - segmentLength) / dist;
                const newPoint = {
                    x: stroke[i].x - t * dx,
                    y: stroke[i].y - t * dy
                };
                resampled.push(newPoint);
                accumulatedLength -= segmentLength;
            }
        }

        // Ensure we have exactly numPoints
        while (resampled.length < numPoints) {
            resampled.push(stroke[stroke.length - 1]);
        }

        return resampled.slice(0, numPoints);
    }
}
