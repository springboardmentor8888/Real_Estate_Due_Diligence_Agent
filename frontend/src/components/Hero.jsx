import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay">
       <h1>Real Estate Due Diligence Agent</h1>

       <p>
         Verify Property • Analyze Documents • Minimize Risk • Make Confident Decisions
       </p>

        <div className="hero-buttons">
          <button className="primary-btn">Explore Properties</button>
          <button className="secondary-btn">Contact Us</button>
        </div>
      </div>
    </section>
  );
}