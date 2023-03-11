// https://codepen.io/machenmusik/pen/WZyQNj

AFRAME.registerShader("my-custom", {
  // The schema declares any parameters for the shader.
  schema: {
    // Where relevant, it is customary to support color.
    // The A-Frame schema uses `type:'color'`, so it will parse string values like 'white' or 'red.
    // `is:'uniform'` tells A-Frame this should appear as uniform value in the shader(s).
    color: { type: "color", is: "uniform", default: "red" },
    // It is customary to support opacity, for fading in and out.
    opacity: { type: "number", is: "uniform", default: 1.0 },
  },

  // Setting raw to true uses THREE.RawShaderMaterial instead of ShaderMaterial,
  // so your shader strings are used as-is, for advanced shader usage.
  // Here, we want the usual prefixes with GLSL constants etc.,
  // so we set it to false.
  // (Which is also the default, so we could have omitted it).
  raw: false,

  // Here, we're going to use the default vertex shader by omitting vertexShader.
  // But note that if your fragment shader cares about texture coordinates,
  // the vertex shader should set varying values to use in the fragment shader.

  // Since almost every WebVR-capable browser supports ES6,
  // define our fragment shader as a multi-line string.
  fragmentShader: `
    // Use medium precision.
    precision mediump float;
  
    // This receives the color value from the schema, which becomes a vec3 in the shader.
    uniform vec3 color;
  
    // This receives the opacity value from the schema, which becomes a number.
    uniform float opacity;
  
    // This is the shader program.
    // A fragment shader can set the color via gl_FragColor,
    // or decline to draw anything via discard.

    void main () {
      // Note that this shader doesn't use texture coordinates.
      // Set the RGB portion to our color,
      // and the alpha portion to our opacity.
      gl_FragColor = vec4(color, opacity);
    }
  `,
});

//https://alexanderameye.github.io/notes/rendering-outlines/

//www.shadertoy.com/view/sltcRf

//https://github.com/mrdoob/three.js/blob/master/examples/webgl_postprocessing_sobel.html
https: AFRAME.registerShader("my-custom-3", {
  // The schema declares any parameters for the shader.
  schema: {
    color: { type: "color", is: "uniform", default: "red" },
    opacity: { type: "number", is: "uniform", default: 1.0 },
  },

  raw: false,

  fragmentShader: /* glsl */ `
		uniform sampler2D tDiffuse;
		uniform vec2 resolution;
		varying vec2 vUv;
		void main() {
			vec2 texel = vec2( 1.0 / resolution.x, 1.0 / resolution.y );
		// kernel definition (in glsl matrices are filled in column-major order)
			const mat3 Gx = mat3( -1, -2, -1, 0, 0, 0, 1, 2, 1 ); // x direction kernel
			const mat3 Gy = mat3( -1, 0, 1, -2, 0, 2, -1, 0, 1 ); // y direction kernel
		// fetch the 3x3 neighbourhood of a fragment
		// first column
			float tx0y0 = texture2D( tDiffuse, vUv + texel * vec2( -1, -1 ) ).r;
			float tx0y1 = texture2D( tDiffuse, vUv + texel * vec2( -1,  0 ) ).r;
			float tx0y2 = texture2D( tDiffuse, vUv + texel * vec2( -1,  1 ) ).r;
		// second column
			float tx1y0 = texture2D( tDiffuse, vUv + texel * vec2(  0, -1 ) ).r;
			float tx1y1 = texture2D( tDiffuse, vUv + texel * vec2(  0,  0 ) ).r;
			float tx1y2 = texture2D( tDiffuse, vUv + texel * vec2(  0,  1 ) ).r;
		// third column
			float tx2y0 = texture2D( tDiffuse, vUv + texel * vec2(  1, -1 ) ).r;
			float tx2y1 = texture2D( tDiffuse, vUv + texel * vec2(  1,  0 ) ).r;
			float tx2y2 = texture2D( tDiffuse, vUv + texel * vec2(  1,  1 ) ).r;
		// gradient value in x direction
			float valueGx = Gx[0][0] * tx0y0 + Gx[1][0] * tx1y0 + Gx[2][0] * tx2y0 +
				Gx[0][1] * tx0y1 + Gx[1][1] * tx1y1 + Gx[2][1] * tx2y1 +
				Gx[0][2] * tx0y2 + Gx[1][2] * tx1y2 + Gx[2][2] * tx2y2;
		// gradient value in y direction
			float valueGy = Gy[0][0] * tx0y0 + Gy[1][0] * tx1y0 + Gy[2][0] * tx2y0 +
				Gy[0][1] * tx0y1 + Gy[1][1] * tx1y1 + Gy[2][1] * tx2y1 +
				Gy[0][2] * tx0y2 + Gy[1][2] * tx1y2 + Gy[2][2] * tx2y2;
		// magnitute of the total gradient
			float G = sqrt( ( valueGx * valueGx ) + ( valueGy * valueGy ) );
			gl_FragColor = vec4( vec3( G ), 1 );
		}`,
});

AFRAME.registerShader("my-custom-2", {
  // The schema declares any parameters for the shader.
  schema: {
    color: { type: "color", is: "uniform", default: "red" },
    opacity: { type: "number", is: "uniform", default: 1.0 },
  },

  raw: false,

  vertexShader: `
  void mainImage(out vec4 fragColor, in vec2 fragCoord) {

    const vec3 target = vec3(0.0, 1.0, 0.0); // Find green
      const float TAU = 6.28318530;
    const float steps = 32.0;
      
    float radius = iMouse.z > 0.0 ? length(0.5 - iMouse.xy / iResolution.xy) * 100.0 : sin(iTime * 4.0) * 20.0 + 20.0;
    vec2 uv = fragCoord / iResolution.xy;
      
      // Correct aspect ratio
      vec2 aspect = 1.0 / vec2(textureSize(iChannel0, 0));
      
    fragColor = vec4(uv.y, 0.0, uv.x, 1.0);
    for (float i = 0.0; i < TAU; i += TAU / steps) {
      // Sample image in a circular pattern
          vec2 offset = vec2(sin(i), cos(i)) * aspect * radius;
      vec4 col = texture(iChannel0, uv + offset);
      
      // Mix outline with background
      float alpha = smoothstep(0.5, 0.7, distance(col.rgb, target));
      fragColor = mix(fragColor, vec4(1.0), alpha);
    }
    
      // Overlay original video
    vec4 mat = texture(iChannel0, uv);
    float factor = smoothstep(0.5, 0.7, distance(mat.rgb, target));
    fragColor = mix(fragColor, mat, factor);
  }
  `,
});
