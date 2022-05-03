interface props extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode | React.ReactNode[] | undefined;
}

export default function InputGroup(props: props) {
  return (
    <>
      <div className={`w-full flex flex-col`}>{props.children}</div>
    </>
  );
}
