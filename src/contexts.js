import React from "react";
export const Currency = React.createContext({
  currentCurrency: {
    label: "",
    symbol: "",
  },
  setCurrency: () => {},
});
