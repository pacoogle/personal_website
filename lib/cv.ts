export type WorkBlock = {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  body: string;
  tech: string[];
  searchText: string;
};

const joinSearch = (parts: (string | string[])[]) =>
  parts
    .flat()
    .map((p) => p.toLowerCase())
    .join(" ");

export const executive = {
  title: "Sintesi",
  headline:
    "Aspirante ninja. Ingegnere informatico dal 2014. Papà innamorato della sua famiglia. La priorità è l’impatto.",
  subline:
    "Strategia tecnologica, architetture solide, team che consegnano, dalle realtà in crescita alle scale-up, in Italia e oltre.",
  searchText: joinSearch([
    "sintesi",
    "executive",
    "cto",
    "gamindo",
    "ingegneria",
    "engineering",
    "12",
    "anni",
    "years",
    "impatto",
    "impact",
    "strategia",
    "strategy",
    "architettura",
    "architecture",
    "team",
  ]),
};

export const work: WorkBlock[] = [
  {
    id: "gamindo",
    role: "Chief Technology Officer (CTO)",
    company: "Gamindo",
    period: "febbraio 2022 – oggi",
    location: "Italia",
    body: "Allineo la strategia tecnologica agli obiettivi di business e alle soluzioni che il mercato offre, guidando innovazione, architettura e sicurezza. Lavoro con fornitori, monitoro l’infrastruttura e guido sviluppatori e designer così che l’organizzazione abbia strumenti e competenze adeguate. Ho introdotto SSO, cache, transizioni controllate, processi a code, adozione cloud, pratiche di intelligenza generativa e containerizzazione sull’intero stack.",
    tech: ["PHP 7.3+", "Node.js", "TypeScript", "Go", "Python"],
    searchText: joinSearch([
      "gamindo",
      "cto",
      "italia",
      "italy",
      "php",
      "node",
      "typescript",
      "go",
      "python",
      "sso",
      "cloud",
      "genai",
      "intelligenza",
      "container",
    ]),
  },
  {
    id: "supermoney",
    role: "Tech lead",
    company: "Supermoney S.p.A.",
    period: "agosto 2020 – gennaio 2022",
    location: "Italia",
    body: "Ho coordinato il team end to end: requisiti, progettazione delle soluzioni e consegne in modalità agile. Ho contribuito a scomporre un monolite in microservizi secondo i principi SOLID, a realizzare un sistema di incasso SDD ricorrente e a integrare API di pagamento di terze parti, con qualità sostenuta anche tramite TDD.",
    tech: [
      "Symfony 4/5",
      "JavaScript",
      "TypeScript",
      "Docker",
      "GitLab",
      "MySQL",
      "TDD",
      "Node.js",
    ],
    searchText: joinSearch([
      "supermoney",
      "tech lead",
      "lead",
      "italia",
      "italy",
      "symfony",
      "typescript",
      "docker",
      "mysql",
    ]),
  },
  {
    id: "talks",
    role: "Tech lead (DevOps e full stack)",
    company: "Talks S.r.l.",
    period: "febbraio 2020 – luglio 2020",
    location: "Milano, Italia",
    body: "Ho progettato integrazioni automatiche con terze parti per i flussi di inserzioni pubblicitarie in ambito SSP, riorganizzato moduli ereditati in una dashboard prodotto più chiara, e portato l’infrastruttura DevOps da monolite a un impianto di servizi mantenibile.",
    tech: [
      "Laravel 6",
      "Lumen 6",
      "Symfony 3/5",
      "MongoDB",
      "MySQL",
      "PHP 7.3",
      "TypeScript",
      "Vue.js 3",
    ],
    searchText: joinSearch([
      "talks",
      "milano",
      "milan",
      "laravel",
      "lumen",
      "vue",
      "mongodb",
      "devops",
    ]),
  },
  {
    id: "buzzoole",
    role:
      "Software engineer · in precedenza scrum master (lug 2019 – ott 2019)",
    company: "Buzzoole",
    period: "febbraio 2018 – gennaio 2020",
    location: "Napoli, Italia",
    body: "Ho realizzato validazione e refresh dei token sui canali social principali, reportistica in linea con Nielsen, API sicure con JWT, modelli di prezzo sull’attività sui social, logica per l’autopubblicazione e acquisizione di blog e articoli. Ho inoltre abilitato le API per l’area brand e la generazione di asset in stile presentazione con Google Slides. Nel 2019 ho coperto il ruolo di scrum master, allineando backlog, sprint e retro con il prodotto.",
    tech: [
      "Laravel 4/5",
      "Lumen 5",
      "Docker",
      "AWS",
      "MongoDB",
      "PostgreSQL",
      "Redis",
      "Beanstalkd",
      "CircleCI",
    ],
    searchText: joinSearch([
      "buzzoole",
      "naples",
      "napoli",
      "laravel",
      "aws",
      "circleci",
      "redis",
      "scrum",
      "instagram",
      "facebook",
    ]),
  },
  {
    id: "paymove",
    role: "Tech lead · in seguito software engineer",
    company: "Paymove S.p.A.",
    period: "marzo 2015 – gennaio 2018",
    location: "Napoli, Italia",
    body: "Ho lavorato su intranet, extranet, aree commerciali e amministrative: da gateway per pagamenti, SDD ricorrenti e report, fino a generazione contratti e CRM aziendale. Da tech lead ho condiviso la pianificazione con il CTO, portato le idee in prototipi e seguito tirocinanti e tesi. Stack full stack in PHP e JavaScript moderni, con punti di contatto J2EE e C# ove serviva nello stesso ecosistema.",
    tech: [
      "PHP 5.6 / 7",
      "Laravel 5.4+",
      "MySQL",
      "Vue.js",
      "jQuery",
      "J2EE",
      "C#",
    ],
    searchText: joinSearch([
      "paymove",
      "naples",
      "napoli",
      "php",
      "laravel",
      "vue",
      "j2ee",
      "c#",
    ]),
  },
  {
    id: "la-scire",
    role: "Sviluppatore full stack",
    company: "La Scire S.r.l.",
    period: "gennaio 2015 – febbraio 2015",
    location: "Telese Terme, Italia",
    body: "Ho consegnato la piattaforma web aziendale e curato in parallelo i sistemi hardware e software di rete, in un incarico breve e ad alta intensità.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    searchText: joinSearch([
      "la scire",
      "telese",
      "html",
      "css",
      "javascript",
    ]),
  },
  {
    id: "tc-systems",
    role: "Analista IT",
    company: "T & C Systems Group",
    period: "settembre 2014 – novembre 2014",
    location: "Napoli, Italia",
    body: "Ho realizzato piattaforme web enterprise con information retrieval, tokenizzazione e lemmatizzazione, ampliato il modello dati aziendale e le interfacce per i motori di ricerca sui CV interni.",
    tech: [
      "J2EE",
      "MySQL",
      "Apache Lucene",
      "Tomcat",
      "GlassFish",
    ],
    searchText: joinSearch([
      "t&c",
      "tc systems",
      "naples",
      "napoli",
      "j2ee",
      "lucene",
      "mysql",
    ]),
  },
  {
    id: "federico-ii",
    role: "Laurea magistrale in ingegneria informatica",
    company: "Università degli Studi di Napoli Federico II",
    period: "2009 – 2014",
    location: "Napoli, Italia",
    body: "Basi in matematica, informatica, progettazione object oriented, reti e ingegneria del software — incluso un progetto su database bancario in Oracle con front-end web, oltre a lavori su multimedia, elaborazione di segnali e protocolli per il mobile.",
    tech: ["Oracle", "J2EE", "OOP", "DBMS"],
    searchText: joinSearch([
      "università",
      "university",
      "federico",
      "naples",
      "napoli",
      "ingegneria",
      "laurea",
      "degree",
      "engineering",
    ]),
  },
];

