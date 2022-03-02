interface props {
  children: React.ReactChild;
  className?: string;
}

export default function TinyItem(props: props) {
  return (
    <>
      <div className={`w-1/4 ${props.className && props.className}`}>
        {props.children}
      </div>
    </>
  );
}
