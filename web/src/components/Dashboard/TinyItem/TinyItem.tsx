interface props {
  children: React.ReactChild;
  className?: string;
  extra?: React.HTMLProps<HTMLDivElement>;
}

export default function TinyItem(props: props) {
  return (
    <>
      <div
        className={`col-start-1 col-end-2 ${
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
