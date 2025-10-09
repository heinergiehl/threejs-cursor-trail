uniform float uTime;
uniform float uPixelRatio;
attribute float aScale;
attribute vec3 aRandomness;
attribute float aDelay;
attribute float aLifetime;

varying vec3 vColor;
varying float vAlpha;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // Animate size based on lifetime
    float sizeAnimation = sin((uTime + aDelay) * 3.0) * 0.5 + 0.5;
    gl_PointSize = aScale * uPixelRatio * (0.5 + sizeAnimation * 0.3);
    gl_PointSize *= (100.0 / -viewPosition.z);

    // Fade out based on lifetime with smooth curve
    float lifetimeFade = 1.0 - aLifetime;
    lifetimeFade = lifetimeFade * lifetimeFade; // Quadratic fade for smoother disappearance
    vAlpha = lifetimeFade;

    // Color variation based on position and time
    vColor = vec3(
        0.0 + aRandomness.x * 0.3,
        0.5 + aRandomness.y * 0.5,
        1.0);
}
