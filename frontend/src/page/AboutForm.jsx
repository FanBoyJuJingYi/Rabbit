import React from "react";
import NewArrivals from "../components/Products/NewArrivals";
import { Link } from "react-router-dom";

const AboutForm = () => {
  return (
    <div className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] flex items-center justify-center text-center">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://cdn.static.amplience.net/gapprod/_vid/su259421_video1_desk/a564033d-9aba-4f74-b45c-2a2f0d91d942/video/806d611b-cd90-4b04-a5dc-f4bae89057e3.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl px-6">
          <p className="text-sm tracking-widest text-white uppercase mb-4">
            Welcome to Rabbit Fashion
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Redefine Your <br /> Everyday Style
          </h1>
        </div>
      </section>

      {/* About Brand Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold">About Rabbit</h2>
        <p className="text-lg leading-relaxed">
          Rabbit is more than just fashion — it’s a lifestyle. Our collections
          are designed to inspire confidence, comfort, and individuality.
        </p>
        <p className="text-lg leading-relaxed">
          From timeless essentials to bold statement pieces, Rabbit blends
          modern trends with everyday wearability. We believe fashion should
          empower you to express your true self wherever you go.
        </p>
      </section>

      {/* Collections Section */}
      <section className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto px-6 py-16">
        <div className="relative rounded-lg overflow-hidden shadow-lg group">
          <Link to="/collections/all?gender=Men" className="block">
            <img
              src="https://www.gap.com/webcontent/0059/908/169/cn59908169.jpg"
              alt="Men's Collection"
              loading="lazy"
              className="w-full h-[650px] object-cover transform group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center space-y-2">
              <h3 className="text-3xl font-bold text-white">
                Men’s Collection
              </h3>
              <h4 className="text-lg font-medium text-gray-200">
                Essential pieces for everyday style
              </h4>
            </div>
          </Link>
        </div>

        <div className="relative rounded-lg overflow-hidden shadow-lg group">
          <Link to="/collections/all?gender=Women" className="block">
            <img
              src="https://www.gap.com/webcontent/0059/795/029/cn59795029.jpg"
              alt="Women’s Collection"
              loading="lazy"
              className="w-full h-[650px] object-cover transform group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center space-y-2">
              <h3 className="text-3xl font-bold text-white">
                Women’s Collection
              </h3>
              <h4 className="text-lg font-medium text-gray-200">
                Fresh looks to elevate your wardrobe
              </h4>
            </div>
          </Link>
        </div>
      </section>

      {/* About Me / Brand Story Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-center">Our Story</h2>
          <p className="text-lg leading-relaxed mb-4">
            Founded with a passion for creativity and individuality, Rabbit is a
            fashion brand that celebrates authenticity. We believe clothing
            should not only look good but also make you feel confident and
            empowered.
          </p>
          <p className="text-lg leading-relaxed">
            Every piece is carefully designed to bring out the best version of
            you — stylish, bold, and unapologetically unique. Founded with a
            passion for creativity and individuality, Rabbit is more than just a
            fashion brand – it is a statement of authenticity and
            self-expression. We believe that clothing should not only look
            beautiful but also inspire confidence, empower the wearer, and
            reflect their true identity. At Rabbit, every design is born from
            the idea that fashion is a powerful form of storytelling. Each piece
            is thoughtfully created with attention to detail, quality, and
            comfort, ensuring that it not only elevates your style but also
            enhances the way you feel. We aim to design collections that are
            bold, versatile, and unapologetically unique — allowing you to
            express yourself freely in every moment. Our mission is to break
            away from the ordinary and celebrate the individuality of each
            person.
          </p>
          <br></br>
          <a
            href="/"
            className="block text-center text-lg font-semibold underline hover:text-gray-500 transition"
          >
            Shop Rabbit
          </a>
        </div>

        {/* Replace Image with Video */}
        <div className="flex justify-center">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="rounded-xl shadow-2xl object-cover w-full h-[800px]"
          >
            <source
              src="https://cdn.static.amplience.net/gapprod/_vid/su259421_video2_desk/a564033d-9aba-4f74-b45c-2a2f0d91d942/video/654342c9-223e-4302-b7e7-6a76e4258df0.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      <NewArrivals />
    </div>
  );
};
export default AboutForm;
