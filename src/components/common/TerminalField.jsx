const disableSuggestions = {
  autoComplete: 'off',
  autoCorrect: 'off',
  autoCapitalize: 'off',
  spellCheck: false,
};

export default function TerminalField({
  as = 'input',
  label,
  value,
  onChange,
  children,
  className = '',
  fieldClassName = '',
  ...props
}) {
  const Component = as;
  const isTextInput = as === 'input' || as === 'textarea';

  return (
    <div className={fieldClassName}>
      {label && <label className="terminal-label">{label}</label>}
      <Component
        value={value}
        onChange={onChange}
        className={`input-terminal !text-xs ${as === 'textarea' ? '!p-4 leading-relaxed' : '!py-1.5'} ${className}`}
        {...(isTextInput ? disableSuggestions : {})}
        {...props}
      >
        {children}
      </Component>
    </div>
  );
}
