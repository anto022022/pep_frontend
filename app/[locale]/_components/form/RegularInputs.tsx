interface RegularInputsProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const RegularInputs: React.FC<RegularInputsProps> = ({
  type = "text",
  className = "",
  placeholder,
  value,
  ...rest
}) => {
  return (
    <input
      type={type}
      className={`forms-input ${className}`}
      placeholder={placeholder}
      value={value}
      {...rest}
    />
  );
};

export default RegularInputs;
