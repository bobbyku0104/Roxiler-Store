export default function FormField({ label, name, type = 'text', value, onChange, error, as, ...rest }) {
  const Input = as === 'textarea' ? 'textarea' : 'input'

  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <Input
        id={name}
        name={name}
        type={as === 'textarea' ? undefined : type}
        value={value}
        onChange={onChange}
        className={error ? 'has-error' : ''}
        {...rest}
      />
      {error && <span className="field-error">{error}</span>}
    </div>
  )
}
