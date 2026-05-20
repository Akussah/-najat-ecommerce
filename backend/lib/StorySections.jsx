import React from 'react';

export default function StorySections() {
  return (
    <div className="w-full flex flex-col">
      {/* OUR STORY / WAIST BEADS COLLECTION */}
      <section
        className="relative flex items-center justify-center min-h-[500px] text-center p-8 text-white"
        style={{
          // TODO: Replace with your actual image path or URL
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/waist-beads-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed', // This creates a beautiful parallax scrolling effect
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-wide">Our Story: The Waist Beads Collection</h2>
          <p className="text-lg md:text-xl leading-relaxed mb-4">
            Inspired by the deep cultural traditions of Ghana, our waist beads celebrate femininity, beauty, and personal identity. Handcrafted by skilled artisans using high-quality beads and natural materials, no two strands are exactly alike.
          </p>
          <p className="text-lg md:text-xl leading-relaxed">
            At Alhamd Ashino, we blend traditional African heritage with modern self-expression to offer elegant, empowering, and truly unique pieces.
          </p>
        </div>
      </section>

      {/* MEET THE FOUNDER */}
      <section
        className="relative flex items-center justify-center min-h-[500px] text-center p-8 text-white"
        style={{
          // TODO: Replace with your actual image path or URL
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/founder-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-wide">Meet the Founder</h2>
          <p className="text-lg md:text-xl leading-relaxed mb-4">
            Founded by Najat Ansah, Alhamd Ashino is a brand rooted in heritage, creativity, and purpose. Najat’s journey began at just 10 years old, inspired by her mother who taught her the art of African crafts. What started as a childhood passion for creating beaded jewelry quickly grew into a meaningful vision.
          </p>
          <p className="text-lg md:text-xl leading-relaxed">
            Today, Najat works closely with artisans and mothers in Ghana, empowering them to support their families through their craft. Every piece reflects a story of resilience and culture, honoring traditional craftsmanship while connecting it with modern fashion.
          </p>
        </div>
      </section>
    </div>
  );
}