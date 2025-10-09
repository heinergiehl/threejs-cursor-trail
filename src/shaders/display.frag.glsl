uniform sampler2D uTexture;
uniform float uTime;
varying vec2 vUv;

void main() {
    vec4 color = texture2D(uTexture, vUv);

    // Add glow
    float offset = 0.001;
    vec4 glow = vec4(0.0);

    for(float x = -1.0; x <= 1.0; x += 1.0) {
        for(float y = -1.0; y <= 1.0; y += 1.0) {
            vec2 offsetUv = vUv + vec2(x, y) * offset;
            glow += texture2D(uTexture, offsetUv);
        }
    }

    glow /= 9.0;

    vec3 finalColor = color.rgb + glow.rgb * 0.3;
    finalColor = pow(finalColor, vec3(0.95));    gl_FragColor = vec4(finalColor, 1.0);
}
