import React from "react";

const AboutForm = () => {
  return (
    <div className="container mx-auto py-16 px-6 max-w-4xl text-gray-800">
      <h1 className="text-4xl font-bold mb-8 text-center text-orange-600">
        About RABBIT Fashion
      </h1>

      <p className="mb-6 text-lg leading-relaxed">
        RABBIT is a modern fashion brand dedicated to redefining contemporary style
        through innovation and quality craftsmanship. Our mission is to empower individuals
        to express themselves confidently with clothing that blends sleek design and
        everyday comfort.
      </p>

      <p className="mb-6 text-lg leading-relaxed">
        Inspired by urban culture and global trends, RABBIT offers versatile collections
        that effortlessly transition from day to night, work to weekend. We prioritize
        sustainability and authentic creativity, ensuring every piece reflects our
        commitment to a better future and unique self-expression.
      </p>

      <p className="mb-6 text-lg leading-relaxed">
        Join us on this journey as we continue to push the boundaries of modern fashion,
        crafting apparel that tells your story with style and innovation.
      </p>

      <div className="mt-10 flex justify-center">
        <img
          src="https://i.pinimg.com/1200x/3d/e6/be/3de6be04b767e2aa0299e9b5deb5e1fd.jpg"
          alt="RABBIT Fashion"
          className="rounded-lg shadow-lg  object-cover"
        />
      </div>  

      {/* Lịch sử */}
      <h2 className="text-3xl font-semibold mt-12 mb-6 text-orange-600">Our History</h2>
      <p className="mb-6 text-lg leading-relaxed">
        Founded in 2015, RABBIT began as a small startup with a bold vision to disrupt
        traditional fashion norms. From our first collection in a tiny workshop, we have
        grown into a globally recognized brand known for its innovative designs and
        commitment to quality. Over the years, RABBIT has expanded its product lines and
        embraced cutting-edge technologies to stay ahead in the ever-evolving fashion
        industry.
      </p>
      
      <div className="mt-10 flex justify-center">
        <img
          src="https://i.pinimg.com/1200x/3d/e6/be/3de6be04b767e2aa0299e9b5deb5e1fd.jpg"
          alt="RABBIT Fashion"
          className="rounded-lg shadow-lg  object-cover"
        />
      </div>

      {/* Giá trị cốt lõi */}
      <h2 className="text-3xl font-semibold mt-12 mb-6 text-orange-600">Core Values</h2>
      <ul className="list-disc list-inside space-y-3 text-lg leading-relaxed">
        <li><strong>Innovation:</strong> Constantly pushing creative boundaries to deliver fresh, modern designs.</li>
        <li><strong>Quality:</strong> Using premium materials and skilled craftsmanship to ensure durability and comfort.</li>
        <li><strong>Sustainability:</strong> Commitment to eco-friendly practices throughout our production process.</li>
        <li><strong>Authenticity:</strong> Encouraging individuality and genuine self-expression through fashion.</li>
        <li><strong>Customer Focus:</strong> Prioritizing customer satisfaction and engaging with our community.</li>
      </ul>

      <div className="mt-10 flex justify-center">
        <img
          src="https://i.pinimg.com/1200x/3d/e6/be/3de6be04b767e2aa0299e9b5deb5e1fd.jpg"
          alt="RABBIT Fashion"
          className="rounded-lg shadow-lg  object-cover"
        />
      </div>
    </div>
  );
};

export default AboutForm;
