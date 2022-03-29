interface props {
  children: React.ReactChild | React.ReactChild[];
  className?: string;
}

export default function Item(props: props) {
  return (
    <>
      <div
        className={`w-full h-full bg-white rounded-lg shadow-lg ${props.className}`}
      >
        {props.children}
      </div>
    </>
  );
}
