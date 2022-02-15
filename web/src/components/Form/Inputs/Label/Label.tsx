interface props {
  className?: string;
  text: string;
  customElement?: React.ReactElement;
  input?: {
    required: boolean;
  };
}

export default function Label(props: props) {
  return (
    <span
      className={`block text-black text-opacity-90 text-lg font-semibold pl-2 mb-1.5 capitalize  ${
        props.className && props.className
      }`}
    >
      {props.customElement ? props.customElement : props.text}
      {props.input && props.input.required && (
        <span className="text-red-500">{" *"}</span>
      )}
    </span>
  );
}
