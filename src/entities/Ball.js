import { Vector2D } from '../utils/Vector2D.js';
import { RGB } from '../utils/RGB.js';
import { Config } from '../utils/Config.js';

/**
 * Ball class for the physics simulation
 */
export class Ball {
    /**
     * Create a new ball
     * @param {Object} options - Ball configuration options
     * @param {number} options.id - Unique identifier
     * @param {number} options.x - Initial x position
     * @param {number} options.y - Initial y position
     * @param {number} [options.vx=0] - Initial x velocity
     * @param {number} [options.vy=0] - Initial y velocity
     * @param {number} [options.size=20] - Ball radius
     * @param {RGB|Object} [options.color] - Ball color
     * @param {number} [options.gravity=9.8] - Gravity force for this ball
     */
    constructor(options) {
        // Required properties
        this.id = options.id;
        
        // Position and movement
        this.position = new Vector2D(options.x, options.y);
        this.velocity = new Vector2D(options.vx || 0, options.vy || 0);
        this.acceleration = new Vector2D(0, 0);
        
        // Physical properties
        this.size = options.size || Config.visual.ball.defaultSize;
        
        // Handle color initialization
        if (options.color instanceof RGB) {
            this.color = options.color.clone();
        } else if (options.color) {
            this.color = new RGB(options.color.r, options.color.g, options.color.b);
        } else {
            this.color = new RGB(
                Config.visual.ball.defaultColor.r,
                Config.visual.ball.defaultColor.g,
                Config.visual.ball.defaultColor.b
            );
        }
        
        // Physics properties
        this.gravity = options.gravity !== undefined ? options.gravity : Config.visual.ball.defaultGravity;
        this.mass = this.size * this.size; // Mass proportional to area
        
        // State flags
        this.collisionList = []; // IDs of balls this can collide with
        this.isFrozen = false;
        this.isMulticolor = false;
        
        // Trail reference (will be set by TrailSystem if needed)
        this.trail = null;
    }

    /**
     * Update the ball's physics
     * @param {number} deltaTime - Time since last update in seconds
     */
    update(deltaTime) {
        if (this.isFrozen) return;

        // Apply gravity if enabled
        if (this.gravity !== 0) {
            this.acceleration.y = this.gravity;
        }

        // Verlet integration (more stable than Euler for physics simulations)
        // v = v + a * dt
        this.velocity.add(new Vector2D(
            this.acceleration.x * deltaTime,
            this.acceleration.y * deltaTime
        ));

        // Limit velocity to max allowed
        this.velocity.limit(Config.physics.limits.maxVelocity);

        // p = p + v * dt
        this.position.add(new Vector2D(
            this.velocity.x * deltaTime,
            this.velocity.y * deltaTime
        ));

        // Reset acceleration for next frame
        this.acceleration.set(0, 0);
    }

    /**
     * Apply a force to the ball
     * @param {Vector2D} force - The force vector to apply
     */
    applyForce(force) {
        // F = ma, so a = F/m
        const forceVector = force.clone();
        forceVector.divide(this.mass);
        this.acceleration.add(forceVector);
    }

    /**
     * Handle collision with another ball
     * @param {Ball} other - The other ball to collide with
     */
    handleCollision(other) {
        // This will be implemented fully in the physics phase
        // For now, just a placeholder
        console.log(`Ball ${this.id} collided with Ball ${other.id}`);
    }

    /**
     * Check if this ball is colliding with another ball
     * @param {Ball} other - The other ball to check
     * @returns {boolean} True if balls are colliding
     */
    isCollidingWith(other) {
        // Distance between centers
        const distance = this.position.distance(other.position);
        // Sum of radii
        const minDistance = this.size + other.size;
        // Collision if distance is less than sum of radii
        return distance < minDistance;
    }

    /**
     * Freeze the ball (stop all movement)
     */
    freeze() {
        this.isFrozen = true;
        this.velocity.set(0, 0);
        this.acceleration.set(0, a,0);
    }

    /**
     * Unfreeze the ball (allow movement again)
     */
    unfreeze() {
        this.isFrozen = false;
    }

    /**
     * Prepare the ball for removal from the simulation
     */
    destroy() {
        // This will be filled out more when we implement the memory manager
        this.collisionList = [];
        if (this.trail) {
            this.trail.clear();
            this.trail = null;
        }
    }
}