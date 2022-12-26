import React from 'react';

export function FileSize({ fileSize }: { fileSize: number }) {
  let sizeWithUnit = "";

  if (fileSize < 1024) {
    sizeWithUnit = `${fileSize.toFixed(2)} Byte`;
  } else if (fileSize < 1024 * 1024) {
    sizeWithUnit = `${(fileSize / 1024).toFixed(2)} KB`;
  } else if (fileSize < 1024 * 1024 * 1024) {
    sizeWithUnit = `${((fileSize / 1024) * 1024).toFixed(2)} MB`;
  } else {
    sizeWithUnit = `${((fileSize / 1024) * 1024 * 1024).toFixed(2)} GB`;
  }

  return (
    <span style={{ display: "block", fontSize: "14px", fontFamily: "Infer" }}>
      {sizeWithUnit}
    </span>
  );
}