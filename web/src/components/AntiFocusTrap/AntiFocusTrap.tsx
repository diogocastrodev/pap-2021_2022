interface props {
  pos: {
    x: number;
    y: number;
  };
}

export default function AntiFocusTrap({ pos }: props) {
  return (
    <>
      <button
        className="absolute -z-20 h-0 w-0 overflow-hidden bg-transparent"
        style={{
          top: pos.y,
          left: pos.x,
        }}
      />
    </>
  );
}
