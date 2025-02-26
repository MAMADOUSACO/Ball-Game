# Ball-Game
A code that allows the user through use of API to easily generate their own "satisfying ball simulation".

# Project documentation
**Ball Physics Simulation Engine Generation Prompt :**
Generate a complete ball physics simulation engine that runs in a web browser using JavaScript and Canvas. The code should be extensively commented, include error handling, and be optimized for performance.
## Core requirements
1. Create all code necessary to run the simulation engine 
2. Implement a class-based architecture 
3. Include thorough error handling and parameter validation 
4. Optimize for performance with proper memory management 
5. Implement efficient collision detection 
6. Handle all edge cases in physics calculations 
7. Include detailed comments explaining complex logic 
8. Add console logging based on configuration
## Core Architecture Overview
### Engine Components
1. Physics System
Delta time-based calculations
Quadtree-based collision detection
Velocity and acceleration management
Gravity simulation
2. Rendering System
Sequential execution (Physics → Rendering)
Frame rate independent calculations
Optimized drawing system   - Layer management
3. Memory Management
Object pooling
Immediate garbage collection on object deletion
Clock-based memory cleaning
Reference tracking
4. Event System
Non-throttled event propagation
Yield support for heavy calculations
Frame-independent event processing
## Core Requirements
### Performance Tiers
1. Low Performance Mode
Maximum objects: 100
Collision precision: Low
Trail system: Disabled
Visual effects: Minimal
2. Medium Performance Mode
Maximum objects: 500
Collision precision: Medium
Trail system: Basic
Visual effects: Standard
3. High Performance Mode
Maximum objects: 1000+
Collision precision: High   - Trail system: Full
Visual effects: Maximum
### State Management ```typescript interface EngineState {   isPaused: boolean;
  currentPerformanceTier: "low" | "medium" | "high";   deltaTime: number;   activeObjects: {     balls: Ball[];     containers: Container[];     trails: Trail[];
    zones: Zone[];
  };
  memoryUsage: {     current: number;     peak: number;
    lastCleanup: number;
  };
}
interface StateManagement {   saveState(): EngineState;   loadState(state: EngineState): void;   pauseSimulation(): void;
  resumeSimulation(): void;
}
```
## Constants and Configuration
### Physics Configuration ```typescript interface PhysicsConfig {   deltaTime: {     fixed: number;      // Fixed timestep for physics calculations     max: number;        // Maximum allowed delta time
    multiplicator: number; // For slow-motion effects
  };
  
  collision: {
    precision: number;  // Collision detection precision     maxIterations: number; // Maximum collision resolution iterations     quadtreeDepth: number; // Depth of quadtree for spatial partitioning
  };
  
  limits: {     maxVelocity: number;     maxAcceleration: number;     maxSize: number;
    minSize: number;
  };
}
```
### Visual Configuration
```typescript interface VisualConfig {   background: {     color: RGB;
    pattern?: "solid" | "gradient";
  };
  
  ball: {     defaultColor: RGB;     defaultSize: number;     defaultGravity: number;
    outlineWidth: number;
  };
  
  container: {     defaultColor: RGB;     outlineWidth: number;
    cutVisualization: boolean;
  };
  
  trail: {
    maxLength: number;     maxPoints: number;
    defaultOpacity: number;
  };
  
  zone: {     defaultOpacity: number;
    highlightOnHover: boolean;
  };
}
```
### Memory Configuration
```typescript interface MemoryConfig {
  cleaning: {
    interval: number;    // Milliseconds between cleanup cycles
    threshold: number;   // Memory usage threshold for forced cleanup
  };
  
  pooling: {     initialSize: number;     expansionRate: number;
    maxSize: number;
  };
  
  limits: {     maxBalls: number;     maxContainers: number;     maxTrails: number;
    maxZones: number;
  };
}
```
## Class Definitions
### Ball Class ```typescript interface Ball {   id: number;   position: Vector2D;   velocity: Vector2D;   acceleration: Vector2D;   size: number;   color: RGB;   gravity: number;   trail?: Trail;
  collisionList: number[];  // IDs of balls this ball can collide with   isFrozen: boolean;
  isMulticolor: boolean;
  
  // Physics methods   update(deltaTime: number): void;   handleCollision(other: Ball | Container): void;
  
  // State methods   freeze(): void;   unfreeze(): void;
  destroy(): void;
}
```
### Container Class ```typescript interface Container {   id: number;   center: Vector2D;   radius: number;   cuts: Cut[];   rotation: number;   rotationSpeed: number;   isRotating: boolean;
  destroyAnimation: "fade" | "fallDown" | "shrink";
  
  // Collision methods   checkCollision(ball: Ball): boolean;
  handleCutCollision(ball: Ball): void;
  
  // Cut management   addCut(angle: number, size: number): void;
  mergeCuts(cut1: Cut, cut2: Cut): Cut;
  
  // Animation methods   rotate(deltaTime: number): void;
  animate(type: string): void;
}
```
### Trail Class ```typescript interface Trail {   id: number;   attachedBallId: number;   points: Point[];   form: "ball" | "line" | "box";   maxLength: number;   maxTime: number;   color: RGB;   isMulticolor: boolean;   isFading: boolean;
  isStroked: boolean;
  
  update(deltaTime: number): void;   addPoint(position: Vector2D): void;
  clear(): void;
  
  // Memory management   limitMemoryUsage(): void;
}
```
### Zone Class ```typescript interface Zone {   id: number;
  shape: "circle" | "rectangle" | "polygon";   points: Vector2D[];   color: RGB;   opacity: number;
  containedBalls: number[];   isVisible: boolean;
  size: number;  // For layering priority
  
  checkBallIntersection(ball: Ball): boolean;
  getCollisionPoint(ball: Ball): Vector2D;
}
```
## Function Implementations
# Ball Physics Simulation Engine Generation Prompt - Complete Function Specifications
[Previous sections remain unchanged up to Function Implementation]
## Function Implementation Categories
### Ball Appearance Functions
```javascript
// Color Management toggleBallMulticolor(ballId: number) -> void disableBallMulticolor(ballId: number) -> void changeBallsColor(r: number, g: number, b: number) -> void changeBallColor(ballId: number, r: number, g: number, b: number) -> void setBallLine(ballId: number) -> void setBallFull(ballId: number) -> void
// Size Management
addSizeToBall(ballId: number, sizeAdd: number) -> void multiplySizeOfBall(ballId: number, sizeMultiply: number) -> void newBallsSize(newSize: number) -> void tweenBallToSize(   ballId: number,   targetSize: number,   tweenTime: number, 
  tweenType: "linear" | "cubic" | "elastic"
) -> Promise<void>
```
### Ball Physics Functions
```javascript // Gravity Control setBallGravity(ballId: number, gravityForce: number) -> void
// Movement Control freezeBall(ballId: number) -> void unfreezeBall(ballId: number) -> void freezeAllBalls() -> void freezeDelayBall(ballId: number, delay: number) -> Promise<void>
// Collision Management toggleBallCollisions() -> void disableBallCollisions() -> void addOneBallToAllCollisions(ballId: number) -> void removeOneBallFromAllCollisions(ballId: number) -> void
setNewBallCollisionList(ballId: number, collisionIds: number[]) -> void ```
### Line System Functions
```javascript newLine(options: {   beginX: number,   beginY: number,   ballId: number,
  color?: {r: number, g: number, b: number},   thickness?: number }) -> number
