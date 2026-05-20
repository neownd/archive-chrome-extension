(() => {
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

  const listEl = document.getElementById("list");
  const formEl = document.getElementById("add-form");
  const inputEl = document.getElementById("add-input");
  const statusEl = document.getElementById("status");
  const addDefaultsBtn = document.getElementById("add-defaults");

  let statusTimer = null;

  function setStatus(msg) {
    statusEl.textContent = msg || "";
    if (statusTimer) clearTimeout(statusTimer);
    if (msg) {
      statusTimer = setTimeout(() => {
        statusEl.textContent = "";
      }, 2500);
    }
  }

  function normalizeSite(raw) {
    if (typeof raw !== "string") return null;
    let s = raw.trim().toLowerCase();
    if (!s) return null;
    s = s.replace(/^https?:\/\//, "");
    s = s.replace(/^\*\./, "");
    s = s.replace(/\/.*$/, "");
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(s)) return null;
    return s;
  }

  function loadSites() {
    return new Promise((resolve) => {
      chrome.storage.sync.get({ [STORAGE_KEY]: DEFAULT_SITES }, (data) => {
        const list = Array.isArray(data[STORAGE_KEY]) ? data[STORAGE_KEY] : [];
        resolve([...new Set(list.map(normalizeSite).filter(Boolean))]);
      });
    });
  }

  function saveSites(sites) {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ [STORAGE_KEY]: sites }, resolve);
    });
  }

  function render(sites) {
    listEl.innerHTML = "";
    if (sites.length === 0) {
      const empty = document.createElement("li");
      empty.className = "empty";
      empty.textContent = "Noch keine Domains. Füge unten eine hinzu.";
      listEl.appendChild(empty);
      return;
    }
    for (const site of sites) {
      const li = document.createElement("li");

      const span = document.createElement("span");
      span.className = "domain";
      span.textContent = site;
      li.appendChild(span);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "remove";
      btn.textContent = "Entfernen";
      btn.addEventListener("click", async () => {
        const current = await loadSites();
        const next = current.filter((s) => s !== site);
        await saveSites(next);
        render(next);
        setStatus(`„${site}" entfernt.`);
      });
      li.appendChild(btn);

      listEl.appendChild(li);
    }
  }

  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const normalized = normalizeSite(inputEl.value);
    if (!normalized) {
      setStatus("Ungültige Domain.");
      inputEl.focus();
      return;
    }
    const current = await loadSites();
    if (current.includes(normalized)) {
      setStatus(`„${normalized}" ist bereits in der Liste.`);
      inputEl.value = "";
      inputEl.focus();
      return;
    }
    const next = [...current, normalized].sort();
    await saveSites(next);
    inputEl.value = "";
    render(next);
    setStatus(`„${normalized}" hinzugefügt.`);
    inputEl.focus();
  });

  addDefaultsBtn.addEventListener("click", async () => {
    const current = await loadSites();
    const merged = [...new Set([...current, ...DEFAULT_SITES])].sort();
    const added = merged.length - current.length;
    if (added === 0) {
      setStatus("Standardliste ist bereits vollständig enthalten.");
      return;
    }
    await saveSites(merged);
    render(merged);
    setStatus(`${added} Domain${added === 1 ? "" : "s"} ergänzt.`);
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync") return;
    if (!changes[STORAGE_KEY]) return;
    const next = Array.isArray(changes[STORAGE_KEY].newValue)
      ? [...new Set(changes[STORAGE_KEY].newValue.map(normalizeSite).filter(Boolean))]
      : [];
    render(next);
  });

  loadSites().then(render);
})();
