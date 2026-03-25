import React, { useMemo } from "react";
import styles from "./Home.module.css";
import CardSwap, { Card } from "../components/CardSwap";
import Shuffle from "../components/Shuffle";
import { motion } from "framer-motion";


// Optional: interactive cursor splash (kept subtle)
import SplashCursor from "../components/SplashCursor";

// ===============================
// Data
// ===============================

const services = [
  {
    title: "Landing & Company Profile",
    desc: "Website cepat, rapi, dan fokus konversi. Cocok untuk brand/company profile.",
  },
  {
    title: "Web App / Dashboard",
    desc: "Admin panel, dashboard operasional, data table, role-based access.",
  },
  {
    title: "E‑Commerce & Booking",
    desc: "Flow checkout/booking yang jelas, UI nyaman, dan siap scale.",
  },
  {
    title: "API & Integrations",
    desc: "Integrasi payment, email/OTP, CMS, analytics, dan third-party API.",
  },
];

// ===============================
// SVG Logo + Glitch (CSS Modules)
// ===============================

function DOLLogoMark({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 820 220"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="DOL"
    >
      {/* D */}
      <path
        d="M70 40h120c80 0 130 45 130 70s-50 70-130 70H70V40zm90 35v90h30c40 0 65-22 65-45s-25-45-65-45h-30z"
        fill="currentColor"
      />

      {/* O (globe) */}
      <g transform="translate(360,15)" fill="none" stroke="currentColor" strokeWidth="14" strokeLinecap="round">
        <ellipse cx="90" cy="95" rx="88" ry="88" />
        <ellipse cx="90" cy="95" rx="38" ry="88" />
        <path d="M90 7c0 0 42 30 42 88s-42 88-42 88" opacity="0.9" />
        <path d="M90 7c0 0-42 30-42 88s42 88 42 88" opacity="0.9" />
      </g>

      {/* L. */}
      <path d="M610 50h76v120h120v40H610V50z" fill="currentColor" />
      <circle cx="790" cy="190" r="14" fill="currentColor" />
    </svg>
  );
}

