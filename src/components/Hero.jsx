import {useState} from "react";

export default function Hero({surahs, search, onSelectSurah}) {
    const [selected, setSelected] = useState("1");

    const matches = surahs.filter((surah) => {
        const query = search.trim().toLowerCase();

        return (
            !query ||
            surah.englishName.toLowerCase().includes(query) ||
            surah.name.includes(search.trim()) ||
            String(surah.number) === query
        );
    });

    function startReading() {
        onSelectSurah(selected);
    }

    return (
        <section className="hero">
            <div className="hero-copy">
                <span className="eyebrow">THE HOLY QURAN</span>
                <h1>
                    Read with peace.
                    <br />
                    Listen with heart.
                </h1>
                <p>
                    Explore all 114 surahs, read the Arabic text, and listen to
                    authentic recitations.
                </p>

                <div className="hero-picker">
                    {/* <label htmlFor="hero-surah-search">Choose a chapter</label>
                    <input
                        id="hero-surah-search"
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search surah name or number..."
                    /> */}

                    <select
                        aria-label="Select a surah"
                        value={selected}
                        onChange={(event) => setSelected(event.target.value)}
                    >
                        {matches.map((surah) => (
                            <option key={surah.number} value={surah.number}>
                                {surah.number}. {surah.englishName}
                            </option>
                        ))}
                    </select>

                    <button
                        className="primary-button"
                        type="button"
                        onClick={startReading}
                    >
                        Start Reading <span aria-hidden="true">→</span>
                    </button>
                </div>
            </div>

            <div className="hero-art" aria-hidden="true">
                <div className="hero-ring" />
                <div className="hero-book">القرآن الكريم</div>
                <span className="hero-star">✦</span>
            </div>
        </section>
    );
}
