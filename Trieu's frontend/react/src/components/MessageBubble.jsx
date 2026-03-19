export default function MessageBubble({ message }) {
  const isHuman = message.role === "human";

  return (
    <>
      <div
        className={[
          "mt-2 mb-2 w-fit max-w-[45%] rounded-xl border border-zinc-300 px-3 py-2 text-white",
          isHuman
            ? "mr-4 self-end bg-[#6b2f3cab]"
            : "ml-4 self-start bg-[#6b2f3cab]",
        ].join(" ")}
      >
        {message.text}
      </div>

      <div
        className={[
          "text-xs text-zinc-700",
          isHuman ? "mr-6 self-end" : "ml-6 self-start",
        ].join(" ")}
      >
        {message.time}
      </div>
    </>
  );
}