import { useState } from "react";
import { useAuth } from "../../../supabase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import { Palette, Eye, EyeOff, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Password validation
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password === confirmPassword && password !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    if (
      !hasMinLength ||
      !hasUpperCase ||
      !hasLowerCase ||
      !hasNumber ||
      !hasSpecialChar
    ) {
      setError("Password does not meet requirements");
      return;
    }

    try {
      setIsSubmitting(true);
      await signUp(email, password, fullName);
      toast({
        title: "Account created",
        description: "Please check your email to confirm your account",
      });
      navigate("/success");
    } catch (error: any) {
      console.error("Signup error:", error);
      setError(error.message || "An error occurred during sign up");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-14 w-14 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center">
                <Palette className="h-7 w-7 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Join Colorverse
            </h2>
            <p className="text-gray-500 mt-2">
              Create an account to start your color journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="fullName"
                className="text-sm font-medium text-gray-700"
              >
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-12 rounded-xl border-gray-200 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl border-gray-200 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 rounded-xl border-gray-200 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Password strength indicators */}
              <div className="space-y-1 mt-2">
                <div className="flex items-center text-xs">
                  {hasMinLength ? (
                    <Check className="h-3.5 w-3.5 text-green-500 mr-1" />
                  ) : (
                    <X className="h-3.5 w-3.5 text-gray-300 mr-1" />
                  )}
                  <span
                    className={
                      hasMinLength ? "text-green-600" : "text-gray-500"
                    }
                  >
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center text-xs">
                  {hasUpperCase ? (
                    <Check className="h-3.5 w-3.5 text-green-500 mr-1" />
                  ) : (
                    <X className="h-3.5 w-3.5 text-gray-300 mr-1" />
                  )}
                  <span
                    className={
                      hasUpperCase ? "text-green-600" : "text-gray-500"
                    }
                  >
                    At least one uppercase letter
                  </span>
                </div>
                <div className="flex items-center text-xs">
                  {hasLowerCase ? (
                    <Check className="h-3.5 w-3.5 text-green-500 mr-1" />
                  ) : (
                    <X className="h-3.5 w-3.5 text-gray-300 mr-1" />
                  )}
                  <span
                    className={
                      hasLowerCase ? "text-green-600" : "text-gray-500"
                    }
                  >
                    At least one lowercase letter
                  </span>
                </div>
                <div className="flex items-center text-xs">
                  {hasNumber ? (
                    <Check className="h-3.5 w-3.5 text-green-500 mr-1" />
                  ) : (
                    <X className="h-3.5 w-3.5 text-gray-300 mr-1" />
                  )}
                  <span
                    className={hasNumber ? "text-green-600" : "text-gray-500"}
                  >
                    At least one number
                  </span>
                </div>
                <div className="flex items-center text-xs">
                  {hasSpecialChar ? (
                    <Check className="h-3.5 w-3.5 text-green-500 mr-1" />
                  ) : (
                    <X className="h-3.5 w-3.5 text-gray-300 mr-1" />
                  )}
                  <span
                    className={
                      hasSpecialChar ? "text-green-600" : "text-gray-500"
                    }
                  >
                    At least one special character
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-12 rounded-xl border-gray-200 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 pr-10"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {confirmPassword &&
                    (passwordsMatch ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    ))}
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:opacity-90 text-sm font-medium"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>

            <div className="text-sm text-center text-gray-600 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-600 hover:underline font-medium"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
