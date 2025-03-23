// Edge function to extract dominant colors from an image URL

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
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: "Image URL is required" }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: 400,
      });
    }

    // Fetch the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch image" }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: 400,
      });
    }

    // In a real implementation, you would use image processing libraries
    // to extract dominant colors. For this demo, we'll return mock data.
    const mockColors: Color[] = [
      { hex: "#264653", rgb: { r: 38, g: 70, b: 83 } },
      { hex: "#2A9D8F", rgb: { r: 42, g: 157, b: 143 } },
      { hex: "#E9C46A", rgb: { r: 233, g: 196, b: 106 } },
      { hex: "#F4A261", rgb: { r: 244, g: 162, b: 97 } },
      { hex: "#E76F51", rgb: { r: 231, g: 111, b: 81 } },
    ];

    return new Response(JSON.stringify({ colors: mockColors }), {
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
