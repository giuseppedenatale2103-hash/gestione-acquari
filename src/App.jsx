import { useState, useEffect } from "react";

function App() {
  const [acquari, setAcquari] = useState(() => {
    const salvati = localStorage.getItem("acquari");

    if (false && salvati) {
  return JSON.parse(salvati);
}

    return [
      {
        nome: "Vasca 160 L",
        litri: 160,
        co2: "Si",
        illuminazione: "08:00-14:00",
        piante: "Anubias, Vallisneria, Microsorum",
        cambioAcqua: "48",
        frequenzaCambio: "15 giorni",
        fertilizzazione: "Amtra Flora X + Amtra Flora Y",
        note: "50-60 Guppy, 8 Platy, 3 Ancistrus, 6 Corydoras"
      },
      {
        nome: "Vasca 90 L",
        litri: 90,
        co2: "No",
        illuminazione: "08:00-14:00",
        piante: "Anubias",
        cambioAcqua: "27",
        frequenzaCambio: "15 giorni",
        fertilizzazione: "Amtra Flora X + Amtra Flora Y",
        note: "2 Portaspada, 5 Molly, 2 Ancistrus"
      },
      {
        nome: "Vasca Tavolino",
        litri: 45,
        co2: "Si",
        illuminazione: "08:00-14:00",
        piante: "Anubias, Vallisneria",
        cambioAcqua: "13.5",
        frequenzaCambio: "15 giorni",
        fertilizzazione: "Amtra Flora X",
        note: "50-60 Endler"
      },
      {
        nome: "Vasca Muretto",
        litri: 45,
        co2: "Si",
        illuminazione: "08:00-14:00",
        piante: "Anubias, Vallisneria",
        cambioAcqua: "13.5",
        frequenzaCambio: "15 giorni",
        fertilizzazione: "Amtra Flora X",
        note: "50-60 Endler"
      },
      {
        nome: "Nursery",
        litri: 14,
        co2: "No",
        illuminazione: "08:00-14:00",
        piante: "Piccola Anubias",
        cambioAcqua: "4.2",
        frequenzaCambio: "15 giorni",
        fertilizzazione: "Amtra Flora X",
        note: "30 Guppy giovani, 4 Platy giovani"
      }
    ];
  });

  const [nome, setNome] = useState("");
const [litri, setLitri] = useState("");
const [co2, setCo2] = useState("No");
const [vascaSelezionata, setVascaSelezionata] = useState(null);
const [manutenzioni, setManutenzioni] = useState(() => {
  return JSON.parse(
    localStorage.getItem("manutenzioni") || "{}"
  );
});

const [ultimiCambi, setUltimiCambi] = useState(() => {
  return JSON.parse(
    localStorage.getItem("ultimiCambi") || "{}"
  );
});

  useEffect(() => {
    localStorage.setItem("acquari", JSON.stringify(acquari));
  }, [acquari]);
useEffect(() => {
  localStorage.setItem(
    "manutenzioni",
    JSON.stringify(manutenzioni)
  );
}, [manutenzioni]);

useEffect(() => {
  localStorage.setItem(
    "ultimiCambi",
    JSON.stringify(ultimiCambi)
  );
}, [ultimiCambi]);

  const giorni = [
    "DOMENICA",
    "LUNEDÌ",
    "MARTEDÌ",
    "MERCOLEDÌ",
    "GIOVEDÌ",
    "VENERDÌ",
    "SABATO"
  ];

  const oggi = giorni[new Date().getDay()];

  const attivitaOggi = () => {
    switch (oggi) {
  case "LUNEDÌ":
    return [
      "🌿 Amtra Flora Y 1 ml → Vasca 90 L"
    ];

  case "MERCOLEDÌ":
    return [
      "🌿 Amtra Flora X 5 ml → Vasca 160 L",
      "🌿 Amtra Flora X 2 ml → Vasca 90 L",
      "🌿 Amtra Flora X 1 ml → Vasca Tavolino",
      "🌿 Amtra Flora X 1 ml → Vasca Muretto",
      "🌿 Amtra Flora X 5-6 gocce → Nursery"
    ];

  case "VENERDÌ":
    return [
      "🌿 Amtra Flora Y 4 ml → Vasca 160 L"
    ];

  default:
    return ["😌 Nessuna fertilizzazione programmata"];
}
  };

  const aggiungiAcquario = () => {
    if (!nome || !litri) return;

    setAcquari([
      ...acquari,
      {
        nome,
        litri,
        co2,
        illuminazione: "",
        piante: "",
        cambioAcqua: "30",
        frequenzaCambio: "15 giorni",
        fertilizzazione: "",
        note: ""
      }
    ]);

    setNome("");
    setLitri("");
    setCo2("No");
  };

  const eliminaAcquario = (index) => {
    setAcquari(acquari.filter((_, i) => i !== index));
  };

  const mostraDettagli = (acquario) => {
  setVascaSelezionata(acquario);
};

const registraManutenzione = (tipo) => {
  if (!vascaSelezionata) return;

  const oggi = new Date().toLocaleDateString("it-IT");

  if (tipo === "Cambio acqua") {
    setUltimiCambi((precedenti) => ({
      ...precedenti,
      [vascaSelezionata.nome]: oggi
    }));
  }

  setManutenzioni((precedenti) => ({
    ...precedenti,
    [vascaSelezionata.nome]: [
      ...(precedenti[vascaSelezionata.nome] || []),
      `${oggi} - ${tipo}`
    ]
  }));
};

const prossimoCambioAcqua = (nomeVasca) => {
  const ultimo = ultimiCambi[nomeVasca];

  if (!ultimo) {
    return "Mai registrato";
  }

  const parti = ultimo.split("/");

  const data = new Date(
    parti[2],
    parti[1] - 1,
    parti[0]
  );

  data.setDate(data.getDate() + 15);

  return data.toLocaleDateString("it-IT");
};

const statoCambioAcqua = (nomeVasca) => {
  const ultimo = ultimiCambi[nomeVasca];

  if (!ultimo) {
    return "🔴 Mai registrato";
  }

  const parti = ultimo.split("/");

  const dataCambio = new Date(
    parti[2],
    parti[1] - 1,
    parti[0]
  );

  const oggi = new Date();

  const giorniPassati = Math.floor(
    (oggi - dataCambio) / (1000 * 60 * 60 * 24)
  );

  if (giorniPassati >= 15) {
    return "🔴 Cambio da effettuare";
  }

  if (giorniPassati >= 12) {
    return "🟡 In scadenza";
  }

  return "🟢 Regolare";
};
const prossimaFertilizzazione = (nomeVasca) => {
  switch (nomeVasca) {
    case "Vasca 160 L":
      return "Mercoledì → Amtra Flora X 5 ml";

    case "Vasca 90 L":
      return "Mercoledì → Amtra Flora X 2 ml";

    case "Vasca Tavolino":
      return "Mercoledì → Amtra Flora X 1 ml";

    case "Vasca Muretto":
      return "Mercoledì → Amtra Flora X 1 ml";

    case "Nursery":
      return "Mercoledì → Amtra Flora X 5-6 gocce";

    default:
      return "Nessuna";
  }
};

const litriTotali = acquari.reduce(
  (totale, acquario) => totale + Number(acquario.litri),
  0
);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>AcquariManager</h1>

      <div
        style={{
          border: "2px solid green",
          padding: "15px",
          marginBottom: "20px"
        }}
      >
        <h2>📅 OGGI È {oggi}</h2>

<h3>⚠️ Scadenze cambi acqua</h3>

<ul>
  {acquari.map((vasca, index) => (
    <li key={index}>
      {vasca.nome} → {statoCambioAcqua(vasca.nome)}
    </li>
  ))}
</ul>
        <h3>Attività di oggi</h3>

        <ul>
          {attivitaOggi().map((attivita, index) => (
            <li key={index}>{attivita}</li>
          ))}
        </ul>

        <h3>💧 Cambio acqua</h3>
        <p>30% ogni 15 giorni</p>

        <h3>📊 Statistiche</h3>
        <p>Numero vasche: {acquari.length}</p>
        <p>Litri totali: {litriTotali} L</p>

        <h3>🍼 Nursery</h3>
        <p>30 Guppy giovani + 4 Platy giovani</p>
      </div>

      <h2>Nuova Vasca</h2>

      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <br />
      <br />

      <input
        type="number"
        placeholder="Litri"
        value={litri}
        onChange={(e) => setLitri(e.target.value)}
      />

      <br />
      <br />

      <select
        value={co2}
        onChange={(e) => setCo2(e.target.value)}
      >
        <option>No</option>
        <option>Si</option>
      </select>

      <br />
      <br />

      <button onClick={aggiungiAcquario}>
        Aggiungi Acquario
      </button>

      <h2>Le mie vasche</h2>

      <div>
  {acquari.map((acquario, index) => (
    <div
      key={index}
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "10px",
        marginBottom: "10px",
        textAlign: "center"
      }}
    >
      <h3>{acquario.nome}</h3>

      <p>💧 {acquario.litri} L</p>
      <p>🌿 CO₂: {acquario.co2}</p>

      <button
  onClick={() => mostraDettagli(acquario)}
  style={{
    padding: "8px 12px",
    marginRight: "10px",
    fontSize: "16px"
  }}
>
  Dettagli
</button>

      <button
  onClick={() => eliminaAcquario(index)}
  style={{
    padding: "8px 12px",
    fontSize: "16px"
  }}
>
        Elimina
      </button>
    </div>
  ))}
