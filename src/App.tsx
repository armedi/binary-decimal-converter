import { Binary, Hash } from "lucide-react";
import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [explanation, setExplanation] = useState<string[]>([]);
  const [conversionType, setConversionType] = useState<
    "binaryToDecimal" | "decimalToBinary"
  >("binaryToDecimal");

  const convertBinaryToDecimal = (binary: string): string => {
    const parts = binary.split(".");
    let decimal = 0;
    const steps: string[] = [];

    steps.push(`Converting binary ${binary} to decimal:`);

    // Integer part
    if (parts[0]) {
      for (let i = 0; i < parts[0].length; i++) {
        const bit = parseInt(parts[0][i]);
        const power = parts[0].length - 1 - i;
        const value = bit * Math.pow(2, power);
        decimal += value;
        steps.push(`${bit} × 2^${power} = ${value}`);
      }
    }

    // Fractional part
    if (parts[1]) {
      for (let i = 0; i < parts[1].length; i++) {
        const bit = parseInt(parts[1][i]);
        const power = -(i + 1);
        const value = bit * Math.pow(2, power);
        decimal += value;
        steps.push(`${bit} × 2^${power} = ${value}`);
      }
    }

    steps.push(`Sum of all values: ${decimal}`);
    setExplanation(steps);
    return decimal.toString();
  };

  const convertDecimalToBinary = (decimal: number): string => {
    const intPart = Math.floor(decimal);
    const fracPart = decimal - intPart;
    let binary = "";
    const steps: string[] = [];

    steps.push(`Converting decimal ${decimal} to binary:`);

    // Convert integer part
    if (intPart > 0) {
      steps.push(`Integer part: ${intPart}`);
      let temp = intPart;
      const intSteps: string[] = [];
      while (temp > 0) {
        intSteps.unshift(
          `${temp} ÷ 2 = ${Math.floor(temp / 2)} remainder ${temp % 2}`
        );
        binary = (temp % 2) + binary;
        temp = Math.floor(temp / 2);
      }
      steps.push(...intSteps);
      steps.push(`Binary representation of integer part: ${binary}`);
    } else {
      binary = "0";
      steps.push(`Integer part is 0, binary representation: 0`);
    }

    // Convert fractional part
    if (fracPart > 0) {
      steps.push(`Fractional part: ${fracPart}`);
      binary += ".";
      let fraction = fracPart;
      const maxPrecision = 10; // Limit to 10 decimal places
      for (let i = 0; i < maxPrecision && fraction !== 0; i++) {
        steps.push(
          `  Step ${i + 1}: ${fraction} × 2 = ${(fraction * 2).toFixed(10)}`
        );
        fraction *= 2;
        const bit = Math.floor(fraction);
        binary += bit;
        steps.push(`    Integer part: ${bit}, becomes next binary digit`);
        fraction -= bit;
        steps.push(`    Remaining fraction: ${fraction.toFixed(10)}`);
        if (fraction === 0) {
          steps.push(`    Fraction becomes 0, conversion complete`);
          break;
        }
      }
      if (fraction !== 0) {
        steps.push(
          `Note: Result truncated to ${maxPrecision} decimal places for binary fraction.`
        );
      }
    }

    steps.push(`Final binary result: ${binary}`);
    setExplanation(steps);
    return binary;
  };

  const handleConvert = () => {
    if (conversionType === "binaryToDecimal") {
      setResult(convertBinaryToDecimal(input));
    } else {
      setResult(convertDecimalToBinary(parseFloat(input)));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Binary-Decimal Converter
        </h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Conversion Type
          </label>
          <div className="flex justify-center space-x-4">
            <button
              className={`px-4 py-2 rounded ${
                conversionType === "binaryToDecimal"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setConversionType("binaryToDecimal")}
            >
              <Binary className="inline-block mr-2" size={18} />
              Binary to Decimal
            </button>
            <button
              className={`px-4 py-2 rounded ${
                conversionType === "decimalToBinary"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setConversionType("decimalToBinary")}
            >
              <Hash className="inline-block mr-2" size={18} />
              Decimal to Binary
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter {conversionType === "binaryToDecimal" ? "Binary" : "Decimal"}{" "}
            Number
          </label>
          <input
            type="text"
            id="input"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              conversionType === "binaryToDecimal"
                ? "e.g., 1010.11"
                : "e.g., 10.75"
            }
          />
        </div>
        <button
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={handleConvert}
        >
          Convert
        </button>
        {result && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Result:</h2>
            <p className="bg-gray-100 p-2 rounded">{result}</p>
          </div>
        )}
        {explanation.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">
              Step-by-step Explanation:
            </h2>
            <ol className="list-decimal list-inside bg-gray-100 p-4 rounded">
              {explanation.map((step, index) => (
                <li key={index} className="mb-1">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
