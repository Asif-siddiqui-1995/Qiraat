export default function BrowseSurah({surahs, onSelectSurah}) {
    return (
        <section className="surah-section" id="surahs">
            <div className="section-heading">
                <div>
                    <span className="eyebrow">FIND YOUR CHAPTER</span>
                    <h2>Browse by Surah</h2>
                </div>
                <span className="surah-total">{surahs.length} chapters</span>
            </div>

            <div className="surah-grid">
                {surahs.slice(0, 10).map((surah) => (
                    <button
                        className="surah-card"
                        key={surah.number}
                        type="button"
                        onClick={() => onSelectSurah(surah.number)}
                        aria-label={`Open Surah ${surah.englishName}`}
                    >
                        <span className="surah-number">{surah.number}</span>

                        <span className="surah-arabic" lang="ar" dir="rtl">
                            {surah.name}
                        </span>

                        <strong>{surah.englishName}</strong>
                        <span className="surah-count">
                            {surah.numberOfAyahs} ayahs
                        </span>
                        <span className="surah-card-arrow" aria-hidden="true">
                            →
                        </span>
                    </button>
                ))}
            </div>

            <p className="browse-note">
                Use Quran Reader below to search all 114 chapters.
            </p>
        </section>
    );
}
