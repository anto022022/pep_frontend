import { FC, InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}
const InputField: FC<InputFieldProps> = ({ className, ...rest }) => {
  return (
    <div className={`input-wrapper ${className}`}>
      <input {...rest} className={`forms-input ${className ?? ""}`} />
    </div>
  );
};

export default InputField;
