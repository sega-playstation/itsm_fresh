import React, { useState, useEffect } from "react";

export default function Loading() {
  const [open, setOpen] = useState(true);
  const [counter, setCounter] = useState(3);

  useEffect(() => {
    if (open) {
      counter > 0 && setTimeout(() => setCounter(counter - 1), 7500);
    }
  }, [counter, open]);

  return (
    <>
      <div className="spinner">
        {counter !== 0 ? (
          <>
            <span>Loading. . .</span>
            <div className="half-spinner"></div>
          </>
        ) : (
          <h1>No Rows Found</h1>
        )}
      </div>
    </>
  );
}
