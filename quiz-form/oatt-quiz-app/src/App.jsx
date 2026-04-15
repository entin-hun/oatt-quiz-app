import { useEffect, useMemo, useState } from 'react';

const WEBDIS_BASE = (import.meta.env.VITE_WEBDIS_URL || 'http://192.168.10.177:7379').replace(/\/$/, '');

function publishOutroToWebdis(message) {
  const body = `PUBLISH/Sentences/${JSON.stringify({ sentence: message, animation: '' })}`;
  fetch(`${WEBDIS_BASE}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body,
  }).catch((err) => {
    console.warn('[Quiz] WebDis publish failed:', err);
  });
}

const LEGAL_FULL_TEXT = `Játékszabályzat - „Szakmai kvízjáték”

1. A Játék neve és szervezője:
A „ Szakmai kvízjáték” elnevezésű nyereményjáték (a továbbiakban: Játék) szervezője a MagnaPharm Hungary Korlátolt Felelősségű Társaság (Cégjegyzékszám: 01-09-735305; Adószám: 13440073-2-43; Székhely: 1119 Budapest, Fehérvári út 97-99. 4. em.; a továbbiakban: Szervező). A Játékot a Szervező bonyolítja le.

2. A Játékban részt vevő személyek:
A Játékban kizárólag egészségügyi szakemberek vehetnek részt (továbbiakban: Játékos). A Játékban való részvétel önkéntes. A Játékos a játék elindításával elfogadja jelen Játékszabályzatot és kijelenti, hogy érvényes és hatályos működési engedéllyel rendelkező egészségügyi szakembernek minősül, illetve, hogy jogi cselekvőképessége korlátolva nincs.
A Játékban a Szervező munkavállalói, valamint mindezen személyek Ptk. 8:1.§ (1) 1. pontjában meghatározott közeli hozzátartozói nem vehetnek részt.
A Játékos a játékban való részvétellel elismeri, hogy teljes körűen megismerte a Játékszabályzatot, és azt feltétel nélkül elfogadja. Amennyiben a Játékos a Játékszabályzatot vagy annak bármely rendelkezését nem fogadja el, valamint azzal kapcsolatban kifogást emel, a Játékban nem jogosult részt venni, illetve a Játékból automatikusan kizárásra kerül.
A Játék lebonyolítása, illetve az abban való részvétel a jelen Játékszabályzat szerint történik. Amennyiben a Játékszabályzat valamely kérdést nem szabályoz, úgy a hatályos jogszabályok vonatkozó rendelkezései alkalmazandóak.

3. A Játék menete:
A Játék fizikálisan kizárólag a Szervező által biztosított eszközön érhető el. A Játék követi a klasszikus kvíz szabályait, melyben a játékosnak a feltett kérdésekre adott válasz-opciókból kell a helyes választ kiválasztania. Ezt szóban tudja megtenni. Minden kérdés után gombnyomásra megjelenik a helyes válasz. A Játékos nem időre játszik, a játék nem pontoz. A játék regisztrációhoz nem kötött. A játék során, a Szervező személyes, statisztikai adatokat nem rögzít.

4. A Játék időtartama:
A Játék az Oktató Családorvosok XXVII. Továbbképző Konferenciája ideje alatt érhető el (2026. április 16-19.).

5. Nyeremények, nyertesek:
A Játékos nyereménye a játék élménye. Egyéb nyeremény átadásra nem kerül.

6. Egyéb rendelkezések:
Szervező fenntartja a Játékszabályzat változtatásának jogát.
A Játékos tudomásul veszi, hogy megtett nyilatkozatot a Szervező ellenőrizni nem tudja- Játékos teljeskörű felelősséget vállal nyilatkozatai tekintetében.
A Játékban való részvétellel a Játékos tudomásul veszi, hogy a Játékkal összefüggésben alkalmazott technikai infrastruktúra tartalma, teljesítménye, üzenet- és adatátviteli-, valamint válaszadási sebessége a kiszolgáló technológia függvénye, és ezáltal ezeket kedvezőtlenül befolyásolhatja olyan, a Szervezőn kívülálló tényező, mint például  - de nem kizárólagosan - kapcsolati hiba, a szerver-számítógépek teljesítménye. A Szervező az e bekezdésben írtakból fakadó mindennemű felelősséget kizár. A Szervező fenntartja a Játék szabályai és mechanizmusa megváltoztatásának jogát. A Szervező kizárja felelősségét a Játékkal kapcsolatos bármilyen kommunikációs anyagban esetlegesen előforduló nyomdai hibáért. A Szervező jogosult kizárni Játékból azt a játékost, aki a játékban tisztességtelen módon, a jelen Játékszabályzatban foglalt feltételek és előírások megkerülésével próbál részt venni. Amennyiben a játék során visszaélések, jelentős mértékű sportszerűtlen játék gyanúja merül fel, amely visszaélésre adhat lehetőséget, a Szervező fenntartja a jogot, hogy a játékot szüneteltesse, vagy törölje.
A Szervező a jogszabályok által megengedett mértékben a játékkal kapcsolatos minden felelősségét kizárja.
A játékkal kapcsolatos bármilyen egyéb kérdéssel kapcsolatban a Info_Budapest@magnapharm.eu e-mail címen tud a Játékos információt kérni.

Budapest, 2026. március 26.`;

const QUESTIONS = [
  {
    id: 'q1',
    title: '1. KÉRDÉS',
    prompt:
      'Az Enterol probiotikum egyik előnye, hogy bármely antibiotikummal egyidőben bevehető. Ön szerint minek köszönhető az Enterol ezen tulajdonsága?',
    options: [
      {
        key: 'A',
        text: 'Az Enterol hatóanyaga, a Saccharomyces boulardii CNCM I-745 nem baktérium, hanem egy speciális élesztőgomba, így semelyik antibiotikum nincsen rá hatással.',
        revealText:
          'Az Enterol hatóanyaga, a Saccharomyces boulardii CNCM I-745 nem baktérium, hanem egy speciális élesztőgomba, így semelyik antibiotikum nincsen rá hatással.*',
      },
      {
        key: 'B',
        text: 'Hatóanyagának ellenálló burka megakadályozza, hogy az antibiotikum elpusztítsa.',
      },
    ],
    correctKey: 'A',
    revealLines: [],
    footnotes: [
      '*Neut C, Mahieux S, Dubreuil LJ. Antibiotic susceptibility of probiotic strains: Is it reasonable to combine probiotics with antibiotics? Med Mal Infect. 2017 Nov;47(7):477-483. doi: 10.1016/j.medmal.2017.07.001. Epub 2017 Aug 7. PMID: 28797834.',
    ],
  },
  {
    id: 'q2',
    title: '2. KÉRDÉS',
    prompt: 'Mit gondol, hány százalékban fordul elő hasmenés antibiotikumot szedő felnőtteknél?',
    options: [
      { key: 'A', text: '2-5%-ban' },
      { key: 'B', text: '5-10%-ban' },
      { key: 'C', text: '5-35%-ban', revealText: '5-35%-ban*' },
      { key: 'D', text: '5-25%-ban' },
    ],
    correctKey: 'C',
    revealLines: [
      'Az antibiotikum asszociált hasmenés gyermekekben ennél is gyakrabban: 11-40%-ban tapasztalható.**',
      'Az ESPGHAN és a WGO ajánlása alapján a Sb CNCM I-745 javasolt AAD (antibiotikum asszociált hasmenés) megelőzésében.***,****',
    ],
    footnotes: [
      '*Goodman et Al. Probiotics for the prevention of antibiotic-associated diarrhoea: a systematic review and meta-analysis BMJ Open 2021;11:e043054.',
      '**Arató András:Aprobiotikumokmegválasztásának szempontjai az akut gasztroenteritiskezelésében és az antibiotikum-asszociált hasmenés megelőzésében Gyermekorvos Továbbképzés XXII.évf4. szám-2023',
      '***Szajewska et Al Probiotics for the Management of Pediatric Gastrointestinal Disorders: Position Paper of the ESPGHAN Special Interest Group on Gut Microbiota and Modifications JPGN, Volume 76, Number 2, February 2023',
      '**** World Gastroenterology Organisation Global Guidelines. Probiotics and prebiotics, February 2023, https://www.worldgastroenterology.org/UserFiles/file/guidelines/ probiotics-and-prebiotics-english-2023.pdfJ. Fungi(Basel). 2020 Jun4;6(2):78. doi: 10.3390/jof6020078.',
    ],
  },
  {
    id: 'q3',
    title: '3. KÉRDÉS',
    prompt:
      'A bélflóra felborulása (diszbiózis) antibiotikum-kúra során 10-ből 9 esetben bekövetkezik, függetlenül attól, hogy a páciens tapasztal-e hasmenést vagy sem.* A különféle antibiotikum terápiák hatására a bélflóra összetétele és gazdagsága akár 1 vagy 2 évre is megváltozhat.**',
    options: [
      { key: 'A', text: 'Igaz' },
      { key: 'B', text: 'Hamis' },
    ],
    correctKey: 'A',
    showFootnotesBeforeReveal: true,
    revealLines: [],
    footnotes: [
      '*Dan Waitzberg et Al. Can the Evidence-Based Use of Probiotics (Notably Saccharomyces boulardii CNCM I-745 and Lactobacillus rhamnosus GG) Mitigate the Clinical Effects of Antibiotic-Associated Dysbiosis? Adv Ther (2024) 41:901–914',
      '**McDonnell et Al. Association between antibiotics and gut microbiome dysbiosis in children: systematic review and meta-analysis GUT MICROBES 2021, VOL. 13, NO. 1, e1870402',
    ],
  },
  {
    id: 'q4',
    title: '4. KÉRDÉS',
    prompt:
      'A 2015-ben Szajewska és mtársai általt publikált meta-analízis eredménye szerint a Saccharomyces boulardii hány százalékkal csökkentette az antibiotikum asszociált hasmenés kialakulásának kockázatát felnőttek és gyermekek körében?*',
    options: [
      { key: 'A', text: '20%-kal' },
      { key: 'B', text: '35%-kal' },
      { key: 'C', text: '15%-kal' },
      { key: 'D', text: 'Több, mint 50%-kal', revealText: 'Több, mint 50%-kal*' },
    ],
    correctKey: 'D',
    showFootnotesBeforeReveal: true,
    revealLines: [],
    footnotes: [
      '* Szajewska H, Kołodziej M. Systematic review with meta-analysis: Saccharomyces boulardii in the prevention of antibiotic-associated diarrhoea. Aliment Pharmacol Ther. 2015 Oct;42(7):793-801. doi: 10.1111/apt.13344. Epub 2015 Jul 27. PMID: 26216624. Felnőttek körében a hasmenés kockázatának csökkenése 53%, gyermekek körében 57% a cikk alapján.',
    ],
  },
  {
    id: 'q5',
    title: '5. KÉRDÉS',
    prompt:
      'Számos kutatás irányul a diszbiózis hosszútávú következményeinek megismerésére. Melyek azok az egészségügyi állapotok, melyek összefüggésben állhatnak a diszbiózissal?*',
    options: [
      { key: 'A', text: 'Diabétesz' },
      { key: 'B', text: 'Túlsúly, elhízás' },
      { key: 'C', text: 'Asztma' },
      { key: 'D', text: 'Immun/gyulladásos betegségek' },
      { key: 'E', text: 'Neurológiai betegségek' },
      { key: 'F', text: 'Mindegyik' },
    ],
    correctKey: 'F',
    showFootnotesBeforeReveal: true,
    revealLines: [],
    footnotes: [
      '*Dan Waitzberg et Al. Can the Evidence-Based Use of Probiotics (Notably Saccharomyces boulardii CNCM I-745 and Lactobacillus rhamnosus GG) Mitigate the Clinical Effects of Antibiotic-Associated Dysbiosis? Adv Ther (2024) 41:901–914',
    ],
  },
  {
    id: 'q6',
    title: '6. KÉRDÉS',
    prompt:
      'Jelenlegi ismereteink szerint hogyan vesz részt a Saccharomyces boulardii CNCM I-745 az antibiotikum-rezisztencia kialakulásában vagy terjedésében?',
    options: [
      { key: 'A', text: 'Növeli a rezisztencia kialakulásának kockázatát' },
      {
        key: 'B',
        text: 'Nem vesz részt a rezisztenciagének terjedésében, mivel nem baktérium.',
        revealText: 'Nem vesz részt a rezisztenciagének terjedésében, mivel nem baktérium.*',
      },
      { key: 'C', text: 'Csökkenti az antibiotikumok hatékonyságát.' },
      { key: 'D', text: 'Átadhat rezisztenciagéneket a bélbaktériumoknak.' },
    ],
    correctKey: 'B',
    revealLines: [],
    footnotes: [
      '*McFarland LV. Systematic review and meta-analysis of Saccharomyces boulardii in adult patients. World J Gastroenterol. 2010 May 14;16(18):2202-22. doi: 10.3748/wjg.v16.i18.2202. PMID: 20458757; PMCID: PMC2868213.',
    ],
  },
];

const PRODUCTS = [
  {
    img: 'products/image9.png',
    name: 'ENTEROL NEO 250 MG',
    form: 'por és oldószer belsőleges szuszpenzióhoz',
    badge: 'Erdei gyümölcs ízű',
    link: 'https://ogyei.gov.hu/gyogyszeradatbazis&action=show_details&item=187368',
  },
  {
    img: 'products/image10.png',
    name: 'ENTEROL FORTE 500 MG',
    form: 'belsőleges por',
    link: 'https://ogyei.gov.hu/gyogyszeradatbazis&action=show_details&item=182153',
  },
  {
    img: 'products/image11.png',
    name: 'ENTEROL 250 MG',
    form: 'kemény kapszula',
    link: 'https://ogyei.gov.hu/gyogyszeradatbazis&action=show_details&item=21240',
  },
  {
    img: 'products/image12.png',
    name: 'ENTEROL 250 MG',
    form: 'belsőleges por',
    link: 'https://ogyei.gov.hu/gyogyszeradatbazis&action=show_details&item=21241',
  },
];

const INDICATIONS = [
  'Felnőttek és gyermekek (0 éves kortól) akut hasmenésének kiegészítő kezelése.',
  'Kiegészítő kezelésként a bélflóra egyensúlyának helyreállítására antibiotikum-kezelés mellett.',
  'Utazással összefüggő, fertőzéses eredetű hasmenés megelőző kezelése.',
  'Kiegészítő kezelésként irritábilis bél szindróma (IBS) esetén',
];

const OUTRO_MESSAGES = [
  'Köszönöm, hogy részt vett a játékban! Remélem, nem volt túl nehéz – ha mégis, diszkréten hallgatok róla! Ha folytatná a „kalandot”, 15:55-kor kezdődik a szimpóziumunk a Szaharomicesz bulárdiról. Köszönöm a látogatást, és további remek konferenciát kívánok!',
  'Köszönöm a játékot! Remélem, legalább annyira élvezte, mint én... Ne feledje, 15:55-kor kezdődik szimpóziumunk a Szaharomicesz bulárdi témájában. Kellemes konferenciát kívánok!',
  'Hálásan köszönöm a részvételét! Remélem, sikerült néhány új információval gazdagodnia – és talán egy mosollyal is. Ha még maradt kérdése, 15:55-kor kezdődik szimpóziumunk a Szaharomicesz bulárdiról. További tartalmas időtöltést kívánok!',
  'Köszönöm, hogy játszott! Izgalmas téma, igaz? Ha érdekesnek találta, várjuk 15:55-kor a Szaharomicesz bulárdival foglalkozó szimpóziumon. Köszönöm az érdeklődést, és élményekben gazdag konferenciát kívánok!',
  'Köszönöm, hogy részt vett a játékban, és remélem, hogy érdekes gondolatokkal, információkkal gazdagodott. Szeretném a figyelmébe ajánlani a 15 óra 55 perckor kezdődő szimpóziumunkat a Szaharomicesz bulárdival kapcsolatosan. Számítunk Önre!',
];

function BrandHeader({ intro = false }) {
  return (
    <header className="brand-header">
      <div className="brand-bubbles" aria-hidden="true">
        <div className="bubble bubble-white" />
        <div className="bubble bubble-outline" />
        <div className="bubble bubble-pink">Egyensúlyban a bélmikrobiom</div>
        <div className="bubble bubble-yellow">Quiz</div>
        <div className="bubble bubble-cyan" />
      </div>

      <div className="brand-right">
        <div className="text-logo" aria-label="Enterol logó">
          <div className="text-logo-main">ENTEROL</div>
          <div className="text-logo-sub">Saccharomyces boulardii CNCM I-745</div>
        </div>
    </header>
  );
}

function Intro({ accepted, onToggleAccepted, onStart, onOpenLegal }) {
  return (
    <section className="screen-card fade-in">
      <BrandHeader intro />

      <div className="intro-body">
        <h1 className="screen-title">Enterol szakmai kvíz</h1>
        <p className="screen-lead">
          A jóváhagyott prezentáció tartalmával megegyező kérdések és válaszok. A helyes opció
          kiválasztása után rögtön megjelenik a kapcsolódó magyarázat és a csillagozott hivatkozás.
        </p>

        <div className="intro-panels">
          <article className="info-box">
            <h2>Játékinfó</h2>
            <ul>
              <li>A játék nem időre megy.</li>
              <li>A játék regisztrációhoz nem kötött.</li>
              <li>A játék során személyes, statisztikai adat nem kerül rögzítésre.</li>
              <li>A nyeremény a játék élménye.</li>
            </ul>
          </article>

          <article className="info-box soft">
            <h2>Részvételi feltétel</h2>
            <p>
              A játék elindításával nyilatkozik arról, hogy érvényes működési engedéllyel rendelkező
              egészségügyi szakembernek minősül.
            </p>
          </article>
        </div>

        <label className="declaration">
          <input type="checkbox" checked={accepted} onChange={onToggleAccepted} />
          <span>
            Kijelentem, hogy egészségügyi szakember vagyok, és elfogadom a játék részvételi
            feltételeit.
          </span>
        </label>

        <div className="intro-actions">
          <button className="btn btn-ghost" onClick={onOpenLegal}>
            Játékszabályzat
          </button>
          <button className="btn btn-primary" disabled={!accepted} onClick={onStart}>
            Kvíz indítása
          </button>
        </div>
      </div>
    </section>
  );
}

function QuestionView({ question, index, total, selectedKey, revealed, onAnswer, onNext, isLast }) {
  return (
    <section className="screen-card fade-in">
      <BrandHeader />

      <div className="quiz-stage">
        <div className="question-meta">
          <h2 className="question-index">{question.title}</h2>
          <p className="question-progress">
            {index + 1} / {total}
          </p>
        </div>

        <div className="question-box">
          <p>{question.prompt}</p>
        </div>

        <div className={`answer-grid ${question.options.length > 4 ? 'many' : ''}`}>
          {question.options.map((option) => {
            const chosen = selectedKey === option.key;
            const isCorrect = revealed && option.key === question.correctKey;
            const isWrong = revealed && chosen && option.key !== question.correctKey;
            const shownText = isCorrect && option.revealText ? option.revealText : option.text;

            return (
              <button
                key={option.key}
                type="button"
                className={[
                  'answer-card',
                  chosen ? 'selected' : '',
                  isCorrect ? 'correct' : '',
                  isWrong ? 'wrong' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => !revealed && onAnswer(option.key)}
                disabled={revealed}
              >
                <span className="answer-letter">{option.key}</span>
                <span className="answer-copy">{shownText}</span>
              </button>
            );
          })}
        </div>

        <div className="controls">
          {revealed && (
            <button className="btn btn-primary" onClick={onNext}>
              {isLast ? 'Tovább' : 'Következő kérdés'}
            </button>
          )}
        </div>

        {(revealed || question.showFootnotesBeforeReveal) && (
          <section className="reveal-block">
            {revealed && question.revealLines.map((line) => (
              <p key={line} className="reveal-line">
                {line}
              </p>
            ))}

            <div className="footnotes">
              {question.footnotes.map((note) => (
                <p key={note}>{note}</p>
              ))}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}

function Summary({ totalCorrect, totalQuestions, onContinue }) {
  return (
    <section className="screen-card fade-in">
      <BrandHeader />

      <div className="summary-panel">
        <h2 className="screen-title">Köszönjük a részvételt!</h2>
        <p className="screen-lead summary-score">
          Ön {totalQuestions} kérdésből <strong>{totalCorrect}</strong> kérdésre válaszolt helyesen.
        </p>

        <article className="talks-box">
          <p>Szíves figyelmébe ajánljuk az alábbi előadásokat:</p>
          <p>2026 április 17.</p>
          <p>15:55–16:15: MAGNAPHARM HUNGARY KFT. ÁLTAL TÁMOGATOTT SZIMPÓZIUM</p>
          <p>
            <strong>C. Difficile infekció prevenció kérdésköre S. boulardii használatával</strong>
          </p>
          <p>Dr. Szőnyi Mihály, gasztroenterológus</p>
          <p>
            <strong>A bélflóra egyensúlyának helyreállítása Saccharomyces boulardii-val</strong>
          </p>
          <p>Dr. Darvas Emília, gasztroenterológus</p>
        </article>

        <button className="btn btn-primary" onClick={onContinue}>
          Tovább a termékcsaládhoz
        </button>
      </div>
    </section>
  );
}

function PromoSlide({ onContinue }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onContinue();
    }
  };

  return (
    <section
      className="promo-panel fade-in promo-clickable"
      onClick={onContinue}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Termékösszehasonlító oldal, kattintson a folytatáshoz"
    >
      <div className="promo-swoosh" aria-hidden="true" />
      <div className="promo-inner">
        <div className="promo-top">
          <h2 className="promo-heading">ENTEROL PROBIOTIKUM TERMÉKCSALÁD:</h2>
          <p className="promo-hint">Kattintson bárhová a folytatáshoz</p>
        </div>

        <div className="product-grid">
          {PRODUCTS.map((product) => (
            <article key={product.name + product.form} className="product-card">
              {product.badge && <span className="product-badge">{product.badge}</span>}
              <div className="product-blob">
                <img src={product.img} alt={product.name} className="product-img" />
              </div>
              <p className="product-name">{product.name}</p>
              <p className="product-form">{product.form}</p>
              <a
                href={product.link}
                target="_blank"
                rel="noreferrer"
                className="product-link"
                onClick={(event) => event.stopPropagation()}
              >
                Alkalmazási előirat
              </a>
            </article>
          ))}
        </div>

        <div className="gold-divider" />

        <section className="indication-section">
          <h3>Terápiás javallatok:</h3>
          <ul>
            {INDICATIONS.map((indication) => (
              <li key={indication}>{indication}</li>
            ))}
          </ul>
        </section>

        <footer className="promo-footer">
          <p>
            Egészségügyi szakemberek részére készült anyag. Az Enterol vény nélkül kapható gyógyszer.
            A gyógyszer részletes alkalmazási előiratát megtekintheti itt: ENTEROL 250 mg kemény
            kapszula: https://ogyei.gov.hu/gyogyszeradatbazis&action=show_details&item=21240.
            ENTEROL 250 mg belsőleges por: https://ogyei.gov.hu/gyogyszeradatbazis&action=show_details&item=21241.
            ENTEROL FORTE 500 mg belsőleges por: https://ogyei.gov.hu/gyogyszeradatbazis&action=show_details&item=182153.
            ENTEROL NEO 250 mg por és oldószer belsőleges szuszpenzióhoz: https://ogyei.gov.hu/gyogyszeradatbazis&action=show_details&item=187368.
          </p>
          <p>
            A termék alkalmazása során esetlegesen fellépő nem kívánt hatásokat a
            vigilance@qualipharmacon.hu email címen tudja jelenteni.
          </p>
          <p>
            Gyártja: Biocodex, Fr., Forgalmazza: MagnaPharm Hungary Kft., 1119 Budapest, Fehérvári
            út 97-99. 4. emelet, Tel:+36 1 354 1840, email: info_budapest@magnapharm.eu
          </p>
          <p>Kód: ENT-2026.03/07 Lezárás dátuma: 2026.03.26.</p>
        </footer>
      </div>
    </section>
  );
}

function FarewellScreen({ message, onRestart }) {
  return (
    <section className="screen-card fade-in">
      <BrandHeader />

      <div className="farewell-panel">
        <div className="farewell-card">
          <h2 className="screen-title">Köszönjük a látogatást!</h2>
          <p className="screen-lead farewell-text">{message}</p>

          <div className="farewell-actions">
            <button className="btn btn-primary" onClick={onRestart}>
              Új kvíz indítása
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [step, setStep] = useState('intro');
  const [accepted, setAccepted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealedMap, setRevealedMap] = useState({});
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [selectedOutro, setSelectedOutro] = useState(OUTRO_MESSAGES[0]);

  const currentQuestion = QUESTIONS[currentIndex];

  useEffect(() => {
    if (!isLegalOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsLegalOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isLegalOpen]);

  const totalCorrect = useMemo(
    () => QUESTIONS.filter((question) => answers[question.id] === question.correctKey).length,
    [answers]
  );

  const handleAnswer = (key) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: key }));
    setRevealedMap((prev) => ({ ...prev, [currentQuestion.id]: true }));
  };

  const handleNext = () => {
    if (currentIndex === QUESTIONS.length - 1) {
      setStep('summary');
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const handlePromoContinue = () => {
    const randomMessage = OUTRO_MESSAGES[Math.floor(Math.random() * OUTRO_MESSAGES.length)];
    setSelectedOutro(randomMessage);
    publishOutroToWebdis(randomMessage);
    setStep('farewell');
  };

  const handleRestart = () => {
    setAccepted(false);
    setCurrentIndex(0);
    setAnswers({});
    setRevealedMap({});
    setIsLegalOpen(false);
    setSelectedOutro(OUTRO_MESSAGES[0]);
    setStep('intro');
  };

  return (
    <main className="app-shell">
      <div className="screen-wrap">
        {step === 'intro' && (
          <Intro
            accepted={accepted}
            onToggleAccepted={() => setAccepted((prev) => !prev)}
            onStart={() => setStep('quiz')}
            onOpenLegal={() => setIsLegalOpen(true)}
          />
        )}

        {step === 'quiz' && (
          <QuestionView
            question={currentQuestion}
            index={currentIndex}
            total={QUESTIONS.length}
            selectedKey={answers[currentQuestion.id]}
            revealed={Boolean(revealedMap[currentQuestion.id])}
            onAnswer={handleAnswer}
            onNext={handleNext}
            isLast={currentIndex === QUESTIONS.length - 1}
          />
        )}

        {step === 'summary' && (
          <Summary
            totalCorrect={totalCorrect}
            totalQuestions={QUESTIONS.length}
            onContinue={() => setStep('promo')}
          />
        )}

        {step === 'promo' && <PromoSlide onContinue={handlePromoContinue} />}

        {step === 'farewell' && (
          <FarewellScreen message={selectedOutro} onRestart={handleRestart} />
        )}
      </div>

      {isLegalOpen && (
        <section
          className="legal-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Játékszabályzat"
          onClick={() => setIsLegalOpen(false)}
        >
          <article className="legal-panel fade-in" onClick={(event) => event.stopPropagation()}>
            <div className="legal-top">
              <h2>Játékszabályzat</h2>
              <button className="btn btn-secondary" onClick={() => setIsLegalOpen(false)}>
                Bezárás
              </button>
            </div>
            <pre className="legal-text">{LEGAL_FULL_TEXT}</pre>
          </article>
        </section>
      )}
    </main>
  );
}
