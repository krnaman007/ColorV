import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Copy, Download, Sparkles, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../supabase/supabase";
import { useAuth } from "../../../supabase/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GradientStop {
  color: string;
  position: number;
}

interface Gradient {
  type: "linear" | "radial" | "conic";
  angle: number; // for linear gradients
  stops: GradientStop[];
}

export default function GradientGenerator() {
  const { user } = useAuth();
  const [gradient, setGradient] = useState<Gradient>({
    type: "linear",
    angle: 90,
    stops: [
      { color: "#6366F1", position: 0 },
      { color: "#8B5CF6", position: 100 },
    ],
  });
  const [cssCode, setCssCode] = useState("");
  const [previewSize, setPreviewSize] = useState({ width: 400, height: 200 });
  const { toast } = useToast();

  // Update CSS code whenever gradient changes
  React.useEffect(() => {
    updateCssCode();
  }, [gradient]);

  const updateCssCode = () => {
    let gradientCSS = "";
    const sortedStops = [...gradient.stops].sort(
      (a, b) => a.position - b.position,
    );

    const stopsString = sortedStops
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(", ");

    if (gradient.type === "linear") {
      gradientCSS = `background: linear-gradient(${gradient.angle}deg, ${stopsString});`;
    } else if (gradient.type === "radial") {
      gradientCSS = `background: radial-gradient(circle, ${stopsString});`;
    } else if (gradient.type === "conic") {
      gradientCSS = `background: conic-gradient(from ${gradient.angle}deg, ${stopsString});`;
    }

    setCssCode(gradientCSS);
  };

  const addStop = () => {
    if (gradient.stops.length >= 5) {
      toast({
        title: "Maximum Stops Reached",
        description: "You can have a maximum of 5 color stops",
        variant: "destructive",
      });
      return;
    }

    // Calculate a position between existing stops
    const positions = gradient.stops.map((stop) => stop.position);
    const minPos = Math.min(...positions);
    const maxPos = Math.max(...positions);
    const middlePos = Math.round((minPos + maxPos) / 2);

    // Generate a random color
    const randomColor = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;

    setGradient({
      ...gradient,
      stops: [...gradient.stops, { color: randomColor, position: middlePos }],
    });
  };

  const removeStop = (index: number) => {
    if (gradient.stops.length <= 2) {
      toast({
        title: "Minimum Stops Required",
        description: "You need at least 2 color stops for a gradient",
        variant: "destructive",
      });
      return;
    }

    setGradient({
      ...gradient,
      stops: gradient.stops.filter((_, i) => i !== index),
    });
  };

  const updateStopColor = (index: number, color: string) => {
    const newStops = [...gradient.stops];
    newStops[index].color = color;
    setGradient({ ...gradient, stops: newStops });
  };

  const updateStopPosition = (index: number, position: number) => {
    const newStops = [...gradient.stops];
    newStops[index].position = position;
    setGradient({ ...gradient, stops: newStops });
  };

  const updateGradientType = (type: "linear" | "radial" | "conic") => {
    setGradient({ ...gradient, type });
  };

  const updateGradientAngle = (angle: number) => {
    setGradient({ ...gradient, angle });
  };

  const generateRandomGradient = () => {
    // Generate 2-4 random stops
    const numStops = Math.floor(Math.random() * 3) + 2; // 2 to 4 stops
    const newStops: GradientStop[] = [];

    for (let i = 0; i < numStops; i++) {
      const position =
        i === 0
          ? 0
          : i === numStops - 1
            ? 100
            : Math.floor(Math.random() * 80) + 10;
      const color = `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`;
      newStops.push({ color, position });
    }

    // Sort by position
    newStops.sort((a, b) => a.position - b.position);

    // Random type and angle
    const types: Array<"linear" | "radial" | "conic"> = [
      "linear",
      "radial",
      "conic",
    ];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomAngle = Math.floor(Math.random() * 360);

    setGradient({
      type: randomType,
      angle: randomAngle,
      stops: newStops,
    });

    toast({
      title: "Random Gradient",
      description: "A new random gradient has been generated",
    });
  };

  const copyCSS = () => {
    navigator.clipboard.writeText(cssCode);
    toast({
      title: "CSS Copied",
      description: "Gradient CSS copied to clipboard",
    });
  };

  const downloadCSS = () => {
    const element = document.createElement("a");
    const file = new Blob(
      [
        `.gradient {
  ${cssCode}
  width: 100%;
  height: 300px;
}`,
      ],
      { type: "text/css" },
    );
    element.href = URL.createObjectURL(file);
    element.download = "gradient.css";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "CSS Downloaded",
      description: "Gradient CSS file has been downloaded",
    });
  };

  const saveGradient = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save gradients",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("gradients")
        .insert([
          {
            name: "My Gradient",
            gradient_data: {
              type: gradient.type,
              angle: gradient.angle,
              stops: gradient.stops,
              css: cssCode,
            },
            user_id: user.id,
            is_public: false,
          },
        ])
        .select();

      if (error) throw error;

      toast({
        title: "Gradient Saved",
        description: "Your gradient has been saved to your collection",
      });
    } catch (error: any) {
      console.error("Error saving gradient:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save gradient",
        variant: "destructive",
      });
    }
  };

  const getGradientStyle = () => {
    const sortedStops = [...gradient.stops].sort(
      (a, b) => a.position - b.position,
    );
    const stopsString = sortedStops
      .map((stop) => `${stop.color} ${stop.position}%`)
      .join(", ");

    if (gradient.type === "linear") {
      return {
        background: `linear-gradient(${gradient.angle}deg, ${stopsString})`,
      };
    } else if (gradient.type === "radial") {
      return { background: `radial-gradient(circle, ${stopsString})` };
    } else {
      return {
        background: `conic-gradient(from ${gradient.angle}deg, ${stopsString})`,
      };
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Gradient Generator</CardTitle>
          <CardDescription>
            Create beautiful gradients for your designs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div
              className="rounded-lg shadow-md overflow-hidden"
              style={{
                ...getGradientStyle(),
                width: "100%",
                height: `${previewSize.height}px`,
              }}
            ></div>
          </div>

          {/* Controls */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Gradient Type</Label>
                <Select
                  value={gradient.type}
                  onValueChange={(value) =>
                    updateGradientType(value as "linear" | "radial" | "conic")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gradient type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="radial">Radial</SelectItem>
                    <SelectItem value="conic">Conic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(gradient.type === "linear" || gradient.type === "conic") && (
                <div className="space-y-2">
                  <Label>Angle: {gradient.angle}°</Label>
                  <Slider
                    value={[gradient.angle]}
                    min={0}
                    max={360}
                    step={1}
                    onValueChange={(value) => updateGradientAngle(value[0])}
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Color Stops</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addStop}
                    className="h-8 text-xs"
                  >
                    Add Stop
                  </Button>
                </div>

                <div className="space-y-3">
                  {gradient.stops.map((stop, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        type="color"
                        value={stop.color}
                        onChange={(e) => updateStopColor(index, e.target.value)}
                        className="w-12 h-8 p-1"
                      />
                      <div className="flex-1">
                        <Slider
                          value={[stop.position]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={(value) =>
                            updateStopPosition(index, value[0])
                          }
                        />
                      </div>
                      <div className="w-10 text-xs text-center">
                        {stop.position}%
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStop(index)}
                        className="h-8 w-8 p-0 text-red-500"
                        disabled={gradient.stops.length <= 2}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>CSS Code</Label>
                <div className="relative">
                  <pre className="bg-gray-50 p-3 rounded-md text-sm overflow-x-auto">
                    {cssCode}
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                    onClick={copyCSS}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={generateRandomGradient}
                  className="flex-1"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Random
                </Button>
                <Button
                  variant="outline"
                  onClick={downloadCSS}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download CSS
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center gap-2">
            <Label htmlFor="previewHeight" className="text-sm">
              Preview Height:
            </Label>
            <Input
              id="previewHeight"
              type="number"
              value={previewSize.height}
              onChange={(e) =>
                setPreviewSize({
                  ...previewSize,
                  height: parseInt(e.target.value) || 200,
                })
              }
              className="w-20 h-8"
              min={100}
              max={500}
            />
            <span className="text-sm">px</span>
          </div>
          <Button
            className="bg-gradient-to-r from-purple-600 to-blue-500 text-white"
            onClick={saveGradient}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Gradient
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
