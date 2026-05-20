const storyHighlights = [
  'Ghanaian craft heritage',
  'Women-led artisan network',
  'Modern occasion pieces'
];

const founderNotes = [
  { value: '10', label: 'Years old when the craft journey began' },
  { value: 'Ghana', label: 'Rooted in local artistry and family tradition' },
  { value: 'Every piece', label: 'Carries culture, care, and resilience' }
];

const aboutValues = [
  {
    title: 'Craft first',
    text: 'Every product starts with beadwork quality, material choice, and wearability.'
  },
  {
    title: 'Modern presentation',
    text: 'Handmade detail is styled with a clean, contemporary luxury language.'
  },
  {
    title: 'Personal service',
    text: 'Consultations help customers shape custom ideas before they place an order.'
  }
];

export default function StorySections() {
  return (
    <section className="story-showcase">
      <div className="story-showcase-header">
        <p className="eyebrow">The Brand Story</p>
        <h2>Crafted with memory. Styled for the moment.</h2>
        <p>
          Alhamd Ashino brings Ghanaian beadwork into a modern luxury space, where every bag feels
          personal, polished, and rooted in something deeper than trend.
        </p>
      </div>

      <div className="story-feature story-feature-large">
        <div className="story-image-card">
          <img
            src="/CEO.jpeg"
            alt="Alhamd Ashino handcrafted beadwork story"
            className="story-section-image"
          />
          <div className="story-image-label">
            <span>001</span>
            <strong>Heritage in motion</strong>
          </div>
        </div>

        <div className="story-copy-card">
          <span className="story-count">Our Story</span>
          <h3>Beadwork with presence, purpose, and soul.</h3>
          <div className="story-text-grid">
            <p>
              Inspired by the deep cultural traditions of Ghana, our bead pieces celebrate
              femininity, beauty, and personal identity. Every design is shaped by hand, patience,
              and the unmistakable texture of craft.
            </p>
            <p>
              At Alhamd Ashino, tradition is not treated like a museum piece. It becomes something
              wearable, elegant, expressive, and ready for weddings, gifting, and everyday statement
              moments.
            </p>
          </div>

          <div className="story-chip-row">
            {storyHighlights.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="story-about-panel">
        <div>
          <span className="story-count">Brand Values</span>
          <h3>A bead brand shaped by craftsmanship, clarity, and restraint.</h3>
          <p>
            We make handmade bead pieces while keeping the customer experience simple, polished,
            and easy to navigate. The work is rooted in African craft, but the presentation is calm,
            modern, and built for customers who want something meaningful without confusion.
          </p>
        </div>

        <div className="story-about-values">
          {aboutValues.map((item, index) => (
            <article key={item.title}>
              <span>0{index + 1}</span>
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="story-feature story-feature-reverse">
        <div className="story-copy-card story-founder-card">
          <span className="story-count">The Founder</span>
          <h3>Najat Ansah built the brand from memory, skill, and mission.</h3>
          <p>
            Her creative journey began at just 10 years old, inspired by African craft traditions
            passed down through generations. Today, Najat works closely with artisans and mothers in
            Ghana, helping craft become a path toward dignity, income, and visibility.
          </p>

          <div className="story-founder-stats">
            {founderNotes.map((item) => (
              <div key={item.value}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="story-image-card story-founder-image">
          <img
            src="/FOUNDER.jpeg"
            alt="Najat Ansah founder of Alhamd Ashino"
            className="story-section-image"
          />
          <div className="story-quote">
            <p>"Every piece reflects a story of resilience and culture."</p>
          </div>
        </div>
      </div>
    </section>
  );
}

