import { RenderingSystem } from './RenderingSystem.js';
import { Ball } from '../entities/Ball.js';
import { Config } from '../utils/Config.js';
import { RGB } from '../utils/RGB.js';

/**
 * Main engine class that controls the simulation
 */
export class Engine {
    /**
     * Create a new physics engine
     * @param {HTMLCanvasElement} canvas - Canvas element to render to
     */
    constructor(canvas) {
        // Systems
        this.renderingSystem = new RenderingSystem(canvas);
        
        // Entity collections
        this.balls = [];
        this.nextBallId = 1;
        
        // Simulation state
        this.isPaused = false;
        this.performanceTier = 'medium';
        this.lastUpdateTime = 0;
        
        // Animation frame reference
        this.animationFrameId = null;
    }

    /**
     * Initialize the engine
     */
    init() {
        // Start the animation loop
        this.lastUpdateTime = performance.now();
        this.animationFrame();
        
        console.log('Ball Physics Engine initialized');
    }

    /**
     * Main animation loop
     */
    animationFrame() {
        const currentTime = performance.now();
        let deltaTime = (currentTime - this.lastUpdateTime) / 1000; // Convert to seconds
        
        // Cap delta time to prevent large jumps
        deltaTime = Math.min(deltaTime, Config.physics.deltaTime.max);
        
        this.update(deltaTime);
        this.render();
        
        this.lastUpdateTime = currentTime;
        this.animationFrameId = requestAnimationFrame(() => this.animationFrame());
    }

    /**
     * Update the simulation
     * @param {number} deltaTime - Time since last update in seconds
     */
    update(deltaTime) {
        if (this.isPaused) return;
        
        // Update all balls
        this.balls.forEach(ball => ball.update(deltaTime));
        
        // Basic boundary checks (keep balls within canvas)
        const dimensions = this.renderingSystem.getCanvasDimensions();
        this.balls.forEach(ball => {
            // Check X boundaries
            if (ball.position.x - ball.size < 0) {
                ball.position.x = ball.size;
                ball.velocity.x = -ball.velocity.x * 0.8; // Bounce with energy loss
            } else if (ball.position.x + ball.size > dimensions.width) {
                ball.position.x = dimensions.width - ball.size;
                ball.velocity.x = -ball.velocity.x * 0.8; // Bounce with energy loss
            }
            
            // Check Y boundaries
            if (ball.position.y - ball.size < 0) {
                ball.position.y = ball.size;
                ball.velocity.y = -ball.velocity.y * 0.8; // Bounce with energy loss
            } else if (ball.position.y + ball.size > dimensions.height) {
                ball.position.y = dimensions.height - ball.size;
                ball.velocity.y = -ball.velocity.y * 0.8; // Bounce with energy loss
            }
        });
    }

    /**
     * Render the current state
     */
    render() {
        this.renderingSystem.beginFrame();
        this.renderingSystem.renderBalls(this.balls);
        this.renderingSystem.endFrame();
    }

    /**
     * Add a new ball to the simulation
     * @param {Object} options - Ball configuration
     * @returns {Ball} The newly created ball
     */
    addBall(options = {}) {
        // Set default position if not provided
        const dimensions = this.renderingSystem.getCanvasDimensions();
        if (options.x === undefined) {
            options.x = Math.random() * dimensions.width;
        }
        if (options.y === undefined) {
            options.y = Math.random() * dimensions.height;
        }
        
        // Ensure ID is set
        options.id = this.nextBallId++;
        
        // Create and add the ball
        const ball = new Ball(options);
        this.balls.push(ball);
        
        return ball;
    }

    /**
     * Remove a ball from the simulation
     * @param {number} ballId - The ID of the ball to remove
     * @returns {boolean} True if the ball was found and removed
     */
    removeBall(ballId) {
        const index = this.balls.findIndex(ball => ball.id === ballId);
        if (index !== -1) {
            this.balls[index].destroy();
            this.balls.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Clear all balls from the simulation
     */
    clearAllBalls() {
        this.balls.forEach(ball => ball.destroy());
        this.balls = [];
    }

    /**
     * Pause the simulation
     */
    pause() {
        this.isPaused = true;
    }

    /**
     * Resume the simulation
     */
    resume() {
        this.isPaused = false;
    }

    /**
     * Toggle simulation pause state
     */
    togglePause() {
        this.isPaused = !this.isPaused;
    }

    /**
     * Set the performance tier
     * @param {string} tier - Performance tier ('low', 'medium', or 'high')
     */
    setPerformanceTier(tier) {
        if (Config.performanceTiers[tier]) {
            this.performanceTier = tier;
            console.log(`Performance tier set to ${tier}`);
        } else {
            console.error(`Invalid performance tier: ${tier}`);
        }
    }

    /**
     * Get current engine statistics
     * @returns {Object} Object containing current engine statistics
     */
    getStats() {
        return {
            ballCount: this.balls.length,
            fps: this.renderingSystem.getFPS(),
            isPaused: this.isPaused,
            performanceTier: this.performanceTier
        };
    }
}