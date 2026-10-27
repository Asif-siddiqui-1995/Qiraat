import {useCallback, useEffect, useRef, useState} from "react";
import "./App.css";

import Header from "./components/Header";
import Hero from "./components/Hero";
import FeatureCards from "./components/FeatureCards";
import TodaysVerse from "./components/TodaysVerse";
import BrowseSurah from "./components/BrowseSurah";
import QuranReader from "./components/QuranReader";

const API = "https://api.alquran.cloud/v1";
const AUDIO_BASE = "https://cdn.islamic.network/quran/audio";

const RECITERS = [
    {
        id: "ar.alafasy",
        name: "Mishary Rashid Alafasy",
        bitrate: 128,
    },
    {
        id: "ar.abdurrahmaansudais",
        name: "Abdur-Rahman as-Sudais",
        bitrate: 192,
    },
    {
        id: "ar.mahermuaiqly",
        name: "Maher Al Muaiqly",
        bitrate: 128,
    },
    {
        id: "ar.husary",
        name: "Mahmoud Khalil Al-Husary",
        bitrate: 128,
    },
];

export default function App() {
    const [surahs, setSurahs] = useState([]);
    const [surahNumber, setSurahNumber] = useState(1);
    const [ayahs, setAyahs] = useState([]);
    const [reciter, setReciter] = useState("ar.alafasy");
    const [currentAyah, setCurrentAyah] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [surahSearch, setSurahSearch] = useState("");

    const audioRef = useRef(null);
    const hoverTimer = useRef(null);
    const requestRef = useRef(0);

    const stopAudio = useCallback(() => {
        clearTimeout(hoverTimer.current);

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.removeAttribute("src");
            audioRef.current.load();
            audioRef.current = null;
        }
    }, []);

    // Load the chapter list.
    useEffect(() => {
        let cancelled = false;

        async function loadSurahs() {
            try {
                const response = await fetch(`${API}/surah`);
                if (!response.ok)
                    throw new Error("Could not load the surah list.");

                const result = await response.json();
                if (!cancelled) setSurahs(result.data);
            } catch (err) {
                if (!cancelled) setError(err.message);
            }
        }

        loadSurahs();

        return () => {
            cancelled = true;
        };
    }, []);

    // Load Arabic text for the selected chapter.

    useEffect(() => {
        const requestId = ++requestRef.current;
        let cancelled = false;

        stopAudio();

        async function loadAyahs() {
            try {
                const response = await fetch(
                    `${API}/surah/${surahNumber}/quran-uthmani`,
                );

                if (!response.ok) {
                    throw new Error("Could not load this surah.");
                }

                const result = await response.json();

                if (!cancelled && requestId === requestRef.current) {
                    setAyahs(result.data.ayahs);
                    setCurrentAyah(null);
                    setError("");
                    setLoading(false);
                }
            } catch (err) {
                if (!cancelled && requestId === requestRef.current) {
                    setError(err.message || "Could not load Quran text.");
                    setLoading(false);
                }
            }
        }

        loadAyahs();

        return () => {
            cancelled = true;
        };
    }, [surahNumber, stopAudio]);

    // Stop the old recording when the Qari changes.
    useEffect(() => {
        stopAudio();
    }, [reciter, stopAudio]);

    // Clean up audio when leaving the page.
    useEffect(() => {
        return () => {
            clearTimeout(hoverTimer.current);
            audioRef.current?.pause();
        };
    }, []);

    const playAyah = useCallback(
        async (ayah) => {
            if (!ayah) return;

            clearTimeout(hoverTimer.current);
            setError("");

            const existingAudio = audioRef.current;

            // Do not restart the same ayah on repeated hover events.
            if (
                existingAudio &&
                existingAudio.dataset.ayah === String(ayah.number) &&
                existingAudio.dataset.reciter === reciter
            ) {
                if (existingAudio.paused) {
                    try {
                        await existingAudio.play();
                        setPlaying(true);
                    } catch {
                        setPlaying(false);
                        setError(
                            "Playback failed. Try pressing the play button.",
                        );
                    }
                }
                return;
            }

            existingAudio?.pause();

            const selectedReciter = RECITERS.find(
                (item) => item.id === reciter,
            );

            const bitrate = selectedReciter?.bitrate ?? 128;

            const audio = new Audio(
                `${AUDIO_BASE}/${bitrate}/${reciter}/${ayah.number}.mp3`,
            );

            audio.preload = "auto";
            audio.dataset.ayah = String(ayah.number);
            audio.dataset.reciter = reciter;
            audioRef.current = audio;
            setCurrentAyah(ayah);
            setPlaying(false);

            audio.onended = () => {
                if (audioRef.current === audio) setPlaying(false);
            };

            audio.onerror = () => {
                if (audioRef.current === audio) {
                    setPlaying(false);
                    setError(
                        "This recording could not be loaded. Try another Qari.",
                    );
                }
            };

            try {
                await audio.play();

                if (audioRef.current === audio) setPlaying(true);
            } catch {
                if (audioRef.current === audio) {
                    setPlaying(false);
                    setError(
                        "Playback failed. Tap the ayah or press Play to retry.",
                    );
                }
            }
        },
        [reciter],
    );

    function handleAyahHover(ayah) {
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
            return;
        }

        clearTimeout(hoverTimer.current);

        // Small delay prevents accidental playback while moving the pointer.
        hoverTimer.current = setTimeout(() => {
            playAyah(ayah);
        }, 250);
    }

    function pauseOrResume() {
        const audio = audioRef.current;

        if (!audio) {
            if (currentAyah) playAyah(currentAyah);
            return;
        }

        if (audio.paused) {
            audio
                .play()
                .then(() => setPlaying(true))
                .catch(() => setError("Could not resume playback."));
        } else {
            audio.pause();
            setPlaying(false);
        }
    }

    function replayAyah() {
        if (!currentAyah) return;

        // Explicit replay always starts the selected ayah from the beginning.
        if (
            audioRef.current?.dataset.ayah === String(currentAyah.number) &&
            audioRef.current?.dataset.reciter === reciter
        ) {
            audioRef.current.currentTime = 0;
            audioRef.current
                .play()
                .then(() => setPlaying(true))
                .catch(() => setError("Could not replay this recording."));
        } else {
            playAyah(currentAyah);
        }
    }

    function playRelative(offset) {
        if (!currentAyah || !ayahs.length) return;

        const index = ayahs.findIndex(
            (ayah) => ayah.number === currentAyah.number,
        );
        const nextAyah = ayahs[index + offset];

        if (nextAyah) playAyah(nextAyah);
    }

    function selectSurah(number) {
        const parsed = Number(number);
        if (parsed >= 1 && parsed <= 114) {
            setSurahNumber(parsed);
            setSurahSearch("");
            document.getElementById("quran-reader")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }

    const selectedSurah = surahs.find((surah) => surah.number === surahNumber);

    return (
        <div className="app">
            <Header />

            <main>
                <Hero
                    surahs={surahs}
                    search={surahSearch}
                    setSearch={setSurahSearch}
                    onSelectSurah={selectSurah}
                />

                <div className="page-content">
                    <FeatureCards />

                    <TodaysVerse />

                    <BrowseSurah surahs={surahs} onSelectSurah={selectSurah} />

                    <QuranReader
                        surahs={surahs}
                        selectedSurah={selectedSurah}
                        surahNumber={surahNumber}
                        onSelectSurah={selectSurah}
                        ayahs={ayahs}
                        loading={loading}
                        error={error}
                        currentAyah={currentAyah}
                        playing={playing}
                        reciter={reciter}
                        reciters={RECITERS}
                        setReciter={setReciter}
                        onAyahHover={handleAyahHover}
                        onPlayAyah={playAyah}
                        onTogglePlayback={pauseOrResume}
                        onReplay={replayAyah}
                        onPrevious={() => playRelative(-1)}
                        onNext={() => playRelative(1)}
                    />
                </div>
            </main>

            <footer className="footer">
                Qira'at · Read, listen, and reflect
            </footer>
        </div>
    );
}
