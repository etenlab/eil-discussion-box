import React from "react";

/**
 * Primary UI for Date format, ex: Today at 7:54 AM or 12/01/2022 4:54 PM
 */
export function DateViewer({ date }: { date: Date }) {
  const todayDate = new Date().toLocaleDateString();

  let dateString = date.toLocaleDateString();
  const timeString = date.toLocaleTimeString();

  if (dateString === todayDate) {
    dateString = "Today at";
  }

  const transformedDate = `${dateString} ${timeString}`;

  return (
    <span
      style={{
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 300,
        fontSize: "12px",
        lineHeight: "15px",
        textAlign: "center",
        opacity: 0.5,
      }}
    >
      {transformedDate}
    </span>
  );
}
