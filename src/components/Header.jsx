export default function Header() {
    return (
        <header className="header">
            <a className="brand" href="/" aria-label="Qira'at home">
                <span className="brand-mark">ق</span>
                <span className="brand-copy">
                    <strong>Qira'at</strong>
                    <small>Read · Listen · Reflect</small>
                </span>
            </a>

            <nav className="header-nav" aria-label="Main navigation">
                <a href="#surahs">Surahs</a>
                <a href="#verse">Today's Verse</a>
            </nav>
        </header>
    );
}
