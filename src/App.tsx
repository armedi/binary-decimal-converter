import { Binary, Hash } from "lucide-react";
import { useState, KeyboardEvent, ChangeEvent } from "react";

function App() {
  const [binaryInput, setBinaryInput] = useState("");
  const [decimalInput, setDecimalInput] = useState("");
  const [binaryResult, setBinaryResult] = useState("");
  const [decimalResult, setDecimalResult] = useState("");
  const [integerExplanation, setIntegerExplanation] = useState<string[]>([]);
  const [fractionalExplanation, setFractionalExplanation] = useState<string[]>([]);
  const [conversionType, setConversionType] = useState<
    "binaryToDecimal" | "decimalToBinary"
  >("binaryToDecimal");

  const roundToDecimalPlaces = (num: number, decimalPlaces: number): number => {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(num * factor) / factor;
  };

  const validateBinaryInput = (value: string): string => {
    return value.replace(/[^01.]/g, '');
  };

  const validateDecimalInput = (value: string): string => {
    return value.replace(/[^0-9.]/g, '');
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (conversionType === "binaryToDecimal") {
      setBinaryInput(validateBinaryInput(newValue));
    } else {
      setDecimalInput(validateDecimalInput(newValue));
    }
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
      const result = convertBinaryToDecimal(binaryInput);
      setDecimalResult(result);
    } else {
      const result = convertDecimalToBinary(parseFloat(decimalInput));
      setBinaryResult(result);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleConvert();
    }
  };

  const handleConversionTypeChange = (type: "binaryToDecimal" | "decimalToBinary") => {
    setConversionType(type);
    // Do not clear inputs or results to preserve state
    // Do not clear explanations to preserve state
  };

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
              onClick={() => handleConversionTypeChange("binaryToDecimal")}
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
              onClick={() => handleConversionTypeChange("decimalToBinary")}
            >
              <Hash className="mr-2" size={18} />
              <span>Decimal to Binary</span>
            </button>
          </div>
        </div>
        <div className="mb-6">
          <label
            htmlFor="input"
            className="block text-sm font-medium text-slate-600 mb-2"
          >
            Enter {conversionType === "binaryToDecimal" ? "Binary" : "Decimal"}{" "}
            Number
          </label>
          <input
            type="text"
            id="input"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-700"
            value={conversionType === "binaryToDecimal" ? binaryInput : decimalInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={
              conversionType === "binaryToDecimal"
                ? "e.g., 1010.11"
                : "e.g., 10.75"
            }
          />
        </div>
        <button
          className="w-full bg-slate-600 text-white py-2 px-4 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 transition-colors duration-200"
          onClick={handleConvert}
        >
          Convert
        </button>
        {(binaryResult || decimalResult) && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2 text-slate-700">Result:</h2>
            <p className="bg-slate-100 p-3 rounded text-lg text-slate-700">
              {conversionType === "binaryToDecimal" ? decimalResult : binaryResult}
            </p>
          </div>
        )}
        {(integerExplanation.length > 0 || fractionalExplanation.length > 0) && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4 text-slate-700">
              Step-by-step Explanation:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-100 p-4 rounded">
                <h3 className="font-semibold mb-2 text-slate-600">Integer Part</h3>
                <ol className="list-decimal list-inside text-slate-700">
                  {integerExplanation.map((step, index) => (
                    <li key={index} className="mb-1">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
              {fractionalExplanation.length > 0 && (
                <div className="bg-slate-100 p-4 rounded">
                  <h3 className="font-semibold mb-2 text-slate-600">Fractional Part</h3>
                  <ol className="list-decimal list-inside text-slate-700">
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
