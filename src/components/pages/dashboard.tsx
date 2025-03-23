import { useState, useEffect } from "react";
import { useAuth } from "../../../supabase/auth";
import { supabase } from "../../../supabase/supabase";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingScreen } from "@/components/ui/loading-spinner";
import ColorPaletteCreator from "../palette/ColorPaletteCreator";
import GradientGenerator from "../palette/GradientGenerator";
import ColorUtilities from "../palette/ColorUtilities";
import CommunityExplorer from "../palette/CommunityExplorer";
import { Palette, Sliders, Users, LogOut } from "lucide-react";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("palettes");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setUserProfile(data);
      } else {
        // Create a profile if it doesn't exist
        await createUserProfile();
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .insert([
          {
            id: user?.id,
            full_name: user?.user_metadata?.full_name || "",
            avatar_url: user?.user_metadata?.avatar_url || "",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error("Error creating user profile:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (isLoading) {
    return <LoadingScreen text="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Palette className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Colorverse
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                    alt={user?.email || ""}
                  />
                  <AvatarFallback>
                    {user?.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">
                  {userProfile?.full_name || user?.email}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-gray-500"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          defaultValue="palettes"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <TabsList className="grid grid-cols-4 gap-4">
              <TabsTrigger value="palettes" className="py-3">
                <Palette className="h-5 w-5 mr-2" />
                Color Palettes
              </TabsTrigger>
              <TabsTrigger value="gradients" className="py-3">
                <Sliders className="h-5 w-5 mr-2" />
                Gradient Generator
              </TabsTrigger>
              <TabsTrigger value="utilities" className="py-3">
                <Palette className="h-5 w-5 mr-2" />
                Color Utilities
              </TabsTrigger>
              <TabsTrigger value="community" className="py-3">
                <Users className="h-5 w-5 mr-2" />
                Community
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="palettes" className="space-y-6">
            <ColorPaletteCreator />
          </TabsContent>

          <TabsContent value="gradients" className="space-y-6">
            <GradientGenerator />
          </TabsContent>

          <TabsContent value="utilities" className="space-y-6">
            <ColorUtilities />
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <CommunityExplorer />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
