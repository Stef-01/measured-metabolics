/* app.jsx — compose all sections + mount */
const { Nav, Hero, Difference, WhatWeTest, ProgressTracked, Journey, Program,
  EverythingIncluded, Pricing, Doctor, VideoBand, Quotes, FAQ, CTA, Footer, Funnel } = window;

function App() {
  return (
    <React.Fragment>
      <Nav />
      <main>
        <Hero />
        <Difference />
        <WhatWeTest />
        <ProgressTracked />
        <Journey />
        <EverythingIncluded />
        <Program />
        <Pricing />
        <Doctor />
        <VideoBand />
        <Quotes />
        <FAQ />
        <CTA />
      </main>
      <Footer />
      <Funnel />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
