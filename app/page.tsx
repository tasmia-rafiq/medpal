import OcrReader from "@/components/OcrReader";
import { auth } from "@/auth";
import Link from "next/link";
import { FileText, Shield, Clock, Users } from "lucide-react";

const Home = async () => {
  const session = await auth();

  return (
    <main className="min-h-screen bg-white-100 text-black font-poppins">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-primary to-secondary text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Your Medical Reports,
            <br />
            <span className="text-primary-100">Organized & Accessible</span>
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Upload medical report images, extract text with AI, and keep all your health information organized in one secure dashboard.
          </p>
          
          {session ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-primary-100 transition-all shadow-lg"
            >
              <FileText className="w-5 h-5" />
              <span>Go to Dashboard</span>
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/auth/signin"
                className="inline-flex items-center space-x-2 bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-primary-100 transition-all shadow-lg"
              >
                <Users className="w-5 h-5" />
                <span>Get Started</span>
              </Link>
              <p className="text-sm opacity-75">Sign in with Google to start managing your reports</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12">
            Why Choose MedPal?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-white-100 shadow-sm">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">AI-Powered OCR</h3>
              <p className="text-black-300">
                Advanced AI technology extracts text from your medical reports with high accuracy, making them searchable and organized.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-white-100 shadow-sm">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Secure & Private</h3>
              <p className="text-black-300">
                Your medical data is encrypted and stored securely. Only you have access to your reports and health information.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-white-100 shadow-sm">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Always Accessible</h3>
              <p className="text-black-300">
                Access your medical reports anytime, anywhere. Perfect for doctor visits, insurance claims, or personal records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* OCR Upload Section */}
      <section className="py-16 px-6 bg-white-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Try It Now
            </h2>
            <p className="text-lg text-black-300">
              Upload a medical report image and see our AI text extraction in action
            </p>
          </div>
          <OcrReader />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <FileText className="h-8 w-8 text-secondary" />
            <span className="text-2xl font-bold">MedPal</span>
          </div>
          <p className="text-primary-100 mb-4">
            Your trusted companion for medical report management
          </p>
          <p className="text-sm opacity-75">
            &copy; {new Date().getFullYear()} MedPal. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default Home;