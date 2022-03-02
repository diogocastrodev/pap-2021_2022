interface props extends React.HTMLProps<HTMLFormElement> {
  children?: React.ReactNode | React.ReactNode[] | undefined;
}

export default function Form(props: props) {
  return (
    <>
      <form {...props}>{props.children}</form>
    </>
  );
}
