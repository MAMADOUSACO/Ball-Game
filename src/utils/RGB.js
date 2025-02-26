/**
 * RGB Color class for color management
 */
export class RGB {
    /**
     * Create a new RGB color
     * @param {number} r - Red component (0-255)
     * @param {number} g - Green component (0-255)
     * @param {number} b - Blue component (0-255)
     */
    constructor(r = 0, g = 0, b = 0) {
        this.r = this.clamp(r);
        this.g = this.clamp(g);
        this.b = this.clamp(b);
    }

    /**
     * Clamp a value between 0 and 255
     * @param {number} value - The value to clamp
     * @returns {number} The clamped value
     */
    clamp(value) {
        return Math.max(0, Math.min(255, Math.round(value)));
    }

    /**
     * Set the RGB components
     * @param {number} r - Red component (0-255)
     * @param {number} g - Green component (0-255)
     * @param {number} b - Blue component (0-255)
     * @returns {RGB} This color for chaining
     */
    set(r, g, b) {
        this.r = this.clamp(r);
        this.g = this.clamp(g);
        this.b = this.clamp(b);
        return this;
    }

    /**
     * Create a copy of this color
     * @returns {RGB} A new RGB with the same components
     */
    clone() {
        return new RGB(this.r, this.g, this.b);
    }

    /**
     * Convert to CSS color string
     * @returns {string} CSS RGB string
     */
    toString() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

    /**
     * Convert to CSS color string with alpha
     * @param {number} alpha - Alpha value (0-1)
     * @returns {string} CSS RGBA string
     */
    toRGBA(alpha = 1) {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${alpha})`;
    }

    /**
     * Interpolate between this color and another
     * @param {RGB} color - Target color
     * @param {number} t - Interpolation factor (0-1)
     * @returns {RGB} This color for chaining
     */
    lerp(color, t) {
        t = Math.max(0, Math.min(1, t));
        this.r = this.clamp(this.r + (color.r - this.r) * t);
        this.g = this.clamp(this.g + (color.g - this.g) * t);
        this.b = this.clamp(this.b + (color.b - this.b) * t);
        return this;
    }

    /**
     * Create a random RGB color
     * @returns {RGB} A new random color
     */
    static random() {
        return new RGB(
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256)
        );
    }

    /**
     * Create common colors
     */
    static get RED() { return new RGB(255, 0, 0); }
    static get GREEN() { return new RGB(0, 255, 0); }
    static get BLUE() { return new RGB(0, 0, 255); }
    static get WHITE() { return new RGB(255, 255, 255); }
    static get BLACK() { return new RGB(0, 0, 0); }
    static get YELLOW() { return new RGB(255, 255, 0); }
    static get CYAN() { return new RGB(0, 255, 255); }
    static get MAGENTA() { return new RGB(255, 0, 255); }
    static get ORANGE() { return new RGB(255, 165, 0); }
    static get PURPLE() { return new RGB(128, 0, 128); }
}