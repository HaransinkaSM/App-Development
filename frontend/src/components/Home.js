import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Homecss.css';
import image1 from './images/image1.jpg';
import image2 from './images/image2.jpg';
import image3 from './images/image3.jpg';
import frameImage1 from './images/frameImage1.jpg';
import frameImage2 from './images/frameImage2.jpg';
import frameImage3 from './images/frameImage3.jpg';
import frameImage4 from './images/frameImage4.jpg';
import frameImage5 from './images/frameImage5.jpg';
import frameImage6 from './images/frameImage6.jpg';
import staticImage from './images/staticImage.jpg';
import gifSource from './images/video.gif';

const images = [image1, image2, image3];
const frameImages = [frameImage1, frameImage2, frameImage3, frameImage4, frameImage5, frameImage6];

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleImageClick = () => {
    navigate('/Product');
  };

  return (
    <div className="home-container">
      <div className="image-slider">
        <img src={images[currentImageIndex]} alt="Slider" className="slider-image" />
        <div className="overlay-text">THE BEST OR NOTHING.</div>
      </div>
      <div className="new-collections">
        <h1>New collections</h1>
      </div>
      <div className="frame-container">
        {frameImages.map((src, index) => (
          <div className="frame" key={index} onClick={handleImageClick}>
            <img src={src} alt={`Frame ${index + 1}`} className="frame-image" />
            <div className="frame-text"> </div>
          </div>
        ))}
      </div>
      <div className="static-image" onClick={handleImageClick}>
        <img src={staticImage} alt="Static" className="static-image-img" />
      </div>
      <div className="gif-section">
        <img src={gifSource} alt="Animated GIF" className="gif-player" />
      </div>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <p>About</p>
            <br />
            <p>Welcome to METRO, your one-stop destination for the latest in fashion and athletic gear. We are passionate about providing our customers with high-quality products that meet their style and performance needs. At METRO, we believe in the power of individuality and self-expression, which is why we offer customization options for many of our products. Whether you're looking to add a personal touch to your sneakers, customize your apparel with unique designs, or select specific features for your athletic gear, we have the tools to help you create something uniquely yours. Our team of experts is here to assist you every step of the way, ensuring that your customized product meets your exact specifications and preferences.</p>
          </div>
          <div className="footer-center">
            <br />
            <br />
            <br />
            <br />
            <br />
            <p>Email: contact@metro.com</p>
            <p>Contact Number: +123-456-7890</p>
          </div>
          <div className="footer-right">
            <br />
            <br />
            <br />
            <br />
            <p>Help</p>
            <p>For assistance, visit our <a href="/help">Help Center</a> where you can find FAQs, tutorials, and contact options to help you with your queries.</p>
          </div>
        </div>
        <div className="footer-social-icon">
          <div className="footer-icons-container">
            <p>Instagram</p>
          </div>
          <div className="footer-icons-container">
            <p>Pinterest</p>
          </div>
          <div className="footer-icons-container">
            <p>WhatsApp</p>
          </div>
        </div>
        <div className="footer-copyright">
          <hr />
          <p>Copyright © 2024 - All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
