import { useState } from "react";
import { Binary, Hash } from "lucide-react";
import Converter from "./Converter";

function App() {
  const [conversionType, setConversionType] = useState<
    "binaryToDecimal" | "decimalToBinary"
  >("binaryToDecimal");

  const handleConversionTypeChange = (type: "binaryToDecimal" | "decimalToBinary") => {
    setConversionType(type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center py-12 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-slate-800 animate-fade-in">
          Binary-Decimal Converter
        </h1>
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-600 mb-3">
            Conversion Type
          </label>
          <div className="flex justify-center space-x-6">
            <button
              className={`mode-selection-button flex items-center px-6 py-3 rounded-full transition-all duration-300 ${
                conversionType === "binaryToDecimal"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                  : "bg-slate-200 hover:bg-slate-300 text-slate-700"
              }`}
              onClick={() => handleConversionTypeChange("binaryToDecimal")}
            >
              <Binary className="mr-3" />
              <span>Binary to Decimal</span>
            </button>
            <button
              className={`mode-selection-button flex items-center px-6 py-3 rounded-full transition-all duration-300 ${
                conversionType === "decimalToBinary"
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md"
                  : "bg-slate-200 hover:bg-slate-300 text-slate-700"
              }`}
              onClick={() => handleConversionTypeChange("decimalToBinary")}
            >
              <Hash className="mr-3" />
              <span>Decimal to Binary</span>
            </button>
          </div>
        </div>
        <div className="flip-container">
          <div className={`flipper ${conversionType === "decimalToBinary" ? "flip" : ""}`}>
            <div className="front bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-inner">
              <Converter mode="binaryToDecimal" />
            </div>
            <div className="back bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl shadow-inner">
              <Converter mode="decimalToBinary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
