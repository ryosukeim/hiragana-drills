// Template matcher for evaluating writing accuracy
// Compares user's strokes against kana templates

export class TemplateMatcher {
    constructor() {
        // Templates are simplified representations of kana characters
        // In a production app, these would be more detailed
        this.templates = this.generateTemplates();
    }

    // Generate simplified templates for common kana
    // Each template is an array of strokes, each stroke is an array of normalized points
    generateTemplates() {
        // For MVP, we'll use a simplified scoring system
        // that focuses on overall shape rather than exact stroke matching
        return {};
    }

    // Main evaluation function
    evaluate(userStrokes, targetKana, expectedStrokeCount) {
        if (!userStrokes || userStrokes.length === 0) {
            return {
                score: 0,
                feedback: 'No drawing detected',
                details: {}
            };
        }

        // Normalize user strokes
        const normalizedStrokes = this.normalizeStrokeSet(userStrokes);

        // Calculate various metrics
        const strokeCountScore = this.scoreStrokeCount(userStrokes.length, expectedStrokeCount);
        const complexityScore = this.scoreComplexity(normalizedStrokes);
        const coverageScore = this.scoreCoverage(normalizedStrokes);

        // Weighted final score
        const finalScore = Math.round(
            strokeCountScore * 0.2 +
            complexityScore * 0.4 +
            coverageScore * 0.4
        );

        return {
            score: Math.max(0, Math.min(100, finalScore)),
            strokeCountScore,
            complexityScore,
            coverageScore,
            feedback: this.generateFeedback(finalScore),
            details: {
                strokeCount: userStrokes.length,
                expectedStrokeCount
            }
        };
    }

    // Normalize entire stroke set
    normalizeStrokeSet(strokes) {
        if (strokes.length === 0) return [];

        // Find bounding box
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        strokes.forEach(stroke => {
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

        if (scale === 0) return strokes;

        // Normalize to 0-1 range
        return strokes.map(stroke => {
            return stroke.map(point => ({
                x: (point.x - minX) / scale,
                y: (point.y - minY) / scale
            }));
        });
    }

    // Score stroke count (gentle for kids)
    scoreStrokeCount(actual, expected) {
        if (expected === 0) return 80; // Default if no expectation

        const diff = Math.abs(actual - expected);
        if (diff === 0) return 100;
        if (diff === 1) return 85;
        if (diff === 2) return 70;
        return 60;
    }

    // Score complexity (checks if drawing is not too simple)
    scoreComplexity(strokes) {
        let totalPoints = 0;
        let totalLength = 0;

        strokes.forEach(stroke => {
            totalPoints += stroke.length;

            // Calculate path length
            for (let i = 1; i < stroke.length; i++) {
                const dx = stroke[i].x - stroke[i - 1].x;
                const dy = stroke[i].y - stroke[i - 1].y;
                totalLength += Math.sqrt(dx * dx + dy * dy);
            }
        });

        // Good complexity: multiple strokes with reasonable length
        const avgLength = totalLength / strokes.length;

        if (avgLength < 0.1) return 40; // Too small
        if (avgLength < 0.3) return 70;
        if (avgLength < 0.8) return 95;
        return 85; // Very long strokes might be scribbles
    }

    // Score coverage (checks if drawing covers appropriate area)
    scoreCoverage(strokes) {
        if (strokes.length === 0) return 0;

        // Find bounding box in normalized coordinates
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        strokes.forEach(stroke => {
            stroke.forEach(point => {
                minX = Math.min(minX, point.x);
                minY = Math.min(minY, point.y);
                maxX = Math.max(maxX, point.x);
                maxY = Math.max(maxY, point.y);
            });
        });

        const coverage = (maxX - minX) * (maxY - minY);

        // Good coverage is between 0.3 and 0.9 of normalized space
        if (coverage < 0.1) return 40; // Too small
        if (coverage < 0.2) return 65;
        if (coverage < 0.4) return 85;
        if (coverage < 0.7) return 100;
        if (coverage < 0.9) return 95;
        return 75; // Too large, might be sloppy
    }

    // Generate encouraging feedback based on score
    generateFeedback(score) {
        if (score >= 90) return 'feedback_perfect';
        if (score >= 80) return 'feedback_excellent';
        if (score >= 70) return 'feedback_great';
        if (score >= 60) return 'feedback_good';
        if (score >= 40) return 'feedback_tryAgain';
        return 'feedback_keepPracticing';
    }

    // Calculate distance between two points
    distance(p1, p2) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

// Export singleton
export const templateMatcher = new TemplateMatcher();
