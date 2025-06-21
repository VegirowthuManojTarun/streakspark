// components/Diary/LinedJournalTextarea.jsx
import React, { useRef, useEffect } from "react";
import TimeStamp from "./TimeStamp";

export default function LinedJournalTextarea({ value, setValue }) {
  const textareaRef = useRef();
  const LINE_HEIGHT = 44;
  const FONT_SIZE = 18;
  const lineCount = Math.max((value.match(/\n/g) || []).length + 1, 12);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  }, [value]);

  const handleInsertTimestamp = (timestamp) => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;

    setValue(value.substring(0, start) + timestamp + value.substring(end));

    // Set cursor position after timestamp
    setTimeout(() => {
      textareaRef.current.selectionStart = start + timestamp.length;
      textareaRef.current.selectionEnd = start + timestamp.length;
      textareaRef.current.focus();
    }, 0);
  };

  return (
    <div className="relative">
      {/* Time Stamp Component */}
      <div className="absolute top-0 right-2 z-10">
        <TimeStamp onInsert={handleInsertTimestamp} />
      </div>

      <div
        className="relative px-8 md:px-12"
        style={{
          minHeight: `${lineCount * LINE_HEIGHT + 32}px`,
          background: `repeating-linear-gradient(
            white, white ${LINE_HEIGHT - 1}px, #fce8d1 ${
            LINE_HEIGHT - 1
          }px, white ${LINE_HEIGHT}px
          )`,
        }}
      >
        <textarea
          ref={textareaRef}
          className="block w-full min-w-0 bg-transparent pt-4 font-journal text-[18px] leading-[44px] outline-none resize-none"
          style={{
            fontFamily: `'Special Elite', 'Courier New', Courier, monospace`,
            fontSize: FONT_SIZE,
            lineHeight: `${LINE_HEIGHT}px`,
            minHeight: `${lineCount * LINE_HEIGHT}px`,
            maxHeight: `${lineCount * LINE_HEIGHT}px`,
            color: "#33220c",
            background: "none",
            border: "none",
            boxShadow: "none",
          }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={lineCount}
          spellCheck={true}
          placeholder="Start your day, your way..."
        />
      </div>
    </div>
  );
}
