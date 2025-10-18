import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

interface Message {
  sender: string;
  content: string;
  isRead?: boolean;
}

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sender, setSender] = useState("User 1");
  const [content, setContent] = useState("");
  const [typingStatus, setTypingStatus] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch messages and connect to WebSocket
  useEffect(() => {
    axios.get<Message[]>("http://localhost:3001/messages").then((res) => {
      const withRead = res.data.map((msg) => ({
        ...msg,
        isRead: true, // all fetched are read
      }));
      setMessages(withRead);
    });

    const socket = new WebSocket("ws://localhost:3001");
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "message") {
        const isFromMe = data.payload.sender === sender;
        setMessages((prev) => [
          ...prev,
          { ...data.payload, isRead: isFromMe },
        ]);
      } else if (data.type === "typing") {
        setTypingStatus(data.payload);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          setTypingStatus(null);
        }, 2000);
      }
    };

    return () => {
      socket.close();
    };
  }, [sender]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    // Set unread messages as read (simplified logic)
    setMessages((prev) =>
      prev.map((msg) => ({ ...msg, isRead: true }))
    );
  }, [messages]);

  const sendMessage = () => {
    if (socketRef.current && content.trim()) {
      socketRef.current.send(
        JSON.stringify({
          type: "message",
          payload: { sender, content },
        })
      );
      setContent("");
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
    if (socketRef.current) {
      socketRef.current.send(
        JSON.stringify({
          type: "typing",
          payload: sender,
        })
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-2xl shadow-lg bg-white">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">💬 Live Chat</h1>

      <div className="mb-4">
        <input
          className="w-full border rounded px-3 py-2 mb-2"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          placeholder="Your name"
        />
      </div>

      <div className="h-80 overflow-y-auto border p-4 rounded-lg bg-gray-50 space-y-2 mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg w-fit max-w-[80%] ${
              msg.sender === sender
                ? "ml-auto bg-blue-100 text-blue-900"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            <p className="text-sm font-semibold">{msg.sender}</p>
            <p className="text-sm">{msg.content}</p>
            {msg.sender === sender && (
              <span className="text-xs text-gray-500 block text-right">
                {msg.isRead ? "Read" : "Unread"}
              </span>
            )}
          </div>
        ))}
        {typingStatus && (
          <div className="italic text-sm text-gray-500">
            {typingStatus} is typing<span className="animate-pulse">...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          value={content}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};


export const Playground = () => {
  // const editorRef = useRef<HTMLDivElement>(null);

  // const applyStyle = (tag: keyof HTMLElementTagNameMap) => {
  //   const selection = window.getSelection();
  //   if (!selection || selection.rangeCount === 0) return;
  //   const range = selection.getRangeAt(0);
  //   const span = document.createElement(tag);
  //   span.appendChild(range.extractContents());
  //   range.insertNode(span);
  // };

  // const insertLink = () => {
  //   const url = prompt("Enter the link URL:");
  //   if (!url) return;
  //   document.execCommand(
  //     "insertHTML",
  //     false,
  //     `<a href='${url}' target='_blank'>${url}</a>`
  //   );
  // };

  // const insertImage = () => {
  //   const url = prompt("Enter the image URL:");
  //   if (!url) return;
  //   document.execCommand(
  //     "insertHTML",
  //     false,
  //     `<img src='${url}' alt='Image' class='max-w-full' />`
  //   );
  // };

  return (
    <>
      {/* <BarcodeScannerComponent
        width={500}
        height={500}
        torch
        onError={(err) => console.log({ err })}
        onUpdate={async (err, result) => {
          if (result) {
            alert(`${result.getText()}`);
            const byte = new Uint8Array(result.getRawBytes());
            const decode = new TextDecoder().decode(byte);
            console.log({
              err,
              result,
              res: result?.getText(),
              byte: result.getRawBytes(),
              decode,
            });
          }
        }}
      />
      <div className="border p-4 rounded-lg w-full max-w-2xl mx-auto">
        <div className="flex gap-2 mb-2 border-b pb-2">
          <button
            onClick={() => applyStyle("b")}
            className="px-3 py-1 border rounded"
          >
            B
          </button>
          <button
            onClick={() => applyStyle("i")}
            className="px-3 py-1 border rounded"
          >
            I
          </button>
          <button
            onClick={() => applyStyle("u")}
            className="px-3 py-1 border rounded"
          >
            U
          </button>
          <button
            onClick={() => applyStyle("ol")}
            className="px-3 py-1 border rounded"
          >
            OL
          </button>
          <button
            onClick={() => applyStyle("ul")}
            className="px-3 py-1 border rounded"
          >
            UL
          </button>
          <button onClick={insertLink} className="px-3 py-1 border rounded">
            🔗
          </button>
          <button onClick={insertImage} className="px-3 py-1 border rounded">
            🖼
          </button>
        </div>
        <div
          ref={editorRef}
          contentEditable
          className="min-h-[150px] border p-2 rounded outline-none"
          onInput={(e) => console.log({ e })}
          dangerouslySetInnerHTML={{ __html: "" }}
        />
      </div> */}
      <Chat />
    </>
  );
};
