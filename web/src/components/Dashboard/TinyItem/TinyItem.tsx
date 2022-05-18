interface props {
  children: React.ReactChild;
  className?: string;
  extra?: React.HTMLProps<HTMLDivElement>;
}

export default function TinyItem(props: props) {
  return (
    <>
      <div
        className={`sm:basis-3/12 basis-1/2 overflow-hidden ${
          props.className ? props.className : ""
        }`}
        {...props.extra}
      >
        {props.children}
      </div>
    </>
  );
}
