interface BlipsProps {
  name: string;
  amount: number;
  space?: boolean;
  plural: string;
  blip: {
    color: "green" | "orange" | "red";
  };
  mainDiv?: {
    className: string;
  };
}

export default function CounterBlips(props: BlipsProps) {
  return (
    <div
      className={`flex items-center ${props.space && "mt-1"} ${
        props.mainDiv && props.mainDiv.className
      }`}
    >
      <div
        className={`w-3 h-3 rounded-full ${
          props.blip.color === "green"
            ? "bg-green-500"
            : props.blip.color === "orange"
            ? "bg-orange-400"
            : props.blip.color === "red"
            ? "bg-red-400"
            : "bg-transparent"
        }`}
      ></div>
      <div className="pl-2">{`${
        props.amount !== 0
          ? (props.amount > 1 ? props.plural : props.name) + ": "
          : ""
      } ${
        props.amount === 0
          ? "Não foram encontrados produtos " + props.plural
          : props.amount
      }`}</div>
    </div>
  );
}
