import {useEffect, useRef, useState} from "react";

export default function QuranReader({
    surahs,
    selectedSurah,
    surahNumber,
    onSelectSurah,
    ayahs,
    loading,
    error,
    currentAyah,
    playing,
    reciter,
    reciters,
    setReciter,
    onAyahHover,
    onPlayAyah,
    onTogglePlayback,
    onReplay,
    onPrevious,
    onNext,
}) {
    const [search, setSearch] = useState("");
    const [jumpAyah, setJumpAyah] = useState("");
    const ayahRefs = useRef({});

    const filteredSurahs = surahs.filter((surah) => {
        const query = search.trim().toLowerCase();

        if (!query) return true;

        return (
            surah.englishName.toLowerCase().includes(query) ||
            surah.name.includes(search.trim()) ||
            String(surah.number) === query
        );
    });

    useEffect(() => {
        if (!jumpAyah) return;

        const target = ayahs.find(
            (ayah) => ayah.numberInSurah === Number(jumpAyah),
        );

        if (target) {
            ayahRefs.current[target.number]?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [jumpAyah, ayahs]);

    const currentIndex = ayahs.findIndex(
        (ayah) => ayah.number === currentAyah?.number,
    );

    return (
        <section className="reader-section" id="quran-reader">
            <div className="section-heading">
                <div>
                    <span className="eyebrow">READ & LISTEN</span>
                    <h2>Quran Reader</h2>
                </div>
                <span className="surah-total">114 Surahs</span>
            </div>

            <div className="reader-search">
                {/* <label htmlFor="surah-search">Search chapters</label>
                <input
                    id="surah-search"
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by surah name or number..."
                /> */}

                {search.trim() && (
                    <div className="search-results">
                        {filteredSurahs.length ? (
                            filteredSurahs.slice(0, 8).map((surah) => (
                                <button
                                    type="button"
                                    key={surah.number}
                                    onClick={() => {
                                        onSelectSurah(surah.number);
                                        setSearch("");
                                        setJumpAyah("");
                                    }}
                                >
                                    <span>
                                        {surah.number}. {surah.englishName}
                                    </span>
                                    <span lang="ar" dir="rtl">
                                        {surah.name}
                                    </span>
                                </button>
                            ))
                        ) : (
                            <p>No chapters found.</p>
                        )}
                    </div>
                )}
            </div>

            <div className="reader-navigation">
                <div className="reader-field">
                    <label htmlFor="reader-surah">Chapter / Surah</label>
                    <select
                        id="reader-surah"
                        value={surahNumber}
                        onChange={(event) => {
                            onSelectSurah(event.target.value);
                            setJumpAyah("");
                        }}
                    >
                        {surahs.map((surah) => (
                            <option key={surah.number} value={surah.number}>
                                {surah.number}. {surah.englishName} —{" "}
                                {surah.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="reader-field">
                    <label htmlFor="jump-ayah">Jump to ayah</label>
                    <select
                        id="jump-ayah"
                        value={jumpAyah}
                        onChange={(event) => setJumpAyah(event.target.value)}
                        disabled={loading || !ayahs.length}
                    >
                        <option value="">Choose ayah...</option>
                        {ayahs.map((ayah) => (
                            <option
                                key={ayah.number}
                                value={ayah.numberInSurah}
                            >
                                Ayah {ayah.numberInSurah}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="reader-field">
                    <label htmlFor="reader-qari">Reciter / Qari</label>
                    <select
                        id="reader-qari"
                        value={reciter}
                        onChange={(event) => setReciter(event.target.value)}
                    >
                        {reciters.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="reader-chapter-heading">
                <span className="eyebrow">
                    SURAH {selectedSurah?.number || surahNumber}
                </span>
                <h3 lang="ar" dir="rtl">
                    {selectedSurah?.name || "القرآن الكريم"}
                </h3>
                <h4>{selectedSurah?.englishName || "The Holy Quran"}</h4>
                <p>
                    {selectedSurah?.englishNameTranslation || ""}
                    {selectedSurah
                        ? ` · ${selectedSurah.numberOfAyahs} ayahs`
                        : ""}
                </p>
                <p className="reader-hint">
                    Hover over an ayah on desktop, or tap it on your phone, to
                    listen.
                </p>
            </div>

            {error && (
                <p className="error" role="alert">
                    {error}
                </p>
            )}

            {loading ? (
                <p className="reader-status">Loading Quran text...</p>
            ) : (
                <div className="ayah-list" dir="rtl">
                    {ayahs.map((ayah) => {
                        const isCurrent = currentAyah?.number === ayah.number;

                        return (
                            <button
                                type="button"
                                key={ayah.number}
                                ref={(node) => {
                                    ayahRefs.current[ayah.number] = node;
                                }}
                                className={`reader-ayah ${isCurrent ? "active" : ""}`}
                                onMouseEnter={() => onAyahHover(ayah)}
                                onMouseLeave={() => {
                                    // The app handles the short hover delay.
                                    // Leaving an ayah does not stop a recording already playing.
                                }}
                                onClick={() => onPlayAyah(ayah)}
                                aria-label={`Play ${selectedSurah?.englishName}, ayah ${ayah.numberInSurah}`}
                                aria-pressed={isCurrent && playing}
                            >
                                <span className="reader-ayah-text">
                                    {ayah.text}
                                </span>
                                <span className="reader-ayah-number">
                                    ۞ {ayah.numberInSurah}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}

            <div className="audio-player">
                <div className="audio-player-info">
                    <strong>
                        {selectedSurah?.englishName || "Quran"}
                        {currentAyah
                            ? ` · Ayah ${currentAyah.numberInSurah}`
                            : ""}
                    </strong>
                    <span>{playing ? "Now reciting" : "Playback paused"}</span>
                </div>

                <div className="audio-player-controls">
                    <button
                        type="button"
                        onClick={onPrevious}
                        disabled={currentIndex <= 0}
                        aria-label="Previous ayah"
                        title="Previous ayah"
                    >
                        ⏮
                    </button>

                    <button
                        type="button"
                        className="audio-play-button"
                        onClick={onTogglePlayback}
                        disabled={!currentAyah}
                        aria-label={
                            playing ? "Pause recitation" : "Play recitation"
                        }
                    >
                        {playing ? "Ⅱ" : "▶"}
                    </button>

                    <button
                        type="button"
                        onClick={onNext}
                        disabled={
                            currentIndex < 0 || currentIndex >= ayahs.length - 1
                        }
                        aria-label="Next ayah"
                        title="Next ayah"
                    >
                        ⏭
                    </button>

                    <button
                        type="button"
                        onClick={onReplay}
                        disabled={!currentAyah}
                        aria-label="Replay ayah"
                        title="Replay ayah"
                    >
                        ↻
                    </button>
                </div>
            </div>
        </section>
    );
}
