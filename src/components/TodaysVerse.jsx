export default function TodaysVerse() {
    return (
        <section className="verse-card" id="verse">
            <div className="section-heading">
                <div>
                    <span className="eyebrow">A MOMENT OF REFLECTION</span>
                    <h2>Today's Verse</h2>
                </div>
                <span className="verse-reference">2:255</span>
            </div>

            <p className="verse-arabic" lang="ar" dir="rtl">
                اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ
            </p>

            <p className="verse-translation">
                Allah — there is no deity except Him, the Ever-Living, the
                Sustainer of all existence.
            </p>

            <span className="verse-note">Surah Al-Baqarah · Ayah 255</span>
        </section>
    );
}
