export function SectionHeading({ title }: { title: string }) {
  return (
    <div className="my-5 flex w-full items-center">
      <div className="h-[2px] flex-1 rounded-full bg-[#e9ecef]"></div>
      <h4 className="vulf-mono mx-2 text-sm font-normal italic text-zinc-300">{title}</h4>
      <div className="h-[2px] w-[5%] rounded-full bg-[#e9ecef]"></div>
    </div>
  );
}
