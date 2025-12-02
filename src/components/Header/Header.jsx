<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import "./Header.css";

const slides = [
  {
    id: 1,
    title: "Hello, I’m ChatGPT 🤖",
    text: "Your AI assistant built by OpenAI, here to help with coding, writing, and more!",
    image: "https://picsum.photos/id/1015/1200/600",
  },
  {
    id: 2,
    title: "What I Do 💡",
    text: "I can explain code, fix bugs, brainstorm ideas, or even help you learn step by step.",
    image: "https://picsum.photos/id/1016/1200/600",
  },
  {
    id: 3,
    title: "Let’s Build Together 🚀",
    text: "From projects to personal growth, I’m here to support you along the way.",
    image: "https://picsum.photos/id/1018/1200/600",
  },
  {
    id: 4,
    title: "Let’s Build Together 🚀",
    text: "From projects to personal growth, I’m here to support you along the way.",
    image: "https://picsum.photos/id/1019/1200/600",
  },
];

const Header = () => {
  const [current, setCurrent] = useState(0);

  // Next & Prev
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index) => setCurrent(index);

  // Auto-play every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000); // change slide every 4s
    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div className="header-slideshow-container" id="home">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`mySlides fade ${index === current ? "active" : ""}`}
          style={{
            display: index === current ? "block" : "none",
            backgroundImage: `url(${slide.image})`,
          }}
        >
          <div className="header-overlay">
            <h2>{slide.title}</h2>
            <p>{slide.text}</p>
          </div>
        </div>
      ))}

      {/* Navigation buttons */}
      <a className="prev" onClick={prevSlide}>
        &#10094;
      </a>
      <a className="next" onClick={nextSlide}>
        &#10095;
      </a>

      {/* Dots */}
      <div className="dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === current ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Header;
=======
import React, { useState, useEffect } from "react";
import "./Header.css";

const slides = [
  {
    id: 1,
    title: "Hello, I’m ChatGPT 🤖",
    text: "Your AI assistant built by OpenAI, here to help with coding, writing, and more!",
    image: "https://picsum.photos/id/1015/1200/600",
  },
  {
    id: 2,
    title: "What I Do 💡",
    text: "I can explain code, fix bugs, brainstorm ideas, or even help you learn step by step.",
    image: "https://picsum.photos/id/1016/1200/600",
  },
  {
    id: 3,
    title: "Let’s Build Together 🚀",
    text: "From projects to personal growth, I’m here to support you along the way.",
    image: "https://picsum.photos/id/1018/1200/600",
  },
  {
    id: 4,
    title: "Let’s Build Together 🚀",
    text: "From projects to personal growth, I’m here to support you along the way.",
    image: "https://picsum.photos/id/1019/1200/600",
  },
];

const Header = () => {
  const [current, setCurrent] = useState(0);

  // Next & Prev
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index) => setCurrent(index);

  // Auto-play every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000); // change slide every 4s
    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div className="header-slideshow-container" id="home">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`mySlides fade ${index === current ? "active" : ""}`}
          style={{
            display: index === current ? "block" : "none",
            backgroundImage: `url(${slide.image})`,
          }}
        >
          <div className="header-overlay">
            <h2>{slide.title}</h2>
            <p>{slide.text}</p>
          </div>
        </div>
      ))}

      {/* Navigation buttons */}
      <a className="prev" onClick={prevSlide}>
        &#10094;
      </a>
      <a className="next" onClick={nextSlide}>
        &#10095;
      </a>

      {/* Dots */}
      <div className="dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === current ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Header;
>>>>>>> 007b7f6c1bf4d38fcd9d2edaa09c27edd04a2cea
