import ToTheMoon from "../../Extras/ToTheMoon";
interface props {
  children: React.ReactChild;
  className?: string;
}

export default function TinyItem(props: props) {
  return (
    <>
      <div
        className={`basis-1/2 sm:basis-9/12 ${
          props.className && props.className
        }`}
      >
        {props.children}
      </div>
    </>
  );
}