changeLineColor(lineId: number, r: number, g: number, b: number) -> void changeLineThickness(lineId: number, newThickness: number) -> void endLine(endX: number, endY: number, lineId: number) -> void deleteLine(lineId: number) -> void ```
### Default Parameters Functions
```javascript defaultBallSize(newSize: number) -> void defaultBallGravity(newGravity: number) -> void defaultBallColor(r: number, g: number, b: number) -> void defaultBallCollisions(enabled: boolean) -> void defaultTrailSettings(settings: TrailSettings) -> void ```
### Container Management Functions
```javascript createContainer(options: {   x: number,   y: number,   radius: number,
  color?: {r: number, g: number, b: number},   rotation?: number,
  destroyAnimation?: "fade" | "fallDown" | "shrink"
}) -> number
deleteContainer(containerId: number) -> void
deleteContainerWithDelay(containerId: number, delay: number) -> Promise<void> setContainerDeleteAnimation(   containerId: number, 
  animation: "fade" | "fallDown" | "shrink" ) -> void
// Container Rotation enableContainerRotation(containerId: number) -> void disableContainerRotation(containerId: number) -> void changeContainerRotationSpeed(containerId: number, rotationSpeed: number) -> void addContainerRotationSpeed(containerId: number, rotationAdd: number) -> void
// Container Cuts createNewCut(options: {   containerId: number,   cutAngle: number,   cutSize: number }) -> number
changeCutAngle(cutId: number, newCutAngle: number) -> void changeCutSize(cutId: number, newCutSize: number) -> void removeCut(cutId: number) -> void removeAllCuts(containerId: number) -> void
// Container Size
changeContainerRadius(containerId: number, newRadius: number) -> void tweenContainerRadius(   containerId: number,   newRadius: number,   tweenTime: number,
  tweenType: "linear" | "cubic" | "elastic"
) -> Promise<void>
tweenAllContainersToNewRadius(
  newRadius: number,   tweenTime: number,
  tweenType: "linear" | "cubic" | "elastic"
) -> Promise<void>
```
### Trail System Functions
```javascript addTrailToBall(options: {   ballId: number,   form?: "ball" | "line" | "box",   maxLength?: number,   maxTime?: number,
  color?: {r: number, g: number, b: number},   isMulticolor?: boolean,   isFading?: boolean,   isStroked?: boolean }) -> number
