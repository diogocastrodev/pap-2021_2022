interface props {}

export default function SmallSection(props: props) {
  return (
    <div className="w-80 h-52 bg-gray-50 rounded-lg shadow-md flex flex-col">
      <div className="bg-gray-500 self-center w-full h-32 rounded-lg rounded-b-xl" />
      <div className=" pt-1 pl-2 flex-row">
        <span className="text-xl">Nissan</span>
      </div>
    </div>
  );
}
