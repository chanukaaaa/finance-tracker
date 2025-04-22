import React, { useState, useEffect } from "react";

export const Loader = () => {
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
    }}>
      <span class="loader">
        <span class="loader-inner"></span>
      </span>
    </div>
  );
};
