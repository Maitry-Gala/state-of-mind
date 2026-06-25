export function Input({ onChange, placeholder,value }: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string; value : string
}) {
  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        className="px-4 py-2 m-2 border rounded"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}