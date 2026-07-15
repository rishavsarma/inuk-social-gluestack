import { Skia } from "@shopify/react-native-skia";

export const combinedShaderSource = `
  uniform shader image;
  uniform vec2 imageSize;
  uniform float brightness;       // default 1.0
  uniform float contrast;         // default 1.0
  uniform float saturation;       // default 1.0
  uniform float pixelate;         // default 1.0 (1.0 means off)
  uniform float radialPixelAngle;   // default 0.0 (off)
  uniform float radialPixelRadius;  // default 0.0 (off)
  uniform float liquidStrength;    // default 0.0 (off)
  uniform float liquidFrequency;   // default 10.0
  uniform float time;             // default 0.0
  uniform float filterType;       // 0.0: none, 1.0: sepia, 2.0: grayscale, 3.0: vintage, 4.0: negative, 5.0: warm, 6.0: cool

  vec4 main(vec2 pos) {
    vec2 uv = pos;

    // 1. Apply Liquid distortion
    if (liquidStrength > 0.0) {
      uv.x += sin(pos.y / liquidFrequency + time) * liquidStrength;
      uv.y += cos(pos.x / liquidFrequency + time) * liquidStrength;
    }

    // 2. Apply Pixelate
    if (pixelate > 1.0) {
      uv = floor(uv / pixelate) * pixelate;
    }

    // 3. Apply Radial Pixelate
    if (radialPixelAngle > 0.0 && radialPixelRadius > 0.0) {
      vec2 center = imageSize / 2.0;
      vec2 dir = uv - center;
      float dist = length(dir);
      float angle = atan(dir.y, dir.x);
      float newDist = floor(dist / radialPixelRadius) * radialPixelRadius;
      float newAngle = floor(angle / radialPixelAngle) * radialPixelAngle;
      uv = center + vec2(cos(newAngle), sin(newAngle)) * newDist;
    }

    // Sample color from the image shader
    vec4 color = image.eval(uv);

    // 4. Apply Brightness
    color.rgb *= brightness;

    // 5. Apply Contrast
    color.rgb = (color.rgb - 0.5) * contrast + 0.5;

    // 6. Apply Saturation
    float luma = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
    color.rgb = mix(vec3(luma), color.rgb, saturation);

    // 7. Apply Filters (using ranges to avoid strict float equality issues)
    if (filterType > 0.5 && filterType < 1.5) { // 1.0: Sepia
      float r = dot(color.rgb, vec3(0.393, 0.769, 0.189));
      float g = dot(color.rgb, vec3(0.349, 0.686, 0.168));
      float b = dot(color.rgb, vec3(0.272, 0.534, 0.131));
      color.rgb = vec3(r, g, b);
    } else if (filterType > 1.5 && filterType < 2.5) { // 2.0: Grayscale
      color.rgb = vec3(luma);
    } else if (filterType > 2.5 && filterType < 3.5) { // 3.0: Vintage
      color.r = color.r * 0.9 + 0.1;
      color.g = color.g * 0.8 + 0.05;
      color.b = color.b * 0.7;
    } else if (filterType > 3.5 && filterType < 4.5) { // 4.0: Negative / Invert
      color.rgb = vec3(1.0) - color.rgb;
    } else if (filterType > 4.5 && filterType < 5.5) { // 5.0: Warm
      color.r = color.r * 1.15;
      color.b = color.b * 0.85;
    } else if (filterType > 5.5 && filterType < 6.5) { // 6.0: Cool
      color.r = color.r * 0.85;
      color.b = color.b * 1.15;
    }

    return color;
  }
`;

export const getCombinedShader = () => {
  return Skia.RuntimeEffect.Make(combinedShaderSource);
};
