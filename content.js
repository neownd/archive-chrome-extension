(() => {
  const POPUP_ID = "__archive_chooser_popup__";
  const ARCHIVE_PREFIX = "https://archive.is/";
  const STORAGE_KEY = "sites";
  const DEFAULT_SITES = [
    // Überregional DE
    "spiegel.de",
    "sueddeutsche.de",
    "faz.net",
    "zeit.de",
    "welt.de",
    "handelsblatt.com",
    "tagesspiegel.de",
    "bild.de",
    "focus.de",
    "stern.de",
    "taz.de",
    "freitag.de",
    "cicero.de",
    "nd-aktuell.de",
    "jungewelt.de",
    // Wirtschaft / Magazine
    "wiwo.de",
    "manager-magazin.de",
    "capital.de",
    "businessinsider.de",
    "impulse.de",
    "brandeins.de",
    "finance-magazin.de",
    "platow.de",
    // Regional DE — Berlin / Brandenburg
    "berliner-zeitung.de",
    "bz-berlin.de",
    "morgenpost.de",
    "maz-online.de",
    // Hamburg / Norden
    "abendblatt.de",
    "mopo.de",
    "weser-kurier.de",
    "kreiszeitung.de",
    "shz.de",
    "kn-online.de",
    "ln-online.de",
    "nwzonline.de",
    "noz.de",
    // NRW / Rheinland / Ruhr
    "ksta.de",
    "rundschau-online.de",
    "express.de",
    "rp-online.de",
    "waz.de",
    "nrz.de",
    "wp.de",
    "wr.de",
    "ruhrnachrichten.de",
    "general-anzeiger-bonn.de",
    "aachener-nachrichten.de",
    "aachener-zeitung.de",
    // Hessen / Mitte
    "fr.de",
    "fnp.de",
    "hna.de",
    "mittelhessen.de",
    // Rheinland-Pfalz / Saarland
    "saarbruecker-zeitung.de",
    "volksfreund.de",
    "rheinpfalz.de",
    "allgemeine-zeitung.de",
    "wiesbadener-kurier.de",
    // Baden-Württemberg
    "mannheimer-morgen.de",
    "badische-zeitung.de",
    "stuttgarter-zeitung.de",
    "stuttgarter-nachrichten.de",
    "swp.de",
    "schwaebische.de",
    "heilbronn.de",
    "stimme.de",
    // Bayern
    "merkur.de",
    "tz.de",
    "abendzeitung-muenchen.de",
    "augsburger-allgemeine.de",
    "mainpost.de",
    "nordbayern.de",
    "infranken.de",
    "donaukurier.de",
    "ovb-online.de",
    "pnp.de",
    // Niedersachsen
    "haz.de",
    "neuepresse.de",
    // Sachsen / Sachsen-Anhalt / Thüringen
    "saechsische.de",
    "lvz.de",
    "freiepresse.de",
    "mz.de",
    "volksstimme.de",
    "thueringer-allgemeine.de",
    "tlz.de",
    "otz.de",
    // Mecklenburg-Vorpommern
    "ostsee-zeitung.de",
    "nordkurier.de",
    "svz.de",
    // Nationale Aggregatoren / RND
    "rnd.de",
    // Fach / Tech / IT
    "heise.de",
    "golem.de",
    "t3n.de",
    "computerwoche.de",
    "ix.de",
    "ct.de",
    // Fach / Medien / Marketing / PR
    "horizont.net",
    "wuv.de",
    "meedia.de",
    "kress.de",
    "absatzwirtschaft.de",
    "new-business.de",
    "buchreport.de",
    "boersenblatt.net",
    // Fach / Recht / Steuern / HR
    "lto.de",
    "juve.de",
    "beck-online.de",
    "haufe.de",
    "personalwirtschaft.de",
    // Fach / Medizin / Pharma
    "aerztezeitung.de",
    "pharmazeutische-zeitung.de",
    "deutsche-apotheker-zeitung.de",
    // Fach / Industrie / Verkehr / Handel
    "vdi-nachrichten.com",
    "automobilwoche.de",
    "automobil-produktion.de",
    "dvz.de",
    "lebensmittelzeitung.net",
    "textilwirtschaft.de",
    // Österreich
    "nzz.ch",
    "diepresse.com",
    "derstandard.at",
    "kurier.at",
    "profil.at",
    "trend.at",
    "kleinezeitung.at",
    "salzburg.com",
    "tt.com",
    "vn.at",
    "krone.at",
    // Schweiz (deutschsprachig)
    "tagesanzeiger.ch",
    "bazonline.ch",
    "bernerzeitung.ch",
    "handelszeitung.ch",
    "bilanz.ch",
    "weltwoche.ch",
    "blick.ch",
    "luzernerzeitung.ch",
    "aargauerzeitung.ch",
  ];

  const ICON_SAME_TAB =
    '<svg class="__acp_icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h9.5"/><path d="M8.5 4l4 4-4 4"/></svg>';
  const ICON_NEW_TAB =
    '<svg class="__acp_icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 2.5h4v4"/><path d="M13.5 2.5L7.5 8.5"/><path d="M11.5 9.5v3A1.5 1.5 0 0 1 10 14H3.5A1.5 1.5 0 0 1 2 12.5V6A1.5 1.5 0 0 1 3.5 4.5h3"/></svg>';

  let sites = [];
  let listenerInstalled = false;

  function normalizeSite(raw) {
    if (typeof raw !== "string") return null;
    let s = raw.trim().toLowerCase();
    if (!s) return null;
    s = s.replace(/^https?:\/\//, "");
    s = s.replace(/^\*\./, "");
    s = s.replace(/\/.*$/, "");
    return s || null;
  }

  function hostMatches(hostname) {
    if (!hostname) return false;
    const h = hostname.toLowerCase();
    return sites.some((s) => h === s || h.endsWith("." + s));
  }

  function isCurrentHostConfigured() {
    return hostMatches(location.hostname);
  }

  function resolveInternalHref(anchor) {
    const raw = anchor.getAttribute("href");
    if (!raw) return null;
    if (raw.startsWith("#")) return null;
    if (raw.startsWith("javascript:")) return null;
    if (raw.startsWith("mailto:") || raw.startsWith("tel:")) return null;

    let url;
    try {
      url = new URL(anchor.href, location.href);
    } catch {
      return null;
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!hostMatches(url.hostname)) return null;
    return url.toString();
  }

  function removePopup() {
    const existing = document.getElementById(POPUP_ID);
    if (existing) existing.remove();
    document.removeEventListener("scroll", removePopup, true);
    document.removeEventListener("keydown", onKeyDown, true);
    document.removeEventListener("mousedown", onOutsideMouseDown, true);
  }

  function onKeyDown(e) {
    if (e.key === "Escape") removePopup();
  }

  function onOutsideMouseDown(e) {
    const popup = document.getElementById(POPUP_ID);
    if (popup && !popup.contains(e.target)) removePopup();
  }

  function makeRow({ label, hint, iconSvg, onChoose }) {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "__acp_row";

    const label_el = document.createElement("span");
    label_el.className = "__acp_label";
    label_el.textContent = label;
    row.appendChild(label_el);

    const meta = document.createElement("span");
    meta.className = "__acp_meta";
    meta.innerHTML = iconSvg + '<span class="__acp_hint">' + hint + "</span>";
    row.appendChild(meta);

    row.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      onChoose();
      removePopup();
    });
    return row;
  }

  function makeDivider() {
    const div = document.createElement("div");
    div.className = "__acp_divider";
    return div;
  }

  function shortUrlLabel(targetUrl) {
    try {
      const u = new URL(targetUrl);
      let path = u.pathname + u.search;
      if (path.length > 48) path = path.slice(0, 47) + "…";
      return u.hostname + path;
    } catch {
      return targetUrl;
    }
  }

  function showPopup(x, y, targetUrl) {
    removePopup();

    const popup = document.createElement("div");
    popup.id = POPUP_ID;
    popup.setAttribute("role", "menu");

    const header = document.createElement("div");
    header.className = "__acp_header";
    header.textContent = shortUrlLabel(targetUrl);
    header.title = targetUrl;
    popup.appendChild(header);

    popup.appendChild(makeDivider());

    popup.appendChild(
      makeRow({
        label: "archive.is",
        hint: "gleicher Tab",
        iconSvg: ICON_SAME_TAB,
        onChoose: () => {
          window.location.href = ARCHIVE_PREFIX + targetUrl;
        },
      })
    );
    popup.appendChild(
      makeRow({
        label: "archive.is",
        hint: "neuer Tab",
        iconSvg: ICON_NEW_TAB,
        onChoose: () => {
          window.open(
            ARCHIVE_PREFIX + targetUrl,
            "_blank",
            "noopener,noreferrer"
          );
        },
      })
    );

    popup.appendChild(makeDivider());

    popup.appendChild(
      makeRow({
        label: "Original",
        hint: "gleicher Tab",
        iconSvg: ICON_SAME_TAB,
        onChoose: () => {
          window.location.href = targetUrl;
        },
      })
    );

    popup.style.left = "0px";
    popup.style.top = "0px";
    document.body.appendChild(popup);

    const rect = popup.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;

    let left = x + 6;
    let top = y + 6;
    if (left + rect.width > vw - 8) left = Math.max(8, vw - rect.width - 8);
    if (top + rect.height > vh - 8) top = Math.max(8, y - rect.height - 6);

    popup.style.left = left + window.scrollX + "px";
    popup.style.top = top + window.scrollY + "px";

    document.addEventListener("scroll", removePopup, true);
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("mousedown", onOutsideMouseDown, true);
  }

  function onClickCapture(e) {
    if (e.defaultPrevented) return;
    if (e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const anchor = e.target.closest && e.target.closest("a[href]");
    if (!anchor) return;

    const targetUrl = resolveInternalHref(anchor);
    if (!targetUrl) return;

    e.preventDefault();
    e.stopPropagation();

    showPopup(e.clientX, e.clientY, targetUrl);
  }

  function ensureListener() {
    if (listenerInstalled) return;
    document.addEventListener("click", onClickCapture, true);
    listenerInstalled = true;
  }

  function applySites(rawList) {
    const normalized = Array.isArray(rawList)
      ? rawList.map(normalizeSite).filter(Boolean)
      : [];
    sites = [...new Set(normalized)];
    if (isCurrentHostConfigured()) {
      ensureListener();
    } else {
      removePopup();
    }
  }

  chrome.storage.sync.get({ [STORAGE_KEY]: DEFAULT_SITES }, (data) => {
    applySites(data[STORAGE_KEY]);
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync") return;
    if (!changes[STORAGE_KEY]) return;
    applySites(changes[STORAGE_KEY].newValue);
  });
})();
