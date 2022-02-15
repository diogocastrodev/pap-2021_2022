interface props {
  children: React.ReactNode;
}

export default function SectionList(props: props) {
  return <div className="flex flex-row justify-evenly">{props.children}</div>;
}
