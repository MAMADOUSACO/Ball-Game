/**
 * 2D Vector class for physics calculations
 * Handles vector operations needed for the physics simulation
 */
export class Vector2D {
    /**
     * Create a new Vector2D
     * @param {number} x - The x component
     * @param {number} y - The y component
     */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Create a copy of this vector
     * @returns {Vector2D} A new vector with the same components
     */
    clone() {
        return new Vector2D(this.x, this.y);
    }

    /**
     * Set the components of this vector
     * @param {number} x - The x component
     * @param {number} y - The y component
     * @returns {Vector2D} This vector for chaining
     */
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    /**
     * Add another vector to this one
     * @param {Vector2D} v - The vector to add
     * @returns {Vector2D} This vector for chaining
     */
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    /**
     * Subtract another vector from this one
     * @param {Vector2D} v - The vector to subtract
     * @returns {Vector2D} This vector for chaining
     */
    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    /**
     * Multiply this vector by a scalar
     * @param {number} scalar - The scalar to multiply by
     * @returns {Vector2D} This vector for chaining
     */
    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    /**
     * Divide this vector by a scalar
     * @param {number} scalar - The scalar to divide by
     * @returns {Vector2D} This vector for chaining
     * @throws {Error} If scalar is 0
     */
    divide(scalar) {
        if (scalar === 0) {
            throw new Error("Cannot divide vector by zero");
        }
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }

    /**
     * Get the magnitude (length) of this vector
     * @returns {number} The magnitude of the vector
     */
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Get the squared magnitude of this vector
     * (faster than magnitude as it avoids the square root)
     * @returns {number} The squared magnitude of the vector
     */
    magnitudeSquared() {
        return this.x * this.x + this.y * this.y;
    }

    /**
     * Normalize this vector (make it unit length)
     * @returns {Vector2D} This vector for chaining
     */
    normalize() {
        const mag = this.magnitude();
        if (mag > 0) {
            this.divide(mag);
        }
        return this;
    }

    /**
     * Calculate the dot product with another vector
     * @param {Vector2D} v - The vector to dot with
     * @returns {number} The dot product
     */
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    /**
     * Calculate the distance to another vector
     * @param {Vector2D} v - The vector to calculate distance to
     * @returns {number} The distance
     */
    distance(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Calculate the squared distance to another vector
     * (faster than distance as it avoids the square root)
     * @param {Vector2D} v - The vector to calculate squared distance to
     * @returns {number} The squared distance
     */
    distanceSquared(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return dx * dx + dy * dy;
    }

    /**
     * Limit the magnitude of this vector
     * @param {number} max - The maximum magnitude
     * @returns {Vector2D} This vector for chaining
     */
    limit(max) {
        const magSq = this.magnitudeSquared();
        if (magSq > max * max) {
            this.normalize().multiply(max);
        }
        return this;
    }

    /**
     * Create a new vector from angle and magnitude
     * @param {number} angle - The angle in radians
     * @param {number} magnitude - The magnitude of the vector
     * @returns {Vector2D} A new vector
     */
    static fromAngle(angle, magnitude = 1) {
        return new Vector2D(
            magnitude * Math.cos(angle),
            magnitude * Math.sin(angle)
        );
    }
}