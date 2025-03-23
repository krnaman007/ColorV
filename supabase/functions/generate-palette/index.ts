// Edge function to generate color palettes based on keywords or themes

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

interface Color {
  hex: string;
  rgb: RGBColor;
  name?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { keyword, type = "theme" } = await req.json();

    if (!keyword) {
      return new Response(JSON.stringify({ error: "Keyword is required" }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: 400,
      });
    }

    // Generate a hash from the keyword to create deterministic but seemingly random colors
    const hash = hashString(keyword);
    const hue = hash % 360;

    let colors: Color[] = [];

    if (type === "theme") {
      // Generate a thematic palette based on the keyword
      colors = generateThematicPalette(keyword, hue);
    } else if (type === "complementary") {
      colors = generateComplementaryPalette(hue);
    } else if (type === "analogous") {
      colors = generateAnalogousPalette(hue);
    } else if (type === "triadic") {
      colors = generateTriadicPalette(hue);
    } else if (type === "monochromatic") {
      colors = generateMonochromaticPalette(hue);
    } else {
      // Default to a random palette
      colors = generateRandomPalette();
    }

    return new Response(JSON.stringify({ colors }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      status: 500,
    });
  }
});

// Helper functions
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function hslToRgb(h: number, s: number, l: number): RGBColor {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

function generateColor(h: number, s: number, l: number): Color {
  const rgb = hslToRgb(h, s, l);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  return { hex, rgb };
}

function generateThematicPalette(keyword: string, baseHue: number): Color[] {
  // Different keywords would generate different palettes
  // This is a simplified implementation
  const keywordMap: Record<string, number[]> = {
    ocean: [210, 200, 190, 220, 230],
    sunset: [0, 20, 40, 350, 330],
    forest: [120, 140, 90, 160, 70],
    desert: [30, 40, 50, 20, 10],
    berry: [320, 340, 350, 300, 280],
    citrus: [40, 60, 80, 20, 10],
    autumn: [30, 20, 10, 40, 50],
    spring: [120, 140, 160, 100, 80],
    winter: [210, 220, 200, 230, 190],
    summer: [60, 40, 80, 20, 100],
  };

  // Use the keyword if it exists in our map, otherwise use the hash-based hue
  const hues = keywordMap[keyword.toLowerCase()] || [
    baseHue,
    (baseHue + 30) % 360,
    (baseHue + 60) % 360,
    (baseHue + 90) % 360,
    (baseHue + 120) % 360,
  ];

  return hues.map((hue, index) => {
    // Vary saturation and lightness based on position in palette
    const saturation = 70 - index * 5;
    const lightness = 45 + index * 5;
    return generateColor(hue, saturation, lightness);
  });
}

function generateComplementaryPalette(baseHue: number): Color[] {
  const complementaryHue = (baseHue + 180) % 360;

  return [
    generateColor(baseHue, 70, 40),
    generateColor(baseHue, 60, 60),
    generateColor(baseHue, 50, 80),
    generateColor(complementaryHue, 70, 40),
    generateColor(complementaryHue, 60, 60),
  ];
}

function generateAnalogousPalette(baseHue: number): Color[] {
  return [
    generateColor((baseHue - 40 + 360) % 360, 70, 40),
    generateColor((baseHue - 20 + 360) % 360, 70, 50),
    generateColor(baseHue, 70, 60),
    generateColor((baseHue + 20) % 360, 70, 50),
    generateColor((baseHue + 40) % 360, 70, 40),
  ];
}

function generateTriadicPalette(baseHue: number): Color[] {
  const triad1 = (baseHue + 120) % 360;
  const triad2 = (baseHue + 240) % 360;

  return [
    generateColor(baseHue, 70, 50),
    generateColor(baseHue, 60, 70),
    generateColor(triad1, 70, 50),
    generateColor(triad1, 60, 70),
    generateColor(triad2, 70, 50),
  ];
}

function generateMonochromaticPalette(baseHue: number): Color[] {
  return [
    generateColor(baseHue, 70, 30),
    generateColor(baseHue, 70, 45),
    generateColor(baseHue, 70, 60),
    generateColor(baseHue, 70, 75),
    generateColor(baseHue, 70, 90),
  ];
}

function generateRandomPalette(): Color[] {
  const colors: Color[] = [];
  for (let i = 0; i < 5; i++) {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 30) + 60; // 60-90%
    const l = Math.floor(Math.random() * 40) + 30; // 30-70%
    colors.push(generateColor(h, s, l));
  }
  return colors;
}
