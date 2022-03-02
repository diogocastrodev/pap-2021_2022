interface props extends React.LabelHTMLAttributes<HTMLLabelElement> {
  text: string;
  required?: boolean;
}

export default function Label(props: props) {
  return (
    <label
      {...props}
      className={`block text-black text-opacity-90 text-lg font-semibold pl-2 mb-1.5 capitalize ${props.className}`}
    >
      {props.text}
      {props.required && <span className="text-red-500">{" *"}</span>}
    </label>
  );
}
