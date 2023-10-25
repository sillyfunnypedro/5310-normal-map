#version 300 es

// A basic shader that sets the color of the fragment to red.
precision mediump float;
out vec4 color;
void main() {
    color = vec4(1.0, 0.0, 0.1, 1);
}