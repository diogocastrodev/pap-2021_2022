interface props {
  children: React.ReactChild | React.ReactChild[];
}

export default function Item(props: props) {
  return (
    <>
      <div className="w-full h-full bg-white rounded-lg shadow-lg">
        {props.children}
      </div>
    </>
  );
}