function DOLGlitchLogo() {
  return (
    <div className={styles.dolGlitch}>
      <DOLLogoMark className={styles.dolGlitchBase} />
      <DOLLogoMark className={styles.dolGlitchCyan} />
      <DOLLogoMark className={styles.dolGlitchMagenta} />
      <div className={styles.dolScanlines} aria-hidden />
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function Home() {
  const charset = useMemo(
    () =>
      "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЫЭЮЯ" +
      "αβγδεζηθικλμνξοπρστυφχψω" +
      "ΔΛΩΣΠΦΨ" +
      "†‡∑√∞≈≠≤≥÷×±∂∇µπλΩ",
    []
  );

  // Portofolio: gambar di public/images (case-sensitive)
  const portfolioShots = useMemo(
  () => [
    // Ambil dari public/images (pastikan nama file case-sensitive)
    { title: "WebGolf AI", src: "/images/WebGolf-AI.png", chip: "AI" },
    { title: "WebGolf Community", src: "/images/WebGolf-Community.png", chip: "COMMUNITY" },
    { title: "WebGolf Landing", src: "/images/WebGolf-landing.png", chip: "LANDING" },
    { title: "WebH Landing", src: "/images/WebH-landing.png", chip: "PROFILE" },
    { title: "WebH Profil", src: "/images/WebH-profil.png", chip: "PROFILE" },
  ],
  []
);

  const bento = useMemo(
    () => [
      {
        title: "Motion-first UI",
        desc: "Animasi halus dan interaksi yang kerasa ‘hidup’—bukan sekadar efek tempelan.",
      },
      {
        title: "Clean Architecture",
        desc: "Struktur rapi, scalable, dan gampang dilanjutkan tim kamu.",
      },
      {
        title: "Production Ready",
        desc: "Performance, security, dan deployment flow yang bener dari awal.",
      },
      {
        title: "Brand Visual",
        desc: "Tampilan elegan, spacing lega, dan layout futuristik untuk menaikkan trust.",
      },
    ],
    []
  );

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.div className={styles.page} initial="hidden" animate="show" variants={stagger}>
      {/* Background FX */}
      <div className={styles.bgFX} aria-hidden>
        <div className={styles.bgGlow} />
        <div className={styles.bgGrid} />
      </div>

      <div className={styles.cursorFX} aria-hidden>
        <SplashCursor />
      </div>

      <main id="top" className={styles.main}>
        {/* HERO: full logo + motto (tanpa card swap) */}
        <section className={styles.hero}>
          <div className={styles.heroWrap}>
            <div className={styles.heroLeft}>
              <motion.div className={styles.brandHero} variants={fadeUp}>
                <DOLGlitchLogo />
                <div className={styles.brandCompany}>DUNIA ONLINE LANCAR</div>
              </motion.div>

              <Shuffle
                tag="h1"
                className={styles.h1}
                text="We craft futuristic web experiences that feel alive."
                shuffleDirection="right"
                duration={0.35}
                stagger={0.02}
                scrambleCharset={charset}
                triggerOnce
                triggerOnHover
              />

              <motion.div className={styles.ctaRow} variants={fadeUp}>
                <button className={styles.primaryBtnBig} onClick={() => scrollTo("portfolio")}>
                  Lihat Portofolio
                </button>
                <button className={styles.secondaryBtnBig} onClick={() => scrollTo("produk")}>
                  Lihat Produk
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        <div className={styles.sectionDivider} />

        <section id="produk" className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.kicker}>Produk</div>
            <div className={styles.h2}>Build • Ship • Scale</div>
          </div>

          <div className={styles.rail}>
            {services.map((s, i) => (
              <motion.div
                className={styles.railCard}
                key={i}
                initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ duration: 0.55, delay: i * 0.04, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <div className={styles.railTitle}>{s.title}</div>
                <div className={styles.railDesc}>{s.desc}</div>
                <div className={styles.railHint}>Explore →</div>
              </motion.div>
            ))}
          </div>

          <div className={styles.bento}>
            {bento.map((b, i) => (
              <motion.div
                className={styles.bentoCard}
                key={i}
                initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ duration: 0.55, delay: i * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <div className={styles.bentoTitle}>{b.title}</div>
                <div className={styles.bentoDesc}>{b.desc}</div>
              </motion.div>
            ))}
          </div>
        </section>

        <div className={styles.sectionDivider} />

        <section id="tech" className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.kicker}>Tech</div>
            <div className={styles.h2}>Modern stack, production-ready</div>
          </div>

          <div className={styles.techGrid}>
            {["React + Vite", "Node.js + Express", "Sequelize + MySQL", "Auth + RBAC", "Media Upload", "Nginx + PM2", "Performance", "Monitoring"].map(
              (t, i) => (
                <motion.div
                  key={i}
                  className={styles.techItem}
                  initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-15%" }}
                  transition={{ duration: 0.5, delay: i * 0.03, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  {t}
                </motion.div>
              )
            )}
          </div>
        </section>

        <div className={styles.sectionDivider} />

        {/* Portfolio: card swap cuma di bawah untuk nampilin porto */}
        <section id="portfolio" className={styles.portfolio}>
          <div className={styles.sectionHead}>
            <div className={styles.kicker}>Portofolio</div>
            <div className={styles.h2}>Selected works</div>
          </div>

          <div className={styles.portfolioStage}>
            <div className={styles.stageHead}>
              <span className={styles.pulseDot} />
              <div>
                <div className={styles.stageTitle}>Card Swap</div>
              </div>
            </div>

            <div className={styles.stageBody}>
              <CardSwap width={"100%"} height={560} delay={4200} pauseOnHover easing="elastic" clip>
                {portfolioShots.map((p, i) => (
                  <Card key={i} customClass={styles.swapCardBig}>
                    <div className={styles.bigShotCard}>
                      <img className={styles.bigShotImg} src={p.src} alt={p.title} loading="lazy" />
                      <div className={styles.bigShotOverlay}>
                        <span className={styles.chip}>{p.chip}</span>
                        <div className={styles.bigShotTitle}>{p.title}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </CardSwap>
            </div>
          </div>
        </section>

        <div className={styles.sectionDivider} />

        <section id="kontak" className={styles.sectionBottom}>
          <motion.div
            className={styles.contactCard}
            initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.65, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div>
              <div className={styles.kicker}>Kontak</div>
              <div className={styles.contactTitle}>Let’s build something futuristic.</div>
            </div>

            <div className={styles.contactActions}>
              <a className={styles.primaryBtnBig} href="mailto:hello@dol.co.id">
                Email Kami
              </a>
              <a className={styles.secondaryBtnBig} href="https://wa.me/6280000000000" target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>DOL</div>
          <div className={styles.footerText}>© {new Date().getFullYear()} DOL — Digital Products & IT Solutions.</div>
        </div>
      </footer>
    </motion.div>
  );
}
