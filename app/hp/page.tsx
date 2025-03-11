import React from "react";
import Hero from "@/components/hp/hero"; // Hero Section
// import Bsell from "@/components/hp/bsell"; // Best Selling Products Section

const HpPage = () => {
  return (
    <div>
      <Hero /> {/* Ensure Hero is included */}
      {/* <Bsell /> Ensure Bsell is included */}
    </div>
  );
};

export default HpPage;
