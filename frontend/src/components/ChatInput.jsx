export default function ChatInput({
  inputRef,
  input,
  setInput,
  isWaiting,
  sendMessage,
}) {
  return (
    <div className="mx-auto mt-4 mb-20 flex w-full max-w-5xl items-end justify-center gap-3">
      <textarea
        ref={inputRef}
        value={input}
        disabled={isWaiting}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
        placeholder={
          isWaiting ? "Waiting for response..." : "Type in your question ..."
        }
        className="min-h-[64px] w-full resize-none rounded-xl border-2 border-zinc-300 bg-white px-3 py-2 text-lg outline-none transition focus:border-zinc-500 disabled:cursor-not-allowed disabled:bg-zinc-400 disabled:text-black disabled:opacity-100
        disabled:cursor-not-allowed
        disabled:bg-zinc-300
        disabled:text-zinc-500
        disabled:opacity-70"
      />

      <button
        onClick={sendMessage}
        disabled={isWaiting}
        className="flex h-[75px] w-[70px] shrink-0 items-center justify-center rounded-xl border border-zinc-300 bg-[#6b2f3c] shadow disabled:opacity-70"
      >
        <img
          src="/img/jag-send.png"
          alt="send"
          className="h-25 w-100 object-contain"
        />
      </button>
    </div>
  );
}
