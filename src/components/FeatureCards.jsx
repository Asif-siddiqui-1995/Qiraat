const features = [
    {
        icon: "▤",
        title: "114 Surahs",
        description: "Explore the complete Quran.",
    },
    {
        icon: "♫",
        title: "Authentic Recitations",
        description: "Listen to renowned Qaris.",
    },
    {
        icon: "◉",
        title: "Your Preferences",
        description: "Choose your reading experience.",
    },
    {
        icon: "▯",
        title: "Made for Mobile",
        description: "A comfortable phone experience.",
    },
];

export default function FeatureCards() {
    return (
        <section className="features" aria-label="Features">
            {features.map((feature) => (
                <article className="feature-card" key={feature.title}>
                    <span className="feature-icon" aria-hidden="true">
                        {feature.icon}
                    </span>
                    <h2>{feature.title}</h2>
                    <p>{feature.description}</p>
                </article>
            ))}
        </section>
    );
}
