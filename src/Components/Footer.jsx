import React from "react";

function Footer() {
  return (
    <footer className="text-center bg-body-tertiary">
      {/* Grid container */}
      <div className="container pt-4">
        {/* Section: Social media */}
        <section className="mb-4">
          {/* Social Media Links */}
          {[
            { href: "#", icon: "facebook-f" },
            { href: "#", icon: "twitter" },
            { href: "#", icon: "google" },
            { href: "#", icon: "instagram" },
            { href: "#", icon: "linkedin" },
            { href: "#", icon: "github" }
          ].map((social, index) => (
            <a
              key={index}
              className="btn btn-link btn-floating btn-lg text-body m-1"
              href={social.href}
              role="button"
            >
              <i className={`fab fa-${social.icon}`}></i>
            </a>
          ))}
        </section>
      </div>

      {/* Copyright */}
      <div className="text-center p-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}>
        © {new Date().getFullYear()} All Rights Reserved
      </div>
    </footer>
  );
}

export default Footer;
