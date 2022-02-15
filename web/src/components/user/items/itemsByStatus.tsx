import SmallSection from "@src/components/Sections/SmallSection";
import CounterBlips from "./blips/Blips";

interface props {
  name: string;
  amount: number;
  plural: string;
  blip: {
    color: "green" | "orange" | "red";
  };
}

export default function ItemsByStatus(props: props) {
  return (
    /* Wrapper */
    <div>
      <div className="mt-10 bg-gray-300 px-2 py-2 rounded-t-lg shadow-xl">
        <CounterBlips
          name={props.name}
          amount={props.amount}
          plural={props.plural}
          blip={{
            color: props.blip.color,
          }}
          mainDiv={{
            className: "pl-2",
          }}
        />
      </div>
      <div className="bg-gray-200 h-60 pt-2 rounded-b-lg shadow-lg flex items-center space-x-2 justify-evenly">
        <SmallSection />
        <SmallSection />
      </div>
    </div>
  );
}
