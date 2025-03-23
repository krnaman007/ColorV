import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronRight,
  Settings,
  User,
  Search,
  Palette,
  Image,
  Download,
  Share,
  Eye,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";

const trendingPalettes = [
  {
    id: 1,
    name: "Ocean Breeze",
    colors: ["#1A535C", "#4ECDC4", "#F7FFF7", "#FF6B6B", "#FFE66D"],
  },
  {
    id: 2,
    name: "Sunset Vibes",
    colors: ["#F9C80E", "#F86624", "#EA3546", "#662E9B", "#43BCCD"],
  },
  {
    id: 3,
    name: "Forest Calm",
    colors: ["#2D3047", "#419D78", "#E0A458", "#FFDBB5", "#C04ABC"],
  },
];

const paletteOfTheDay = {
  id: 4,
  name: "Cosmic Harmony",
  colors: ["#2B2D42", "#8D99AE", "#EDF2F4", "#EF233C", "#D90429"],
  description:
    "A balanced palette inspired by cosmic elements, perfect for modern interfaces with a touch of energy.",
};

export default function LandingPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full bg-[rgba(255,255,255,0.8)] backdrop-blur-md border-b border-[#f5f5f7]/30">
        <div className="max-w-[1200px] mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Link to="/" className="font-bold text-2xl flex items-center">
              <Palette className="h-6 w-6 mr-2 text-purple-600" />
              <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Colorverse
              </span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-6">
              <Link
                to="/"
                className="text-sm font-medium hover:text-purple-600 transition-colors"
              >
                Explore
              </Link>
              <Link
                to="/"
                className="text-sm font-medium hover:text-purple-600 transition-colors"
              >
                Create
              </Link>
              <Link
                to="/"
                className="text-sm font-medium hover:text-purple-600 transition-colors"
              >
                Community
              </Link>
              <Link
                to="/"
                className="text-sm font-medium hover:text-purple-600 transition-colors"
              >
                Tools
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search palettes..."
                className="pl-10 w-64 h-10 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className="text-sm font-medium hover:text-purple-600"
                  >
                    My Palettes
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-9 w-9 hover:cursor-pointer ring-2 ring-purple-100">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                        alt={user.email || ""}
                      />
                      <AvatarFallback>
                        {user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-xl border-none shadow-lg"
                  >
                    <DropdownMenuLabel className="text-xs text-gray-500">
                      {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={() => signOut()}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-sm font-medium hover:text-purple-600"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:opacity-90 text-sm px-6">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero section */}
        <section className="py-20 bg-gradient-to-b from-white to-purple-50">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 text-left mb-10 md:mb-0 md:pr-10">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                    Create
                  </span>{" "}
                  beautiful color palettes with ease
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Colorverse is a comprehensive color palette tool that helps
                  designers and developers create, customize, and share stunning
                  color schemes.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/signup">
                    <Button className="rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:opacity-90 text-md px-8 py-6 h-auto">
                      Start Creating
                    </Button>
                  </Link>
                  <Link to="/">
                    <Button
                      variant="outline"
                      className="rounded-full border-purple-200 text-md px-8 py-6 h-auto"
                    >
                      Explore Palettes
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="relative bg-white p-6 rounded-2xl shadow-xl">
                  <div className="flex gap-2 mb-4">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="grid grid-cols-5 gap-3 mb-6">
                    {paletteOfTheDay.colors.map((color, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg shadow-md"
                        style={{ backgroundColor: color }}
                      ></div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{paletteOfTheDay.name}</h3>
                      <p className="text-xs text-gray-500">
                        Palette of the Day
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                        <Download className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                        <Share className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Palettes */}
        <section className="py-16 bg-white">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold">Trending Palettes</h2>
              <Link
                to="/"
                className="text-purple-600 flex items-center hover:underline"
              >
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {trendingPalettes.map((palette) => (
                <div
                  key={palette.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="flex h-32">
                    {palette.colors.map((color, index) => (
                      <div
                        key={index}
                        className="flex-1"
                        style={{ backgroundColor: color }}
                      ></div>
                    ))}
                  </div>
                  <div className="p-5">
                    <h3 className="font-medium text-lg mb-2">{palette.name}</h3>
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-1">
                        {palette.colors.map((color, index) => (
                          <div
                            key={index}
                            className="h-6 w-6 rounded-full border border-gray-200"
                            style={{ backgroundColor: color }}
                          ></div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                          <Download className="h-4 w-4 text-gray-600" />
                        </button>
                        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                          <Share className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="py-20 bg-purple-50">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Everything you need to create and manage beautiful color palettes
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm text-left">
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Palette className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="text-xl font-medium mb-2">
                  Palette Creation Tools
                </h4>
                <p className="text-gray-600">
                  Create palettes manually or generate them automatically from
                  images and keywords.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm text-left">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Download className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="text-xl font-medium mb-2">Export Options</h4>
                <p className="text-gray-600">
                  Export your palettes in multiple formats including JSON, CSS,
                  PNG, and SVG.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm text-left">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Share className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="text-xl font-medium mb-2">Community Features</h4>
                <p className="text-gray-600">
                  Share, rate, and collaborate on palettes with other designers
                  in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tools showcase */}
        <section className="py-20 bg-white">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-10 text-left">
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <Image className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Generate from Images</h2>
                    <p className="text-gray-600">
                      Extract beautiful color palettes from any image
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                  <div className="aspect-video bg-gradient-to-r from-blue-400 to-purple-500 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <Image className="h-12 w-12" />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between mb-2">
                      <div className="flex space-x-2">
                        {[
                          "#6B46C1",
                          "#805AD5",
                          "#9F7AEA",
                          "#B794F4",
                          "#D6BCFA",
                        ].map((color, index) => (
                          <div
                            key={index}
                            className="h-8 w-8 rounded-md"
                            style={{ backgroundColor: color }}
                          ></div>
                        ))}
                      </div>
                      <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                        <Download className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                <Link
                  to="/"
                  className="text-purple-600 flex items-center hover:underline"
                >
                  Try image generator <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-3xl p-10 text-left">
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Eye className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Accessibility Tools</h2>
                    <p className="text-gray-600">
                      Test your palettes for different types of color blindness
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h4 className="text-sm font-medium mb-2">Normal Vision</h4>
                    <div className="flex space-x-2">
                      {[
                        "#EF4444",
                        "#F59E0B",
                        "#10B981",
                        "#3B82F6",
                        "#8B5CF6",
                      ].map((color, index) => (
                        <div
                          key={index}
                          className="h-8 w-8 rounded-md"
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h4 className="text-sm font-medium mb-2">Protanopia</h4>
                    <div className="flex space-x-2">
                      {[
                        "#A1A1AA",
                        "#D4D4D8",
                        "#A1A1AA",
                        "#71717A",
                        "#52525B",
                      ].map((color, index) => (
                        <div
                          key={index}
                          className="h-8 w-8 rounded-md"
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h4 className="text-sm font-medium mb-2">Deuteranopia</h4>
                    <div className="flex space-x-2">
                      {[
                        "#A1A1AA",
                        "#E4E4E7",
                        "#A1A1AA",
                        "#71717A",
                        "#3F3F46",
                      ].map((color, index) => (
                        <div
                          key={index}
                          className="h-8 w-8 rounded-md"
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h4 className="text-sm font-medium mb-2">Tritanopia</h4>
                    <div className="flex space-x-2">
                      {[
                        "#EF4444",
                        "#F43F5E",
                        "#EC4899",
                        "#8B5CF6",
                        "#6366F1",
                      ].map((color, index) => (
                        <div
                          key={index}
                          className="h-8 w-8 rounded-md"
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  to="/"
                  className="text-blue-600 flex items-center hover:underline"
                >
                  Test your palette <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-500 text-white">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">
              Ready to create amazing color palettes?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of designers and developers who use Colorverse to
              create stunning color schemes.
            </p>
            <Link to="/signup">
              <Button className="rounded-full bg-white text-purple-600 hover:bg-gray-100 text-md px-8 py-6 h-auto font-medium">
                Get Started for Free
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 text-sm">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4 flex items-center">
                <Palette className="h-5 w-5 mr-2 text-purple-400" />
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Colorverse
                </span>
              </h4>
              <p className="text-gray-400 mb-4">
                A comprehensive color palette tool for designers and developers.
              </p>
              <div className="flex space-x-4">
                <Link to="/" className="text-gray-400 hover:text-white">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link to="/" className="text-gray-400 hover:text-white">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link to="/" className="text-gray-400 hover:text-white">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Features</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    Palette Creator
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    Image Extractor
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    Export Tools
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    Accessibility
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">
                    GDPR
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-400">
              © 2025 Colorverse. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