</div>
{vascaSelezionata && (
  <div
    style={{
      border: "2px solid green",
      padding: "15px",
      marginTop: "20px",
      borderRadius: "10px",
      textAlign: "center",
      wordBreak: "break-word"
    }}
  >
    <h2
  style={{
    marginBottom: "20px"
  }}
>
  {vascaSelezionata.nome}
</h2>

    <p>💧 <b>Litri:</b> {vascaSelezionata.litri}</p>
<p>🌿 <b>CO₂:</b> {vascaSelezionata.co2}</p>
<p>💡 <b>Illuminazione:</b> {vascaSelezionata.illuminazione}</p>
<p>🪴 <b>Piante:</b> {vascaSelezionata.piante}</p>
    <p><b>Fertilizzazione:</b> {vascaSelezionata.fertilizzazione}</p>
<p>
  <b>Prossima fertilizzazione:</b>{" "}
  {prossimaFertilizzazione(vascaSelezionata.nome)}
</p>
    <p><b>Cambio acqua:</b> {vascaSelezionata.cambioAcqua} L</p>

<p>
  <b>Ultimo cambio:</b>{" "}
  {ultimiCambi[vascaSelezionata.nome] || "Mai registrato"}
</p>

<p>
  <b>Prossimo cambio:</b>{" "}
  {prossimoCambioAcqua(vascaSelezionata.nome)}
</p>

<p>
  <b>Stato:</b>{" "}
  {statoCambioAcqua(vascaSelezionata.nome)}
</p>
<p><b>Frequenza:</b> {vascaSelezionata.frequenzaCambio}</p>    <p><b>Note:</b> {vascaSelezionata.note}</p>

    <hr />

    <div
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center"
  }}
>
  <button
    style={{ padding: "10px" }}
    onClick={() => registraManutenzione("Cambio acqua")}
  >
    💧 Cambio acqua
  </button>

  <button
    style={{ padding: "10px" }}
    onClick={() => registraManutenzione("Pulizia filtro")}
  >
    🧽 Pulizia filtro
  </button>

  <button
    style={{ padding: "10px" }}
    onClick={() => registraManutenzione("Potatura")}
  >
    ✂️ Potatura
  </button>

  <button
    style={{ padding: "10px" }}
    onClick={() => registraManutenzione("Fertilizzazione")}
  >
    🌿 Fertilizzazione
  </button>
</div>

    <h3>Storico manutenzioni</h3>

    <ul>
      {(manutenzioni[vascaSelezionata.nome] || []).map(
        (voce, index) => (
          <li key={index}>{voce}</li>
        )
      )}
    </ul>
  </div>
)}

        </div>
  );
}

export default App;