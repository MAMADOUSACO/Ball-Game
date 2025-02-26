/**
 * Configuration constants for the physics engine
 */
export const Config = {
    /**
     * Physics configuration
     */
    physics: {
        deltaTime: {
            fixed: 1 / 60, // Fixed timestep for physics calculations (60 FPS)
            max: 0.1, // Maximum allowed delta time to prevent "tunneling"
            multiplicator: 1.0 // For slow-motion effects
        },
        collision: {
            precision: 2, // Collision detection precision
            maxIterations: 5, // Maximum collision resolution iterations
            quadtreeDepth: 5 // Depth of quadtree for spatial partitioning
        },
        limits: {
            maxVelocity: 500, // Maximum velocity magnitude
            maxAcceleration: 1000, // Maximum acceleration magnitude
            maxSize: 100, // Maximum ball size
            minSize: 5 // Minimum ball size
        }
    },

    /**
     * Visual configuration
     */
    visual: {
        background: {
            color: { r: 255, g: 255, b: 255 }, // White background
            pattern: "solid" // Solid background
        },
        ball: {
            defaultColor: { r: 50, g: 100, b: 200 }, // Default blue color
            defaultSize: 20, // Default radius in pixels
            defaultGravity: 9.8, // Default gravity for balls
            outlineWidth: 1 // Default outline width
        },
        container: {
            defaultColor: { r: 100, g: 100, b: 100 }, // Default gray color
            outlineWidth: 2, // Default outline width
            cutVisualization: true // Visualize cuts
        },
        trail: {
            maxLength: 20, // Maximum number of trail points
            maxPoints: 100, // Maximum points to store
            defaultOpacity: 0.5 // Default trail opacity
        },
        zone: {
            defaultOpacity: 0.3, // Default zone opacity
            highlightOnHover: true // Highlight zones on hover
        }
    },

    /**
     * Memory configuration
     */
    memory: {
        cleaning: {
            interval: 30000, // 30 seconds between cleanup cycles
            threshold: 0.8 // 80% memory threshold for forced cleanup
        },
        pooling: {
            initialSize: 100, // Initial pool size
            expansionRate: 1.5, // Expansion rate when pool is depleted
            maxSize: 1000 // Maximum pool size
        },
        limits: {
            maxBalls: 1000, // Maximum number of balls
            maxContainers: 50, // Maximum number of containers
            maxTrails: 100, // Maximum number of trails
            maxZones: 20 // Maximum number of zones
        }
    },

    /**
     * Performance tier configurations
     */
    performanceTiers: {
        low: {
            maxObjects: 100,
            collisionPrecision: 1,
            trailEnabled: false,
            visualEffects: "minimal"
        },
        medium: {
            maxObjects: 500,
            collisionPrecision: 2,
            trailEnabled: true,
            visualEffects: "standard"
        },
        high: {
            maxObjects: 1000,
            collisionPrecision: 3,
            trailEnabled: true,
            visualEffects: "maximum"
        }
    }
};