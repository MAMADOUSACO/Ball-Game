/**
 * Quadtree for efficient spatial partitioning
 */
export class Quadtree {
    /**
     * Create a new quadtree
     * @param {Object} bounds - The bounds of this quadtree {x, y, width, height}
     * @param {number} capacity - Maximum number of objects before subdivision
     * @param {number} maxDepth - Maximum depth of the tree
     * @param {number} depth - Current depth of this node (for internal use)
     */
    constructor(bounds, capacity = 8, maxDepth = 5, depth = 0) {
        this.bounds = bounds;
        this.capacity = capacity;
        this.maxDepth = maxDepth;
        this.depth = depth;
        this.objects = [];
        this.divided = false;
        this.children = [];
    }

    /**
     * Subdivide this quadtree into four children
     */
    subdivide() {
        const x = this.bounds.x;
        const y = this.bounds.y;
        const halfWidth = this.bounds.width / 2;
        const halfHeight = this.bounds.height / 2;
        const nextDepth = this.depth + 1;

        // Northeast
        this.children[0] = new Quadtree(
            {
                x: x + halfWidth,
                y: y,
                width: halfWidth,
                height: halfHeight
            },
            this.capacity,
            this.maxDepth,
            nextDepth
        );

        // Northwest
        this.children[1] = new Quadtree(
            {
                x: x,
                y: y,
                width: halfWidth,
                height: halfHeight
            },
            this.capacity,
            this.maxDepth,
            nextDepth
        );

        // Southwest
        this.children[2] = new Quadtree(
            {
                x: x,
                y: y + halfHeight,
                width: halfWidth,
                height: halfHeight
            },
            this.capacity,
            this.maxDepth,
            nextDepth
        );

        // Southeast
        this.children[3] = new Quadtree(
            {
                x: x + halfWidth,
                y: y + halfHeight,
                width: halfWidth,
                height: halfHeight
            },
            this.capacity,
            this.maxDepth,
            nextDepth
        );

        this.divided = true;

        // Redistribute existing objects to children
        for (const object of this.objects) {
            this.insertToChildren(object);
        }
        
        // Clear this node's objects as they've been distributed to children
        this.objects = [];
    }

    /**
     * Insert an object to the appropriate child node
     * @param {Object} object - The object to insert, must have position and size properties
     */
    insertToChildren(object) {
        for (const child of this.children) {
            if (child.contains(object)) {
                child.insert(object);
            }
        }
    }

    /**
     * Check if this quadtree contains an object
     * @param {Object} object - The object to check, must have position and size properties
     * @returns {boolean} True if the object is contained within this quadtree's bounds
     */
    contains(object) {
        return (
            object.position.x - object.size >= this.bounds.x &&
            object.position.x + object.size <= this.bounds.x + this.bounds.width &&
            object.position.y - object.size >= this.bounds.y &&
            object.position.y + object.size <= this.bounds.y + this.bounds.height
        );
    }

    /**
     * Check if this quadtree intersects with an object
     * @param {Object} object - The object to check, must have position and size properties
     * @returns {boolean} True if the object intersects this quadtree's bounds
     */
    intersects(object) {
        return !(
            object.position.x - object.size > this.bounds.x + this.bounds.width ||
            object.position.x + object.size < this.bounds.x ||
            object.position.y - object.size > this.bounds.y + this.bounds.height ||
            object.position.y + object.size < this.bounds.y
        );
    }

    /**
     * Insert an object into the quadtree
     * @param {Object} object - The object to insert, must have position and size properties
     * @returns {boolean} True if the object was inserted
     */
    insert(object) {
        // If object doesn't intersect with this quadtree, don't insert
        if (!this.intersects(object)) {
            return false;
        }

        // If this node has room and is a leaf, add it here
        if (!this.divided && this.objects.length < this.capacity) {
            this.objects.push(object);
            return true;
        }

        // If we've reached max depth, force into this node
        if (this.depth >= this.maxDepth) {
            this.objects.push(object);
            return true;
        }

        // Otherwise, subdivide if needed and add to appropriate children
        if (!this.divided) {
            this.subdivide();
        }

        // Insert to children (may be added to multiple children if on boundary)
        return this.insertToChildren(object);
    }

    /**
     * Query objects that may intersect with the given object
     * @param {Object} object - The query object, must have position and size properties
     * @param {Array} found - Array to populate with found objects (for internal use)
     * @returns {Array} Array of objects that may intersect with the query object
     */
    query(object, found = []) {
        // If object doesn't intersect with this quadtree, return empty
        if (!this.intersects(object)) {
            return found;
        }

        // Add objects from this node
        for (const current of this.objects) {
            if (current !== object) { // Don't check object against itself
                found.push(current);
            }
        }

        // If this node is subdivided, check children
        if (this.divided) {
            for (const child of this.children) {
                child.query(object, found);
            }
        }

        return found;
    }

    /**
     * Clear all objects from the quadtree
     */
    clear() {
        this.objects = [];
        
        if (this.divided) {
            for (const child of this.children) {
                child.clear();
            }
            this.children = [];
            this.divided = false;
        }
    }
}