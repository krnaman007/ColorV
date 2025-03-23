import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Palette,
  Image,
  Download,
  Share,
  Copy,
  Sparkles,
  Save,
  Trash2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../supabase/supabase";
import { useAuth } from "../../../supabase/auth";

interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
  name?: string;
}

interface ColorPalette {
  id?: string;
  name: string;
  colors: Color[];
  userId?: string;
  isPublic?: boolean;
  createdAt?: string;
}

export default function ColorPaletteCreator() {
  const [activeTab, setActiveTab] = useState("manual");
  const [colors, setColors] = useState<Color[]>([
    { hex: "#6366F1", rgb: { r: 99, g: 102, b: 241 } },
    { hex: "#8B5CF6", rgb: { r: 139, g: 92, b: 246 } },
    { hex: "#D946EF", rgb: { r: 217, g: 70, b: 239 } },
    { hex: "#EC4899", rgb: { r: 236, g: 72, b: 153 } },
    { hex: "#F43F5E", rgb: { r: 244, g: 63, b: 94 } },
  ]);
  const [paletteName, setPaletteName] = useState("My Palette");
  const [imageUrl, setImageUrl] = useState("");
  const [keyword, setKeyword] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [savedPalettes, setSavedPalettes] = useState<ColorPalette[]>([]);

  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserPalettes();
    }
  }, [user]);

  const fetchUserPalettes = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("palettes")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      if (data) {
        setSavedPalettes(
          data.map((p) => ({
            id: p.id,
            name: p.name,
            colors: p.colors,
            userId: p.user_id,
            isPublic: p.is_public,
            createdAt: p.created_at,
          })),
        );
      }
    } catch (error) {
      console.error("Error fetching palettes:", error);
      toast({
        title: "Error",
        description: "Failed to load your palettes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateRandomPalette = () => {
    const newColors = Array(5)
      .fill(0)
      .map(() => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        const hex = rgbToHex(r, g, b);
        return { hex, rgb: { r, g, b } };
      });
    setColors(newColors);
    toast({
      title: "Palette Generated",
      description: "Random color palette created successfully",
    });
  };

  const generateFromImage = async () => {
    if (!imageUrl) {
      toast({
        title: "Error",
        description: "Please enter an image URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Call the extract-colors edge function
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-extract-colors",
        {
          body: { imageUrl },
        },
      );

      if (error) throw error;

      if (data && data.colors) {
        setColors(data.colors);
        toast({
          title: "Colors Extracted",
          description: "Colors extracted from image successfully",
        });
      }
    } catch (error: any) {
      console.error("Error extracting colors:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to extract colors from image",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateFromKeyword = async () => {
    if (!keyword) {
      toast({
        title: "Error",
        description: "Please enter a keyword",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Call the generate-palette edge function
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-generate-palette",
        {
          body: { keyword, type: "theme" },
        },
      );

      if (error) throw error;

      if (data && data.colors) {
        setColors(data.colors);
        toast({
          title: "Palette Generated",
          description: `Colors based on "${keyword}" created successfully`,
        });
      }
    } catch (error: any) {
      console.error("Error generating palette:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate colors from keyword",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const savePalette = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save palettes",
        variant: "destructive",
      });
      return;
    }

    if (!paletteName) {
      toast({
        title: "Error",
        description: "Please enter a name for your palette",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("palettes")
        .insert([
          {
            name: paletteName,
            colors: colors,
            user_id: user.id,
            is_public: isPublic,
          },
        ])
        .select();

      if (error) throw error;

      if (data) {
        const newPalette = {
          id: data[0].id,
          name: data[0].name,
          colors: data[0].colors,
          userId: data[0].user_id,
          isPublic: data[0].is_public,
          createdAt: data[0].created_at,
        };

        setSavedPalettes([...savedPalettes, newPalette]);
        toast({
          title: "Palette Saved",
          description: `"${paletteName}" has been saved to your collection`,
        });
      }
    } catch (error) {
      console.error("Error saving palette:", error);
      toast({
        title: "Error",
        description: "Failed to save palette",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deletePalette = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("palettes")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setSavedPalettes(savedPalettes.filter((p) => p.id !== id));
      toast({
        title: "Palette Deleted",
        description: "Palette has been removed from your collection",
      });
    } catch (error) {
      console.error("Error deleting palette:", error);
      toast({
        title: "Error",
        description: "Failed to delete palette",
        variant: "destructive",
      });
    }
  };

  const publishPalette = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("palettes")
        .update({ is_public: true })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setSavedPalettes(
        savedPalettes.map((p) => (p.id === id ? { ...p, isPublic: true } : p)),
      );

      toast({
        title: "Palette Published",
        description: "Your palette is now available in the community",
      });
    } catch (error) {
      console.error("Error publishing palette:", error);
      toast({
        title: "Error",
        description: "Failed to publish palette",
        variant: "destructive",
      });
    }
  };

  const downloadPalette = (format: "png" | "json" | "css") => {
    switch (format) {
      case "png":
        // In a real implementation, you would generate a PNG
        toast({
          title: "PNG Download",
          description: "PNG download functionality will be implemented soon",
        });
        break;
      case "json":
        // Download as JSON
        const jsonData = JSON.stringify({ name: paletteName, colors }, null, 2);
        downloadFile(
          jsonData,
          `${paletteName.replace(/\s+/g, "-").toLowerCase()}.json`,
          "application/json",
        );
        break;
      case "css":
        // Download as CSS variables
        let cssContent = `:root {\n`;
        colors.forEach((color, index) => {
          cssContent += `  --color-${index + 1}: ${color.hex};\n`;
        });
        cssContent += `}\n`;
        downloadFile(
          cssContent,
          `${paletteName.replace(/\s+/g, "-").toLowerCase()}.css`,
          "text/css",
        );
        break;
    }
  };

  const downloadFile = (
    content: string,
    fileName: string,
    contentType: string,
  ) => {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const copyColorToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    toast({
      title: "Color Copied",
      description: `${hex} copied to clipboard`,
    });
  };

  const updateColor = (index: number, hex: string) => {
    const newColors = [...colors];
    const rgb = hexToRgb(hex);
    if (rgb) {
      newColors[index] = { hex, rgb };
      setColors(newColors);
    }
  };

  // Helper functions
  const rgbToHex = (r: number, g: number, b: number) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  };

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

  const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  const generateHSLColor = (h: number, s: number, l: number) => {
    // Convert HSL to RGB
    const c = ((1 - Math.abs((2 * l) / 100 - 1)) * s) / 100;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l / 100 - c / 2;

    let r, g, b;
    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }

    const rgb = {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };

    return { hex: rgbToHex(rgb.r, rgb.g, rgb.b), rgb };
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left side - Palette Creator */}
        <div className="lg:w-2/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-500" />
                <span>Color Palette Creator</span>
              </CardTitle>
              <CardDescription>
                Create, customize, and save beautiful color palettes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="manual"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="manual">Manual</TabsTrigger>
                  <TabsTrigger value="image">From Image</TabsTrigger>
                  <TabsTrigger value="keyword">From Keyword</TabsTrigger>
                </TabsList>

                <TabsContent value="manual" className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    {colors.map((color, index) => (
                      <div key={index} className="space-y-2">
                        <div
                          className="h-24 w-24 rounded-lg shadow-md cursor-pointer relative group"
                          style={{ backgroundColor: color.hex }}
                          onClick={() => copyColorToClipboard(color.hex)}
                        >
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Copy className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <Input
                          type="color"
                          value={color.hex}
                          onChange={(e) => updateColor(index, e.target.value)}
                          className="h-8 w-24 p-1"
                        />
                        <Input
                          type="text"
                          value={color.hex}
                          onChange={(e) => updateColor(index, e.target.value)}
                          className="h-8 w-24 text-xs text-center"
                        />
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={generateRandomPalette}
                    className="mt-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Random
                  </Button>
                </TabsContent>

                <TabsContent value="image" className="space-y-4">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id="imageUrl"
                          placeholder="https://example.com/image.jpg"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                        />
                        <Button
                          onClick={generateFromImage}
                          disabled={isLoading}
                          className="bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                        >
                          {isLoading ? "Extracting..." : "Extract Colors"}
                        </Button>
                      </div>
                    </div>

                    {imageUrl && (
                      <div className="mt-4 rounded-lg overflow-hidden shadow-md">
                        <img
                          src={imageUrl}
                          alt="Source for color extraction"
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/400x200?text=Invalid+Image+URL";
                          }}
                        />
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 mt-4">
                      {colors.map((color, index) => (
                        <div key={index} className="text-center">
                          <div
                            className="h-16 w-16 rounded-lg shadow-md cursor-pointer relative group"
                            style={{ backgroundColor: color.hex }}
                            onClick={() => copyColorToClipboard(color.hex)}
                          >
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Copy className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <p className="text-xs mt-1">{color.hex}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="keyword" className="space-y-4">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="keyword">Keyword or Theme</Label>
                      <div className="flex gap-2">
                        <Input
                          id="keyword"
                          placeholder="e.g. ocean, sunset, forest"
                          value={keyword}
                          onChange={(e) => setKeyword(e.target.value)}
                        />
                        <Button
                          onClick={generateFromKeyword}
                          disabled={isLoading}
                          className="bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                        >
                          {isLoading ? "Generating..." : "Generate"}
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4">
                      {colors.map((color, index) => (
                        <div key={index} className="text-center">
                          <div
                            className="h-16 w-16 rounded-lg shadow-md cursor-pointer relative group"
                            style={{ backgroundColor: color.hex }}
                            onClick={() => copyColorToClipboard(color.hex)}
                          >
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Copy className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <p className="text-xs mt-1">{color.hex}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <Label htmlFor="paletteName" className="mb-2 block">
                  Palette Name
                </Label>
                <Input
                  id="paletteName"
                  value={paletteName}
                  onChange={(e) => setPaletteName(e.target.value)}
                  placeholder="My Awesome Palette"
                />
              </div>
              <div className="flex items-end gap-2 w-full sm:w-1/2 justify-end">
                <div className="flex items-center mr-4">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <Label htmlFor="isPublic" className="ml-2">
                    Public
                  </Label>
                </div>
                <Button
                  onClick={savePalette}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Palette
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-purple-500" />
                <span>Export Options</span>
              </CardTitle>
              <CardDescription>
                Download your palette in different formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="outline"
                  onClick={() => downloadPalette("png")}
                  className="border-purple-200 hover:bg-purple-50"
                >
                  <Download className="h-4 w-4 mr-2 text-purple-500" />
                  PNG
                </Button>
                <Button
                  variant="outline"
                  onClick={() => downloadPalette("css")}
                  className="border-purple-200 hover:bg-purple-50"
                >
                  <Download className="h-4 w-4 mr-2 text-purple-500" />
                  CSS Variables
                </Button>
                <Button
                  variant="outline"
                  onClick={() => downloadPalette("json")}
                  className="border-purple-200 hover:bg-purple-50"
                >
                  <Download className="h-4 w-4 mr-2 text-purple-500" />
                  JSON
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Saved Palettes */}
        <div className="lg:w-1/3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save className="h-5 w-5 text-purple-500" />
                <span>My Palettes</span>
              </CardTitle>
              <CardDescription>Your saved color palettes</CardDescription>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[600px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
                </div>
              ) : savedPalettes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Palette className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No saved palettes yet</p>
                  <p className="text-sm">Create and save your first palette!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedPalettes.map((palette) => (
                    <div
                      key={palette.id}
                      className="border rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{palette.name}</h3>
                        <div className="flex gap-1">
                          {!palette.isPublic && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() =>
                                palette.id && publishPalette(palette.id)
                              }
                              title="Publish to Community"
                            >
                              <Share className="h-4 w-4 text-purple-500" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              palette.id && deletePalette(palette.id)
                            }
                            title="Delete Palette"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex h-10 rounded-md overflow-hidden">
                        {palette.colors.map((color, index) => (
                          <div
                            key={index}
                            className="flex-1 cursor-pointer"
                            style={{ backgroundColor: color.hex }}
                            onClick={() => copyColorToClipboard(color.hex)}
                            title={color.hex}
                          ></div>
                        ))}
                      </div>
                      {palette.isPublic && (
                        <div className="mt-2 text-xs text-gray-500 flex items-center">
                          <Share className="h-3 w-3 mr-1" />
                          Published to community
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
