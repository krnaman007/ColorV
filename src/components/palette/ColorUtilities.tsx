import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Eye, EyeOff, Droplet, Contrast, Shuffle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ColorUtilities() {
  const [color, setColor] = useState("#6366F1");
  const [contrastColor, setContrastColor] = useState("#FFFFFF");
  const [colorBlindnessType, setColorBlindnessType] = useState("protanopia");
  const { toast } = useToast();

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number) => {
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
  };

  // Convert RGB to Hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  };

  // Calculate contrast ratio
  const calculateContrastRatio = (color1: string, color2: string) => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    if (!rgb1 || !rgb2) return 0;

    // Calculate luminance
    const luminance1 = calculateLuminance(rgb1.r, rgb1.g, rgb1.b);
    const luminance2 = calculateLuminance(rgb2.r, rgb2.g, rgb2.b);

    // Calculate contrast ratio
    const ratio =
      luminance1 > luminance2
        ? (luminance1 + 0.05) / (luminance2 + 0.05)
        : (luminance2 + 0.05) / (luminance1 + 0.05);

    return ratio;
  };

  const calculateLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  // Get contrast rating
  const getContrastRating = (ratio: number) => {
    if (ratio >= 7) return { text: "AAA", color: "text-green-600" };
    if (ratio >= 4.5) return { text: "AA", color: "text-yellow-600" };
    if (ratio >= 3) return { text: "AA Large", color: "text-orange-600" };
    return { text: "Fail", color: "text-red-600" };
  };

  // Generate shades and tints
  const generateShades = (baseColor: string, count: number = 10) => {
    const rgb = hexToRgb(baseColor);
    if (!rgb) return [];

    const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const step = l / (count + 1);

    return Array.from({ length: count }, (_, i) => {
      const newL = l - step * (i + 1);
      const newRgb = hslToRgb(h, s, Math.max(0, newL));
      return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    });
  };

  const generateTints = (baseColor: string, count: number = 10) => {
    const rgb = hexToRgb(baseColor);
    if (!rgb) return [];

    const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const step = (100 - l) / (count + 1);

    return Array.from({ length: count }, (_, i) => {
      const newL = l + step * (i + 1);
      const newRgb = hslToRgb(h, s, Math.min(100, newL));
      return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    });
  };

  // Simulate color blindness
  const simulateColorBlindness = (hex: string, type: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    let { r, g, b } = rgb;

    // Apply color blindness simulation matrices
    // These are simplified approximations
    switch (type) {
      case "protanopia": // Red-blind
        [r, g, b] = [
          0.567 * r + 0.433 * g + 0.0 * b,
          0.558 * r + 0.442 * g + 0.0 * b,
          0.0 * r + 0.242 * g + 0.758 * b,
        ];
        break;
      case "deuteranopia": // Green-blind
        [r, g, b] = [
          0.625 * r + 0.375 * g + 0.0 * b,
          0.7 * r + 0.3 * g + 0.0 * b,
          0.0 * r + 0.3 * g + 0.7 * b,
        ];
        break;
      case "tritanopia": // Blue-blind
        [r, g, b] = [
          0.95 * r + 0.05 * g + 0.0 * b,
          0.0 * r + 0.433 * g + 0.567 * b,
          0.0 * r + 0.475 * g + 0.525 * b,
        ];
        break;
      case "achromatopsia": // Total color blindness
        const avg = (r + g + b) / 3;
        r = g = b = avg;
        break;
    }

    return rgbToHex(Math.round(r), Math.round(g), Math.round(b));
  };

  // Copy color to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${text} copied to clipboard`,
    });
  };

  // Generate complementary color
  const getComplementaryColor = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return "#000000";

    const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const newH = (h + 180) % 360;
    const newRgb = hslToRgb(newH, s, l);

    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
  };

  // Generate analogous colors
  const getAnalogousColors = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return [];

    const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);

    return [
      rgbToHex(...Object.values(hslToRgb((h - 30 + 360) % 360, s, l))),
      hex,
      rgbToHex(...Object.values(hslToRgb((h + 30) % 360, s, l))),
    ];
  };

  // Generate triadic colors
  const getTriadicColors = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return [];

    const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);

    return [
      hex,
      rgbToHex(...Object.values(hslToRgb((h + 120) % 360, s, l))),
      rgbToHex(...Object.values(hslToRgb((h + 240) % 360, s, l))),
    ];
  };

  // Get contrast ratio for display
  const contrastRatio = calculateContrastRatio(color, contrastColor);
  const contrastRating = getContrastRating(contrastRatio);

  // Generate color variations
  const shades = generateShades(color, 5);
  const tints = generateTints(color, 5);
  const complementaryColor = getComplementaryColor(color);
  const analogousColors = getAnalogousColors(color);
  const triadicColors = getTriadicColors(color);

  // Simulate color blindness
  const simulatedColor = simulateColorBlindness(color, colorBlindnessType);

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <Tabs defaultValue="contrast">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="contrast">Contrast Checker</TabsTrigger>
          <TabsTrigger value="variations">Color Variations</TabsTrigger>
          <TabsTrigger value="harmonies">Color Harmonies</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
        </TabsList>

        <TabsContent value="contrast" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contrast Checker</CardTitle>
              <CardDescription>
                Check the contrast ratio between two colors for accessibility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="color1">Foreground Color</Label>
                    <div className="flex gap-2">
                      <div
                        className="h-10 w-10 rounded-md border"
                        style={{ backgroundColor: color }}
                      ></div>
                      <Input
                        id="color1"
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-12 p-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color2">Background Color</Label>
                    <div className="flex gap-2">
                      <div
                        className="h-10 w-10 rounded-md border"
                        style={{ backgroundColor: contrastColor }}
                      ></div>
                      <Input
                        id="color2"
                        type="text"
                        value={contrastColor}
                        onChange={(e) => setContrastColor(e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        type="color"
                        value={contrastColor}
                        onChange={(e) => setContrastColor(e.target.value)}
                        className="w-12 p-1"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={() => {
                        const temp = color;
                        setColor(contrastColor);
                        setContrastColor(temp);
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      <Shuffle className="h-4 w-4 mr-2" />
                      Swap Colors
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div
                    className="rounded-md p-8 flex items-center justify-center text-center min-h-[200px]"
                    style={{ backgroundColor: contrastColor }}
                  >
                    <div className="space-y-4">
                      <div className="text-4xl font-bold" style={{ color }}>
                        Sample Text
                      </div>
                      <div className="text-base" style={{ color }}>
                        This is how your text will look
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-md p-4 shadow-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium">
                          Contrast Ratio
                        </div>
                        <div className="text-2xl font-bold">
                          {contrastRatio.toFixed(2)}:1
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">WCAG Rating</div>
                        <div
                          className={`text-2xl font-bold ${contrastRating.color}`}
                        >
                          {contrastRating.text}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Variations</CardTitle>
              <CardDescription>
                Generate shades and tints of your base color
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Shades (Darker)</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {shades.map((shade, index) => (
                      <div key={`shade-${index}`} className="space-y-1">
                        <div
                          className="h-16 rounded-md cursor-pointer relative group"
                          style={{ backgroundColor: shade }}
                          onClick={() => copyToClipboard(shade)}
                        >
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-md">
                            <Copy className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="text-xs font-mono text-center">
                          {shade}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Base Color</h3>
                  <div className="flex justify-center">
                    <div className="space-y-1 w-32">
                      <div
                        className="h-16 rounded-md cursor-pointer relative group"
                        style={{ backgroundColor: color }}
                        onClick={() => copyToClipboard(color)}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-md">
                          <Copy className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="text-xs font-mono text-center">
                        {color}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Tints (Lighter)</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {tints.map((tint, index) => (
                      <div key={`tint-${index}`} className="space-y-1">
                        <div
                          className="h-16 rounded-md cursor-pointer relative group"
                          style={{ backgroundColor: tint }}
                          onClick={() => copyToClipboard(tint)}
                        >
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-md">
                            <Copy className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="text-xs font-mono text-center">
                          {tint}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="harmonies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Harmonies</CardTitle>
              <CardDescription>
                Generate harmonious color combinations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-3">
                    Complementary Color
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div
                        className="h-20 rounded-md cursor-pointer relative group"
                        style={{ backgroundColor: color }}
                        onClick={() => copyToClipboard(color)}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-md">
                          <Copy className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="text-xs font-mono text-center">
                        {color}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div
                        className="h-20 rounded-md cursor-pointer relative group"
                        style={{ backgroundColor: complementaryColor }}
                        onClick={() => copyToClipboard(complementaryColor)}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-md">
                          <Copy className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="text-xs font-mono text-center">
                        {complementaryColor}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Analogous Colors</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {analogousColors.map((analogColor, index) => (
                      <div key={`analog-${index}`} className="space-y-1">
                        <div
                          className="h-20 rounded-md cursor-pointer relative group"
                          style={{ backgroundColor: analogColor }}
                          onClick={() => copyToClipboard(analogColor)}
                        >
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-md">
                            <Copy className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="text-xs font-mono text-center">
                          {analogColor}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Triadic Colors</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {triadicColors.map((triadicColor, index) => (
                      <div key={`triadic-${index}`} className="space-y-1">
                        <div
                          className="h-20 rounded-md cursor-pointer relative group"
                          style={{ backgroundColor: triadicColor }}
                          onClick={() => copyToClipboard(triadicColor)}
                        >
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-md">
                            <Copy className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="text-xs font-mono text-center">
                          {triadicColor}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Accessibility Simulation</CardTitle>
              <CardDescription>
                See how your color appears to users with different types of
                color blindness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <div className="space-y-2">
                      <Label htmlFor="base-color">Base Color</Label>
                      <div className="flex gap-2">
                        <div
                          className="h-10 w-10 rounded-md border"
                          style={{ backgroundColor: color }}
                        ></div>
                        <Input
                          id="base-color"
                          type="text"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="flex-1"
                        />
                        <Input
                          type="color"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="w-12 p-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="w-1/2">
                    <div className="space-y-2">
                      <Label htmlFor="colorblindness-type">
                        Color Blindness Type
                      </Label>
                      <Select
                        value={colorBlindnessType}
                        onValueChange={setColorBlindnessType}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="protanopia">
                            Protanopia (Red-Blind)
                          </SelectItem>
                          <SelectItem value="deuteranopia">
                            Deuteranopia (Green-Blind)
                          </SelectItem>
                          <SelectItem value="tritanopia">
                            Tritanopia (Blue-Blind)
                          </SelectItem>
                          <SelectItem value="achromatopsia">
                            Achromatopsia (Monochromacy)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Original Color</h3>
                    <div
                      className="h-40 rounded-md shadow-sm"
                      style={{ backgroundColor: color }}
                    ></div>
                    <div className="text-sm font-mono text-center">{color}</div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      Simulated{" "}
                      {colorBlindnessType.charAt(0).toUpperCase() +
                        colorBlindnessType.slice(1)}{" "}
                      View
                    </h3>
                    <div
                      className="h-40 rounded-md shadow-sm"
                      style={{ backgroundColor: simulatedColor }}
                    ></div>
                    <div className="text-sm font-mono text-center">
                      {simulatedColor}
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <h3 className="text-lg font-medium">Accessibility Tips</h3>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      <li>
                        Aim for a contrast ratio of at least 4.5:1 for normal
                        text and 3:1 for large text
                      </li>
                      <li>
                        Don't rely solely on color to convey information; use
                        patterns, labels, or icons
                      </li>
                      <li>
                        Test your color combinations with different types of
                        color blindness simulations
                      </li>
                      <li>
                        Consider using tools like the WebAIM Color Contrast
                        Checker for verification
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
