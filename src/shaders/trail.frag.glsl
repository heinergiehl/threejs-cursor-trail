uniform sampler2D uTexture;
uniform vec2 uMouse;
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vUv;

void main() {
    vec4 color = texture2D(uTexture, vUv);

    // Decay - faster decay for clearer trail
    color *= 0.90;

    // Add particles at mouse position
    vec2 pixelPos = vUv * uResolution;
    float dist = distance(pixelPos, uMouse);

    float radius = 12.0;
    float intensity = smoothstep(radius, 0.0, dist);

    // Cyan/blue color
    vec3 particleColor = vec3(0.0, 0.6 + sin(uTime * 3.0) * 0.2, 1.0);
    color.rgb += particleColor * intensity * 0.2;    gl_FragColor = vec4(color.rgb, 1.0);
}
