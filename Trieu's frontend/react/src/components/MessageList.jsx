import MessageBubble from "./MessageBubble";

export default function MessageList({ messages, isWaiting, logRef }) {
  return (
    <div
      ref={logRef}
      className="mx-auto flex h-[80vh] w-full max-w-5xl flex-1 flex-col overflow-y-auto rounded-xl border border-zinc-300 bg-white/70 pb-12 shadow-lg backdrop-blur-[1px]"
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isWaiting && (
        <div className="ml-4 mt-2 mb-2 inline-flex w-fit max-w-[45%] self-start rounded-xl bg-zinc-200 px-3 py-3">
          <span className="mx-[2px] h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-600 [animation-delay:0ms]" />
          <span className="mx-[2px] h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-600 [animation-delay:150ms]" />
          <span className="mx-[2px] h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-600 [animation-delay:300ms]" />
        </div>
      )}
    </div>
  );
}
