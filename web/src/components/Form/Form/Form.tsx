import { RefObject } from "react";

interface props extends React.HTMLProps<HTMLFormElement> {
  children?: React.ReactNode | React.ReactNode[] | undefined;
}

export default function Form(props: props) {
  return (
    <>
      <form {...props} method="POST">
        {props.children}
      </form>
    </>
  );
}
