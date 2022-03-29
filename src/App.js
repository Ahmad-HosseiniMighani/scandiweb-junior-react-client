import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Products from "./components/products/Products";
import Product from "./components/singleProduct/Product";
import { Currency } from "./contexts";

class App extends React.Component {
  state = {
    currentCurrency: {
      label: "",
      symbol: "",
    },
    setCurrency: () => {},
  };
  componentDidMount() {
    //get it from the Yeeeeeeeeeeeeeeeeeet!
    this.setState({
      currentCurrency: { label: "USD", symbol: "$" },
      setCurrency: (newCurrency) => {
        this.setState({ currentCurrency: newCurrency });
      },
    });
  }
  render() {
    return (
      // <React.Fragment>
      <Currency.Provider value={this.state}>
        <Navbar />
        <Routes>
          {/* 
              Replacing might not be ideal here, but we have no homepage and i dont know if we're going to have or not, so for now i redirect it to category page (all) 
              Also, i assuming that category "all" will be there (always) so with these ideas we can do:
              */}
          <Route path="/" element={<Navigate to="category/all" replace />} />
          <Route path="/category" element={<Products />}>
            <Route path=":categoryName" element={<Products />} />
            <Route index element={<Navigate to="*" replace />} />
          </Route>
          <Route path="/product" element={<Product />}>
            <Route path=":productId" element={<Product />} />
            <Route index element={<Navigate to="*" replace />} />
          </Route>
          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!...sorry i have to say... BITCH!</p>
              </main>
            }
          />
        </Routes>
        {/* </React.Fragment> */}
      </Currency.Provider>
    );
  }
}

export default App;
// function App() {
//   return (
//     // <React.Fragment>
//     <Currency.Provider
//       value={{
//         currencyLabel: "USD",
//         setCurrency: (newCurrencyLabel) => {
//           console.log(this);
//           this.currencyLabel = newCurrencyLabel;
//         },
//       }}
//     >
//       <Navbar />
//       <Routes>
//         {/*
//         Replacing might not be ideal here, but we have no homepage and i dont know if we're going to have or not, so for now i redirect it to category page (all)
//         Also, i assuming that category "all" will be there (always) so with these ideas we can do:
//         */}
//         <Route path="/" element={<Navigate to="category/all" replace />} />
//         <Route path="/category" element={<Products />}>
//           <Route path=":categoryName" element={<Products />} />
//           <Route index element={<Navigate to="*" replace />} />
//         </Route>
//         <Route path="/product" element={<Product />}>
//           <Route path=":productId" element={<Product />} />
//           <Route index element={<Navigate to="*" replace />} />
//         </Route>
//         <Route
//           path="*"
//           element={
//             <main style={{ padding: "1rem" }}>
//               <p>There's nothing here!...sorry i have to say... BITCH!</p>
//             </main>
//           }
//         />
//       </Routes>
//       {/* </React.Fragment> */}
//     </Currency.Provider>
//   );
// }

// export default App;
