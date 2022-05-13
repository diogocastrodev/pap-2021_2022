interface props {
  children: React.ReactChild;
  className?: string;
}

export default function TinyItem(props: props) {
  return (
    <>
      <div
        className={`col-start-2 col-end-5 ${
          props.className && props.className
        }`}
      >
        {props.children}
      </div>
    </>
  );
}
