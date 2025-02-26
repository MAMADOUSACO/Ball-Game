import { RGB } from '../utils/RGB.js';
import { Config } from '../utils/Config.js';

/**
 * Handles all rendering operations for the simulation
 */
export class RenderingSystem {
    /**
     * Create a new rendering system
     * @param {HTMLCanvasElement} canvas - The canvas element to render to
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        
        // Set up canvas to use full screen
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Tracking for performance
        this.frameCount = 0;
        this.lastFpsUpdate = 0;
        this.currentFps = 0;
        
        // Background configuration
        this.backgroundColor = new RGB(
            Config.visual.background.color.r,
            Config.visual.background.color.g,
            Config.visual.background.color.b
        );
    }

    /**
     * Resize the canvas to fill its container
     */
    resizeCanvas() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
    }

    /**
     * Clear the canvas
     */
    clear() {
        this.context.fillStyle = this.backgroundColor.toString();
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Begin a new frame
     */
    beginFrame() {
        this.clear();
        
        // Calculate FPS
        const now = performance.now();
        this.frameCount++;
        
        // Update FPS every second
        if (now - this.lastFpsUpdate > 1000) {
            this.currentFps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
            this.lastFpsUpdate = now;
            this.frameCount = 0;
        }
    }

    /**
     * End the current frame
     */
    endFrame() {
        // Render FPS counter
        this.context.fillStyle = 'black';
        this.context.font = '12px Arial';
        this.context.fillText(`FPS: ${this.currentFps}`, 10, 20);
    }

    /**
     * Render a ball
     * @param {Ball} ball - The ball to render
     */
    renderBall(ball) {
        this.context.beginPath();
        this.context.arc(
            ball.position.x,
            ball.position.y,
            ball.size,
            0,
            Math.PI * 2
        );
        
        // Fill the ball
        this.context.fillStyle = ball.color.toString();
        this.context.fill();
        
        // Draw outline
        this.context.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        this.context.lineWidth = Config.visual.ball.outlineWidth;
        this.context.stroke();
        
        // Draw direction indicator (small line showing velocity)
        if (!ball.isFrozen && (ball.velocity.x !== 0 || ball.velocity.y !== 0)) {
            const velocityMag = ball.velocity.magnitude();
            if (velocityMag > 5) {
                const normalizedVel = ball.velocity.clone().normalize();
                this.context.beginPath();
                this.context.moveTo(ball.position.x, ball.position.y);
                this.context.lineTo(
                    ball.position.x + normalizedVel.x * ball.size,
                    ball.position.y + normalizedVel.y * ball.size
                );
                this.context.strokeStyle = 'rgba(0, 0, 0, 0.5)';
                this.context.lineWidth = 2;
                this.context.stroke();
            }
        }
    }

    /**
     * Render all balls in the simulation
     * @param {Ball[]} balls - Array of balls to render
     */
    renderBalls(balls) {
        balls.forEach(ball => this.renderBall(ball));
    }

    /**
     * Get the current FPS
     * @returns {number} The current frames per second
     */
    getFPS() {
        return this.currentFps;
    }

    /**
     * Get canvas dimensions
     * @returns {Object} Object with width and height properties
     */
    getCanvasDimensions() {
        return {
            width: this.canvas.width,
            height: this.canvas.height
        };
    }
}