changeTrailForm(trailId: number, form: "ball" | "line" | "box") -> void trailMaxLength(trailId: number, maxLength: number) -> void trailMaxTime(trailId: number, maxTime: number) -> void setTrailMulticolor(trailId: number, enabled: boolean) -> void setTrailFading(trailId: number, enabled: boolean) -> void setTrailStroked(trailId: number, enabled: boolean) -> void ```
### Group Management Functions
```javascript createNewGroup() -> number addBallToGroup(ballId: number, groupId: number) -> void removeBallFromGroup(ballId: number, groupId: number) -> void deleteGroup(groupId: number, deleteBallsInGroup: boolean) -> void
```
### Zone Management Functions
```javascript createNewZone(options: {   shape: "circle" | "rectangle" | "polygon",   points: Array<{x: number, y: number}>,   color?: {r: number, g: number, b: number},   opacity?: number }) -> number
changeZoneColor(zoneId: number, r: number, g: number, b: number) -> void changeZoneOpacity(zoneId: number, opacity: number) -> void showZone(zoneId: number) -> void hideZone(zoneId: number) -> void
deleteZone(zoneId: number) -> void
```
### Physics System Functions
```typescript interface PhysicsSystem {
  update(deltaTime: number): void;
  
  // Collision detection   updateQuadtree(): void;   checkCollisions(): void;
  resolveCollisions(): void;
  
  // Ball specific physics   updateBallPhysics(ball: Ball, deltaTime: number): void;   calculateCollisionResponse(ball1: Ball, ball2: Ball): void;
  
  // Container specific physics
  updateContainerPhysics(container: Container, deltaTime: number): void;   handleContainerCollisions(): void;
}
```
### Memory Management Functions
```typescript
interface MemoryManager {   // Object pooling   getFromPool<T>(type: string): T;
  returnToPool<T>(object: T): void;
  
  // Cleanup
  scheduledCleanup(): void;
  forceCleanup(): void;
  
  // Memory tracking   trackMemoryUsage(): void;   checkMemoryThresholds(): void;
}
```
### Fetching System Functions
```javascript
// Ball Information fetchAmountOfBalls() -> number fetchBallsThatCollide() -> number[] fetchCollisionList(ballId: number) -> number[] fetchBallFromId(ballId: number) -> Ball | null fetchBallSize(ballId: number) -> number fetchBallsInZone(zoneId: number) -> number[] isBallMulticolor(ballId: number) -> boolean isBallInZone(ballId: number, zoneId: number) -> boolean
// Group Information fetchGroupFromBall(ballId: number) -> number[] fetchBallsInGroup(groupId: number) -> number[]
// Container Information fetchSmallestContainer() -> number fetchContainerRadius(containerId: number) -> number fetchContainerCuts(containerId: number) -> number[]
// Performance Metrics fetchCurrentFPS() -> number fetchAverageFPS() -> number fetchMemoryUsage() -> {   balls: number,   containers: number,   trails: number,
  total: number
}
```
## Event System Specifications
### Ball Events ```typescript interface BallCollisionEvent {   ball1Id: number;   ball2Id: number;   collisionPoint: {x: number, y: number};   velocity1: {x: number, y: number};   velocity2: {x: number, y: number};
}
interface BallStateEvent {   ballId: number;   previousState?: any;
  newState?: any; }
// Event Handlers onBallTouchingBall: (event: BallCollisionEvent) => void onBallDestroying: (event: BallStateEvent) => void onBallDestroyed: (event: BallStateEvent) => void onBallFreezing: (event: BallStateEvent) => void onBallUnfreezing: (event: BallStateEvent) => void onBallChangingColor: (event: BallStateEvent) => void onBallSizeIncrease: (event: BallStateEvent) => void
onBallMaxSizeHit: (event: BallStateEvent) => void
```
### Wall Events ```typescript interface WallEvent {   wallId: number;   type: string;   previousState?: any;
  newState?: any; }
// Event Handlers onWallDestroying: (event: WallEvent) => void onWallDestroyed: (event: WallEvent) => void
onWallShrinking: (event: WallEvent) => void
```
### Group Events ```typescript interface GroupEvent {   groupId: number;   type: string;
  affectedBalls?: number[]; }
