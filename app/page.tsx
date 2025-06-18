import OcrReader from "@/components/OcrReader";

const Home = () => {
  return (
    <main className="min-h-screen bg-white-100 text-black font-poppins">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-primary to-secondary text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Extract Text from Your Medical Report Images
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Upload a report image, and we’ll help you convert it to clean, readable text — fast and easy.
          </p>
        </div>
      </section>

      {/* OCR Upload Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <OcrReader />
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-black-300 text-sm">
        &copy; {new Date().getFullYear()} MediVault. All rights reserved.
      </footer>
    </main>
  );
};

export default Home;