import { Binary, Hash } from "lucide-react";
import { useState } from "react";

import Converter from "./Converter";

function App() {
  const [conversionType, setConversionType] = useState<
    "binaryToDecimal" | "decimalToBinary"
  >("binaryToDecimal");

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-slate-700">
          Binary-Decimal Converter
        </h1>
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Conversion Type
          </label>
          <div className="flex justify-center space-x-4">
            <button
              className={`flex items-center px-4 py-2 rounded-full transition-colors duration-200 ${
                conversionType === "binaryToDecimal"
                  ? "bg-slate-600 text-white"
                  : "bg-slate-200 hover:bg-slate-300 text-slate-700"
              }`}
              onClick={() => setConversionType("binaryToDecimal")}
            >
              <Binary className="mr-2" size={18} />
              <span>Binary to Decimal</span>
            </button>
            <button
              className={`flex items-center px-4 py-2 rounded-full transition-colors duration-200 ${
                conversionType === "decimalToBinary"
                  ? "bg-slate-600 text-white"
                  : "bg-slate-200 hover:bg-slate-300 text-slate-700"
              }`}
              onClick={() => setConversionType("decimalToBinary")}
            >
              <Hash className="mr-2" size={18} />
              <span>Decimal to Binary</span>
            </button>
          </div>
        </div>
        <div className={conversionType !== "binaryToDecimal" ? "hidden" : ""}>
          <Converter mode="binaryToDecimal" />
        </div>
        <div className={conversionType !== "decimalToBinary" ? "hidden" : ""}>
          <Converter mode="decimalToBinary" />
        </div>
      </div>
    </div>
  );
}

export default App;