// Event Handlers onGroupCreation: (event: GroupEvent) => void onGroupDeletion: (event: GroupEvent) => void
```
### Wall+Ball Events ```typescript interface WallBallEvent {   ballId: number;   wallId: number;
  collisionPoint?: {x: number, y: number};
  type: string;
}
// Event Handlers onBallTouchingWall: (event: WallBallEvent) => void
onBallSurpassingWall: (event: WallBallEvent) => void
```
### Zone+Ball Events ```typescript interface ZoneBallEvent {   ballId: number;   zoneId: number;
  collisionPoint?: {x: number, y: number};
  type: "enter" | "exit";
}
// Event Handlers onBallEnterZone: (event: ZoneBallEvent) => void
onBallExitZone: (event: ZoneBallEvent) => void
```
## Error Handling System
### Error Categories
1. Physics Errors
Collision resolution failures
Invalid physics calculations
Velocity/acceleration limits exceeded
2. Memory Errors
Pool exhaustion
Memory limit exceeded
Reference errors
3. State Errors
Invalid object states
Inconsistent simulation state   - Event handling failures
### Error Resolution ```typescript interface ErrorHandler {
  severity: "warning" | "error" | "critical";
  
  handle(error: Error): void;   log(error: Error): void;
  recover(from: Error): void;
  
  // Specific handlers   handlePhysicsError(error: PhysicsError): void;   handleMemoryError(error: MemoryError): void;   handleStateError(error: StateError): void;
}
```
## Performance Optimization
### Rendering Optimization
1. Layer-based rendering
2. Dirty rectangle tracking
3. Object culling
4. Canvas state caching
### Physics Optimization
1. Quadtree spatial partitioning
2. Broad-phase collision detection
3. Physics step interpolation
4. Sleep state for static objects
### Memory Optimization
1. Object pooling
2. Immediate garbage collection
3. Reference counting
4. Memory defragmentation
## Implementation Guidelines
1. Physics Implementation Priority
Basic movement
Wall collisions
Ball-to-ball collisions
Container interactions   - Zone detection
2. Rendering Implementation Priority
Basic shapes
Containers with cuts
Trails
Visual effects
UI elements
3. Error Handling Implementation Priority
Critical errors
Physics errors
Memory errors
State errors
4. Testing Implementation Priority
Physics accuracy
Performance benchmarks
Memory management
Error recovery
## Documentation Requirements
1. API Documentation
Function signatures
Type definitions   - Usage examples    - Error handling
2. Performance Guidelines
Optimization techniques
Performance tier requirements
Memory management best practices
3. Implementation Guide
Step-by-step setup
Common patterns   - Troubleshooting
4. Testing Guide
Test cases
Benchmark specifications
Error scenarios

# Step-by-step method to create the ball game
Phase 1: Core Structure and Basic Entities

Set up the project structure and HTML/CSS foundation
Implement Vector2D for mathematical operations
Create the RGB utility for color management
Develop the base Ball class with basic properties
Create the Canvas rendering system
Implement the basic animation loop
Add simple ball movement with velocity and position

Phase 2: Physics Implementation

Implement gravity and acceleration
Add wall boundaries (screen edges)
Create basic ball-to-ball collision detection
Implement collision response (balls bouncing off each other)
Add the Quadtree for optimized collision detection
Implement delta time-based physics calculations

Phase 3: Containers and Advanced Physics

Create the Container class with basic circle shape
Implement ball-container collision detection and response
Add rotation capabilities to containers
Implement the Cut class for container openings
Add collision detection with cuts

Phase 4: Memory Management and Optimization

Implement the MemoryManager with object pooling
Add memory tracking and cleanup routines
Implement performance tiers and dynamic adjustments
Optimize rendering with culling and dirty rectangle tracking

Phase 5: Advanced Features

Create the Trail system
Implement the Zone class for spatial triggers
Add Group management for collective operations
Implement multicolor effects and visual enhancements
Add tweening capabilities for smooth transitions

Phase 6: Event System and Error Handling

Create the EventSystem for publishing and subscribing to events
Implement specific event types (collisions, state changes, etc.)
Create the ErrorHandler with categorized error handling
Add recovery mechanisms for common errors

Phase 7: API and Documentation

Implement all the API functions for external control
Create comprehensive documentation
Add examples showcasing different features
Implement performance benchmarks and testing utilities

Phase 8: Finalization and Testing

Conduct performance testing across different scenarios
Fix bugs and edge cases
Optimize performance bottlenecks
Finalize documentation and examples