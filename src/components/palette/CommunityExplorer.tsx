import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy, Download, Heart, Share, Search, Filter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../supabase/supabase";
import { useAuth } from "../../../supabase/auth";

// Complete the Color interface with appropriate properties
interface Color {
  hex: string;
  name?: string;
}

const CommunityExplorer: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [colors, setColors] = useState<Color[]>([]);

  useEffect(() => {
    // Example: fetch community palettes from Supabase
    const fetchColors = async () => {
      const { data, error } = await supabase.from("community_palettes").select("*");
      if (error) {
        toast({ title: "Error fetching palettes" });
      } else if (data) {
        // Assuming each item in data includes a hex field (and optionally a name)
        const fetchedColors = data.map((item: any) => ({
          hex: item.hex,
          name: item.name,
        }));
        setColors(fetchedColors);
      }
    };

    fetchColors();
  }, [toast]);

  return (
    <div>
      <h1>Community Explorer</h1>
      {colors.length > 0 ? (
        colors.map((color, index) => (
          <div
            key={index}
            style={{
              backgroundColor: color.hex,
              padding: "1rem",
              margin: "0.5rem 0",
              borderRadius: "4px",
            }}
          >
            <p>{color.name || color.hex}</p>
          </div>
        ))
      ) : (
        <p>No community palettes found.</p>
      )}
    </div>
  );
};

export default CommunityExplorer;
