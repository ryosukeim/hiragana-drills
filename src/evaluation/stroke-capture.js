// Stroke capture for canvas writing
// Captures pointer events and converts to normalized stroke data

import allHiragana from '../data/allHiragana.json';

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

        // 1. Draw the character using Klee One (User Requirement)
        this.ctx.font = '200px "Klee One", sans-serif';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        const rect = this.canvas.getBoundingClientRect();
        // Use logic coordinates since context is scaled
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        this.ctx.fillText(kanaChar, centerX, centerY);

        // 2. Overlay numbers using SVG data (if available)
        try {
            const charCode = kanaChar.charCodeAt(0);
            if (Array.isArray(allHiragana)) {
                const charData = allHiragana.find(c => c.charCode === charCode);

                if (charData && charData.medians) {
                    // Map 1024 SVG units to 200px Font space
                    // We assume the font's 200px roughly corresponds to the 1024px EM square of the SVG
                    // But fonts usually have padding. 
                    // Let's approximate: 200px font usually fills about 0.8-0.9 of the em box visually?
                    // Standard scaling: targetSize / sourceSize
                    const fontSize = 200;
                    const svgSize = 1024;
                    const scale = fontSize / svgSize;

                    // We need to translate SVG (0,0 is top-left) to Canvas (Center is center)
                    // SVG Center is (512, 512).

                    // Draw numbers
                    this.ctx.font = '24px "Fredoka", sans-serif';
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';

                    charData.medians.forEach((median, index) => {
                        if (median.value && median.value.length > 0) {
                            const startPoint = median.value[0];
                            // transform from SVG space to Canvas space relative to center
                            // x' = (x - 512) * scale + centerX
                            // y' = (y - 512) * scale + centerY
                            // Note: We might need a slight vertical adjust because textBaseline 'middle' isn't exact center of em box for all fonts, but it's close.

                            // Adjusting scale slightly up because Klee One is a bit wide? 
                            // Let's stick to 1.0 relation first.

                            const x = (startPoint[0] - 512) * scale + centerX;
                            // Adding a small vertical offset (e.g. +10) often helps align with visual center of font
                            const y = (startPoint[1] - 512) * scale + centerY + 10;

                            // Draw circle background for number
                            this.ctx.beginPath();
                            this.ctx.arc(x, y, 14, 0, Math.PI * 2);
                            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                            this.ctx.fill();

                            // Draw number
                            this.ctx.fillStyle = '#1a0b2e';
                            this.ctx.fillText((index + 1).toString(), x, y + 1);
                        }
                    });
                }
            }
        } catch (e) {
            console.error('Error drawing numbers:', e);
        }

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
