varying vec3 vColor;
varying float vAlpha;

void main() {
    // Create circular particles with sharp edges (pixel-like)
    float dist = distance(gl_PointCoord, vec2(0.5));
    float alpha = smoothstep(0.5, 0.3, dist);

    // Minimal glow effect
    float glow = smoothstep(0.5, 0.4, dist);

    vec3 finalColor = vColor + glow * 0.1;

    gl_FragColor = vec4(finalColor, alpha * vAlpha * 0.9);
}