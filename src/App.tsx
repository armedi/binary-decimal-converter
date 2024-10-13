import { Binary, Hash } from "lucide-react";
import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [integerExplanation, setIntegerExplanation] = useState<string[]>([]);
  const [fractionalExplanation, setFractionalExplanation] = useState<string[]>([]);
  const [conversionType, setConversionType] = useState<
    "binaryToDecimal" | "decimalToBinary"
  >("binaryToDecimal");

  const roundToDecimalPlaces = (num: number, decimalPlaces: number): number => {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(num * factor) / factor;
  };

  const convertBinaryToDecimal = (binary: string): string => {
    const parts = binary.split(".");
    let decimal = 0;
    const intSteps: string[] = [];
    const fracSteps: string[] = [];

    intSteps.push(`Converting binary ${parts[0] || "0"} to decimal:`);
    if (parts[1]) fracSteps.push(`Converting binary 0.${parts[1]} to decimal:`);

    // Integer part
    if (parts[0]) {
      for (let i = 0; i < parts[0].length; i++) {
        const bit = parseInt(parts[0][i]);
        const power = parts[0].length - 1 - i;
        const value = bit * Math.pow(2, power);
        decimal += value;
        intSteps.push(`${bit} × 2^${power} = ${value}`);
      }
    }

    // Fractional part
    if (parts[1]) {
      for (let i = 0; i < parts[1].length; i++) {
        const bit = parseInt(parts[1][i]);
        const power = -(i + 1);
        const value = bit * Math.pow(2, power);
        decimal += value;
        fracSteps.push(`${bit} × 2^${power} = ${roundToDecimalPlaces(value, 5)}`);
      }
    }

    intSteps.push(`Sum of integer values: ${Math.floor(decimal)}`);
    if (parts[1]) fracSteps.push(`Sum of fractional values: ${roundToDecimalPlaces(decimal - Math.floor(decimal), 5)}`);
    
    setIntegerExplanation(intSteps);
    setFractionalExplanation(fracSteps);
    return roundToDecimalPlaces(decimal, 5).toString();
  };

  const convertDecimalToBinary = (decimal: number): string => {
    const intPart = Math.floor(decimal);
    const fracPart = roundToDecimalPlaces(decimal - intPart, 5);
    let binary = "";
    const intSteps: string[] = [];
    const fracSteps: string[] = [];

    intSteps.push(`Converting decimal ${intPart} to binary:`);
    if (fracPart > 0) fracSteps.push(`Converting decimal ${fracPart} to binary:`);

    // Convert integer part
    if (intPart > 0) {
      let temp = intPart;
      const intBits: string[] = [];
      while (temp > 0) {
        intSteps.push(
          `${temp} ÷ 2 = ${Math.floor(temp / 2)} remainder ${temp % 2}`
        );
        intBits.unshift((temp % 2).toString());
        temp = Math.floor(temp / 2);
      }
      binary = intBits.join("");
      intSteps.push(`Binary representation of integer part: ${binary}`);
    } else {
      binary = "0";
      intSteps.push(`Integer part is 0, binary representation: 0`);
    }

    // Convert fractional part
    if (fracPart > 0) {
      binary += ".";
      let fraction = fracPart;
      const maxPrecision = 10; // Limit to 10 decimal places
      for (let i = 0; i < maxPrecision && fraction !== 0; i++) {
        fraction = roundToDecimalPlaces(fraction, 5);
        fracSteps.push(
          `Step ${i + 1}: ${fraction} × 2 = ${roundToDecimalPlaces(fraction * 2, 5)}`
        );
        fraction *= 2;
        const bit = Math.floor(fraction);
        binary += bit;
        fracSteps.push(`Integer part: ${bit}, becomes next binary digit`);
        fraction -= bit;
        fracSteps.push(`Remaining fraction: ${roundToDecimalPlaces(fraction, 5)}`);
        if (fraction === 0) {
          fracSteps.push(`Fraction becomes 0, conversion complete`);
          break;
        }
      }
      if (fraction !== 0) {
        fracSteps.push(
          `Note: Result truncated to ${maxPrecision} decimal places for binary fraction.`
        );
      }
    }

    intSteps.push(`Final binary result (integer part): ${binary.split('.')[0]}`);
    if (fracPart > 0) fracSteps.push(`Final binary result (fractional part): ${binary.split('.')[1] || ''}`);
    
    setIntegerExplanation(intSteps);
    setFractionalExplanation(fracSteps);
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Binary-Decimal Converter
        </h1>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Conversion Type
          </label>
          <div className="flex justify-center space-x-4">
            <button
              className={`flex items-center px-4 py-2 rounded-full transition-colors duration-200 ${
                conversionType === "binaryToDecimal"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setConversionType("binaryToDecimal")}
            >
              <Binary className="mr-2" size={18} />
              <span>Binary to Decimal</span>
            </button>
            <button
              className={`flex items-center px-4 py-2 rounded-full transition-colors duration-200 ${
                conversionType === "decimalToBinary"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setConversionType("decimalToBinary")}
            >
              <Hash className="mr-2" size={18} />
              <span>Decimal to Binary</span>
            </button>
          </div>
        </div>
        <div className="mb-6">
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
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
          onClick={handleConvert}
        >
          Convert
        </button>
        {result && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2 text-blue-600">Result:</h2>
            <p className="bg-gray-100 p-3 rounded text-lg">{result}</p>
          </div>
        )}
        {(integerExplanation.length > 0 || fractionalExplanation.length > 0) && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">
              Step-by-step Explanation:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded">
                <h3 className="font-semibold mb-2 text-blue-500">Integer Part</h3>
                <ol className="list-decimal list-inside">
                  {integerExplanation.map((step, index) => (
                    <li key={index} className="mb-1">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
              {fractionalExplanation.length > 0 && (
                <div className="bg-gray-100 p-4 rounded">
                  <h3 className="font-semibold mb-2 text-blue-500">Fractional Part</h3>
                  <ol className="list-decimal list-inside">
                    {fractionalExplanation.map((step, index) => (
                      <li key={index} className="mb-1">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
