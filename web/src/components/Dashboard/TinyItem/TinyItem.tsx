interface props {
  children: React.ReactChild;
  className?: string;
  extra?: React.HTMLProps<HTMLDivElement>;
}

export default function TinyItem(props: props) {
  return (
    <>
      <div
        className={`w-1/4 ${
          props.className &&
          props.className.concat(props.extra?.className ?? "")
        }`}
        {...props.extra}
      >
        {props.children}
      </div>
    </>
  );
}