export const humanSearchText = joinSearch([
  "umano",
  "uman",
  "values",
  "valori",
  "mentoring",
  "tutoraggio",
  "trekking",
  "escursioni",
  "agile",
  "impatto",
  "impact",
  "sistema",
  "system",
  "costanti",
  "constants",
  "logica",
  "logic",
  "collaborazione",
  "collaboration",
  "curiosità",
  "curiosity",
  "hobbies",
  "passioni",
  "society",
  "società",
  "recharge",
  "ricarica",
]);

export const systemConstants: { key: string; value: string; note?: string }[] = [
  {
    key: "IMPATTO",
    value: "non negoziabile",
    note: "Costruire ciò che muove le persone e l’impresa, non solo codice.",
  },
  {
    key: "SUPPORTO",
    value: "mentor.first()",
    note: "Faccio crescere i team: tirocinanti, neo-laureati e profili esperti con la stessa stima.",
  },
  {
    key: "TREKKING",
    value: "ricarica",
    note: "Distanza su un sentiero, lucidità quando si torna alla scrivania.",
  },
  {
    key: "COLLABORAZIONE",
    value: "agile_practitioner",
    note: "Sprint, retro e dialogo continuo con il prodotto.",
  },
  {
    key: "CURIOSITÀ",
    value: "read_eval_print_loop",
    note: "Da Swift 2 a GenAI: non fermarsi alla prima astrazione.",
  },
];

export function visibleWhenQuery(
  q: string,
  haystack: string
): boolean {
  const t = q.trim().toLowerCase();
  if (!t) return true;
  if (t === "sudo") return true;
  return haystack.includes(t);
}
