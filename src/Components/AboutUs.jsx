import React from 'react';
import { FaBookOpen, FaUsers, FaGlobe, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa6";
import { SiGoodreads } from 'react-icons/si';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us">
      <header>
        <div className="logo">📚</div>
        <h1>About Our Literary Journey</h1>
        <p className="tagline">
          Discover the story behind our passion for reading challenges and community building
        </p>
      </header>

      <div className="container">
        {/* Mission */}
        <section className="section">
          <h2 className="section-title">Our Mission</h2>
          <p className="mission-statement">
            We believe in the transformative power of reading. Our mission is to create engaging reading 
            challenges that inspire people to explore new genres, discover diverse voices, and build a 
            lifelong love for literature. Through our platform, we aim to foster a global community of 
            readers who support and motivate each other.
          </p>
        </section>

        {/* Story */}
        <section className="section">
          <h2 className="section-title">Our Story</h2>
          <p>
            BookBond began as a small book club with a simple idea: reading 
            is better when shared with friends. What started as a casual gathering of book lovers has 
            evolved into a thriving community of thousands of readers worldwide.
          </p>
          <br />
          <p>
            Our founders, avid readers themselves, realized how difficult it can be to keep reading 
            habits alive in a busy world. They designed challenges, badges, and community activities 
            to make reading engaging and rewarding. Today, we’ve helped members discover new stories 
            and build lasting friendships through books.
          </p>
        </section>

        {/* Challenges */}
        <section className="section">
          <h2 className="section-title">The Power of Challenges</h2>
          <p>
            Reading challenges aren’t just goals—they are journeys. Each challenge encourages you to 
            step out of your comfort zone, discover new authors, and share experiences with fellow 
            readers. Books have the power to change perspectives, spark creativity, and connect people 
            beyond borders. Our challenges are designed to make every page meaningful.
          </p>
        </section>

        {/* Values */}
        <section className="section">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon"><FaBookOpen /></div>
              <h3 className="value-title">Lifelong Learning</h3>
              <p>Every book offers new perspectives and knowledge, contributing to personal growth.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><FaUsers /></div>
              <h3 className="value-title">Friends Through Books</h3>
              <p>Books create friendships that grow stronger with every story shared.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><FaGlobe /></div>
              <h3 className="value-title">Diversity & Inclusion</h3>
              <p>We champion diverse voices and strive to make literature accessible to everyone.</p>
            </div>
          </div>
        </section>

        {/* About site */}
        <section className="section">
          <h2 className="section-title">About This Site</h2>
          <p>
            BookBond is built with ❤️ by <strong>Ramani</strong>, dedicated to creating a space 
            where books, challenges, and friendships come together. This is more than just a platform—
            it’s a journey for every reader.
          </p>
        </section>

        {/* CTA */}
        <div className="cta-section">
          <h2 className="cta-title">Join Our Reading Community Today</h2>
          <p>Become part of a global network of readers and discover your next literary adventure.</p>
          <a href="#" className="cta-button">Start Your Journey</a>
        </div>
      </div>

      <footer>
        <div className="social-links">
          <a href="#"><FaFacebook /></a>
          <a href="#"><FaTwitter /></a>
          <a href="#"><FaInstagram /></a>
          <a href="#"><SiGoodreads /></a>
        </div>
        <p>&copy; 2025 BookBond. Made with ❤️ by Ramani. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutUs;
