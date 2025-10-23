import React from "react";
import { RegisterOptions } from "react-hook-form";
import { AiSparkIcon } from "../../Icons/SVGIcons";

interface TextAreaProps {
  label?: string;
  placeholder?: string;
  name: string;
  // register: UseFormRegister<any>;
  validation?: RegisterOptions;
  aiFunc?: (value: string) => Promise<string>;
  optionalTxt?: string;
  value?: any;
  onChange?: (value: string) => void;
  loading?: boolean;
  setDescription?: React.Dispatch<React.SetStateAction<string>>;
  isActive: boolean;
}

const InputAi: React.FC<TextAreaProps> = ({
  label,
  placeholder,
  name,
  // register,
  aiFunc,
  optionalTxt,
  value,
  loading,
  onChange,
  isActive,
}) => {
  const handleAI = async () => {
    if (aiFunc && value !== undefined) {

      const aiGeneratedText = await aiFunc(value?.description);

      onChange?.(aiGeneratedText);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange?.(val);
  };

  return (
    <div className="textarea-comp">
      {label && (
        <label className="t-c-label">
          {label}{" "}
          {optionalTxt && <span className="f-g-label-dim">{optionalTxt}</span>}
        </label>
      )}
      <div className={`input-ai-block ${loading ? "ai-loading" : ""}`}>
        <input
          name={name}
          className="forms-input"
          placeholder={placeholder}
          // {...register(name, validation)}
          value={value}
          onChange={handleChange}
          disabled={loading}
        ></input>

        {aiFunc && isActive && (
          <button type="button" className="btn-comp btn-ai" onClick={handleAI}>
            <AiSparkIcon />
            <span className="b-i-txt">
              {" "}
              {loading ? "Generating..." : "Write with AI "}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default InputAi;
