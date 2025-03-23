import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Palette, CheckCircle, ArrowRight } from "lucide-react";

export default function Success() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2">
            Account Created Successfully!
          </h2>

          <p className="text-gray-600 mb-6">
            Thank you for joining Colorverse! We've sent a confirmation email to
            your inbox. Please verify your email address to complete the
            registration process.
          </p>

          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              What's next?
            </h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li className="flex items-start">
                <span className="mr-2">1.</span>
                <span>Check your email inbox for the verification link</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">2.</span>
                <span>
                  Click the verification link to activate your account
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">3.</span>
                <span>
                  Return to Colorverse and sign in to start creating amazing
                  color palettes
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col space-y-3">
            <Link to="/login">
              <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:opacity-90">
                Go to Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link to="/">
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl border-purple-200"
              >
                <Palette className="mr-2 h-5 w-5 text-purple-600" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Didn't receive the email? Check your spam folder or{" "}
          <Link
            to="/login"
            className="text-purple-600 hover:underline font-medium"
          >
            try signing in
          </Link>{" "}
          to resend the verification.
        </p>
      </div>
    </div>
  );
}
