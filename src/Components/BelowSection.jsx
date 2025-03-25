import React, { useEffect, useRef, useState } from "react";
import img_below from "../assets/IMG_BelowSection.png";  

function BelowSection() {
  const sectionsRef = useRef([]);
  const svgRef = useRef(null);
  const pathRef = useRef(null);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          } else {
            entry.target.classList.remove("show");
          }
        });
      },
      { threshold: 0.3 }
    );

    sectionsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      sectionsRef.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (svgRef.current && pathRef.current) {
        if (currentScroll > lastScrollTop) {
          svgRef.current.classList.add("show");
          pathRef.current.classList.add("visible");
        } else {
          svgRef.current.classList.remove("show");
          pathRef.current.classList.remove("visible");
        }
      }
      setLastScrollTop(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  return (
    <div className="BelowSection">
      {/* SVG Positioned Inside BelowSection */}
      {/* <div className="svg-container" ref={svgRef}>
        <svg width="933" height="1113" viewBox="0 0 933 1113" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            ref={pathRef}
            d="M658.279 9.5C658.279 9.5 131.298 1405.63 31.0411 707.565C-69.2163 9.5 1263.85 793.438 814.963 1091.5"
            stroke="#9B5FE4"
            strokeWidth="50"
          />
        </svg>
      </div> */}

      {/* Image on the left, Text on the right (Same Line) */}
      <section className="content-row">
  {/* Left Side - Image */}
  <div className="image-left">
    <img src={img_below} alt="BOOKS" className="Img_belowsection" />
  </div>

  {/* Right Side - Text */}
  <div className="content-right">
    <h2>GET READY</h2>
    <h4>To Escape into Books!</h4>
  </div>
</section>

{/* Space after first section */}
<div className="spacer"></div>

{/* Next Section aligned to the left */}
<section className="content-left">
  <h6>Discover, Connect and</h6>
  <h6>Bond Over Books!</h6>
</section>

    </div>
  );
}

export default BelowSection;
