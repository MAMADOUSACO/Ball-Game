import { Vector2D } from '../utils/Vector2D.js';
import { Quadtree } from '../utils/Quadtree.js';
import { Config } from '../utils/Config.js';

/**
 * Physics system that handles collision detection and resolution
 */
export class PhysicsSystem {
    /**
     * Create a new physics system
     */
    constructor() {
        this.quadtree = null;
        this.collisionPairs = [];
    }
    
    /**
     * Update the physics for all entities
     * @param {Ball[]} balls - Array of all balls in the simulation
     * @param {number} deltaTime - Time since last update in seconds
     * @param {Object} dimensions - Canvas dimensions {width, height}
     */
    update(balls, deltaTime, dimensions) {
        if (balls.length <= 1) return; // Need at least 2 balls for collisions
        
        // Update quadtree
        this.updateQuadtree(balls, dimensions);
        
        // Generate collision pairs
        this.generateCollisionPairs(balls);
        
        // Resolve collisions
        this.resolveCollisions(deltaTime);
    }
    
    /**
     * Update the quadtree with current ball positions
     * @param {Ball[]} balls - Array of all balls
     * @param {Object} dimensions - Canvas dimensions {width, height}
     */
    updateQuadtree(balls, dimensions) {
        // If we had implemented Quadtree fully, we would use it here for
        // spatial partitioning and efficient collision detection.
        
        // For this implementation, we'll use a simple O(n²) approach
        // where we check every ball against every other ball
    }
    
    /**
     * Generate potential collision pairs between balls
     * @param {Ball[]} balls - Array of all balls
     */
    generateCollisionPairs(balls) {
        this.collisionPairs = [];
        
        // Check each ball against every other ball
        // This is O(n²) but works well for small numbers of balls
        for (let i = 0; i < balls.length; i++) {
            const ballA = balls[i];
            
            if (ballA.isFrozen) continue; // Skip frozen balls
            
            for (let j = i + 1; j < balls.length; j++) {
                const ballB = balls[j];
                
                // Skip if both balls are frozen
                if (ballB.isFrozen) continue;
                
                // Check if the balls are colliding
                if (this.areColliding(ballA, ballB)) {
                    this.collisionPairs.push([ballA, ballB]);
                }
            }
        }
    }
    
    /**
     * Check if two balls are colliding
     * @param {Ball} ballA - First ball
     * @param {Ball} ballB - Second ball
     * @returns {boolean} True if balls are colliding
     */
    areColliding(ballA, ballB) {
        // Distance between centers
        const distance = ballA.position.distance(ballB.position);
        // Sum of radii
        const minDistance = ballA.size + ballB.size;
        // Collision if distance is less than sum of radii
        return distance < minDistance;
    }
    
    /**
     * Resolve all detected collisions
     * @param {number} deltaTime - Time since last update in seconds
     */
    resolveCollisions(deltaTime) {
        // Process each collision pair
        for (const [ballA, ballB] of this.collisionPairs) {
            this.resolveCollision(ballA, ballB, deltaTime);
        }
    }
    
    /**
     * Resolve a collision between two balls
     * @param {Ball} ballA - First ball
     * @param {Ball} ballB - Second ball
     * @param {number} deltaTime - Time since last update in seconds
     */
    resolveCollision(ballA, ballB, deltaTime) {
        // Vector from A to B
        const normal = new Vector2D(
            ballB.position.x - ballA.position.x,
            ballB.position.y - ballA.position.y
        );
        
        // Distance between centers
        const distance = normal.magnitude();
        
        // If balls are exactly overlapping (rare case), give them a nudge
        if (distance === 0) {
            normal.set(1, 0);
        } else {
            // Normalize the normal vector
            normal.normalize();
        }
        
        // Calculate overlap
        const overlap = (ballA.size + ballB.size) - distance;
        
        // Separation vector - move balls apart proportionally to their masses
        const totalMass = ballA.mass + ballB.mass;
        const ratioA = ballB.mass / totalMass;
        const ratioB = ballA.mass / totalMass;
        
        // Separate the balls to avoid sticking
        if (!ballA.isFrozen) {
            ballA.position.subtract(normal.clone().multiply(overlap * ratioA));
        }
        
        if (!ballB.isFrozen) {
            ballB.position.add(normal.clone().multiply(overlap * ratioB));
        }
        
        // Skip velocity changes if both balls are frozen
        if (ballA.isFrozen && ballB.isFrozen) return;
        
        // Calculate relative velocity
        const relativeVelocity = new Vector2D(
            ballB.velocity.x - ballA.velocity.x,
            ballB.velocity.y - ballA.velocity.y
        );
        
        // Calculate relative velocity along the normal
        const velocityAlongNormal = relativeVelocity.dot(normal);
        
        // Do not resolve if balls are moving away from each other
        if (velocityAlongNormal > 0) return;
        
        // Calculate restitution (bounciness)
        const restitution = 0.8; // Could be derived from ball properties
        
        // Calculate impulse scalar
        let j = -(1 + restitution) * velocityAlongNormal;
        j /= (1 / ballA.mass) + (1 / ballB.mass);
        
        // Apply impulse
        const impulse = normal.clone().multiply(j);
        
        if (!ballA.isFrozen) {
            ballA.velocity.subtract(impulse.clone().divide(ballA.mass));
        }
        
        if (!ballB.isFrozen) {
            ballB.velocity.add(impulse.clone().divide(ballB.mass));
        }
        
        // Apply friction (tangential component)
        const friction = 0.05; // Friction coefficient
        
        // Calculate tangent vector (perpendicular to normal)
        const tangent = new Vector2D(-normal.y, normal.x);
        
        // Calculate relative velocity along tangent
        const velocityAlongTangent = relativeVelocity.dot(tangent);
        
        // Calculate tangential impulse
        let jt = -velocityAlongTangent * friction;
        jt /= (1 / ballA.mass) + (1 / ballB.mass);
        
        // Apply tangential impulse
        const tangentImpulse = tangent.clone().multiply(jt);
        
        if (!ballA.isFrozen) {
            ballA.velocity.subtract(tangentImpulse.clone().divide(ballA.mass));
        }
        
        if (!ballB.isFrozen) {
            ballB.velocity.add(tangentImpulse.clone().divide(ballB.mass));
        }
    }
}