import type { Article } from "./types";

const PENDING = { status: "pending" as const };
const ILL = (n: string) => `/assets/products/renders/${n}.webp`;

export const articles1: Article[] = [
  {
    slug: "3-ply-vs-5-ply-vs-7-ply-corrugated-boxes",
    title: "3-Ply vs 5-Ply vs 7-Ply Corrugated Boxes: How to Choose",
    description: "What the ply count means, how 3-ply, 5-ply and 7-ply corrugated boxes differ, and how to choose the right construction for your product, stacking and route.",
    category: "corrugated",
    keyword: "3 ply vs 5 ply vs 7 ply",
    image: ILL("box-5ply"),
    intro:
      "Ply count is usually the first thing buyers specify for a corrugated box — and often the only thing. But ply is a starting point, not a complete specification. This guide explains what each construction is, where it fits and what else you need to specify.",
    sections: [
      {
        heading: "What 'ply' means",
        blocks: [
          { type: "p", text: "Corrugated board is made by bonding flat **liner** papers to wavy **fluted medium** papers. Each paper layer is a 'ply'." },
          {
            type: "table",
            head: ["Construction", "Layers", "Also called"],
            rows: [
              ["3-ply", "2 liners + 1 fluted medium", "Single wall"],
              ["5-ply", "3 liners + 2 fluted mediums", "Double wall"],
              ["7-ply", "4 liners + 3 fluted mediums", "Triple wall"],
            ],
          },
          { type: "p", text: "Each added wall increases thickness, stacking (compression) strength and puncture resistance — and also weight, material use and cost." },
        ],
      },
      {
        heading: "Where each construction typically fits",
        blocks: [
          { type: "h3", text: "3-ply (single wall)" },
          { type: "p", text: "Light to medium products, short or controlled distribution, e-commerce parcels, retail shippers and many secondary packs. Efficient and economical when correctly specified." },
          { type: "h3", text: "5-ply (double wall)" },
          { type: "p", text: "Heavier products, taller pallet stacks, longer storage, appliances, electronics and many industrial and automotive components." },
          { type: "h3", text: "7-ply (triple wall)" },
          { type: "p", text: "Very heavy or dense loads, demanding export routes and bulk industrial packaging, sometimes as an alternative to timber." },
        ],
      },
      {
        heading: "Ply is not the whole specification",
        blocks: [
          { type: "p", text: "Two 5-ply boxes can perform very differently. Box performance also depends on:" },
          {
            type: "ul",
            items: [
              "**Paper grades** — the weight (GSM) and strength (for example bursting factor, BF) of each liner and medium.",
              "**Flute profile** — E, B, C and combinations such as BC or EB. See [Understanding B, C and E flute](/blog/understanding-b-flute-c-flute-e-flute).",
              "**Box style and dimensions** — taller, larger boxes need more strength to resist bulging and buckling.",
              "**Conditions** — humidity, storage time and handling all reduce effective strength.",
            ],
          },
          { type: "note", text: "A well-specified 3-ply can outperform a poorly specified 5-ply. Specify the complete construction against the application rather than the ply count alone." },
        ],
      },
      {
        heading: "Information to share when you request a quote",
        blocks: [
          { type: "ul", items: ["Product weight and dimensions", "Internal box dimensions", "How many boxes are stacked and for how long", "Storage and transit conditions (including humidity and export)", "Any current specification or a sample box"] },
        ],
      },
    ],
    recommendations: [
      "Start from product weight, stacking height, storage time and route — then select ply.",
      "Ask for the complete construction (papers and flute), not just the ply count.",
      "If boxes are crushing or bulging, review construction before simply adding a wall.",
      "Consider internal partitions or fitments, which can sometimes allow a lighter outer box.",
    ],
    applications: ["E-commerce and retail (3-ply)", "Appliances, electronics and auto parts (5-ply)", "Heavy industrial and export loads (7-ply)"],
    faqs: [
      { q: "Is 5-ply twice as strong as 3-ply?", a: "Not as a rule. Strength depends on the paper grades and flutes as well as the number of walls. Compression strength is assessed for the complete construction." },
      { q: "Can I reduce cost by moving from 5-ply to 3-ply?", a: "Sometimes, if the 5-ply was over-specified. Any change should be validated against your stacking and transit conditions, ideally with samples." },
      { q: "What is BF in corrugated paper?", a: "Bursting factor — a measure of paper strength commonly used in specifying kraft papers for corrugated board." },
    ],
    relatedProducts: ["3-ply-boxes", "5-ply-boxes", "7-ply-boxes", "heavy-duty-cartons"],
    cta: { title: "Not sure which construction you need?", label: "Get a construction recommendation", href: "/request-a-quote?product=5-ply-boxes" },
    review: PENDING,
  },
  {
    slug: "understanding-b-flute-c-flute-e-flute",
    title: "Understanding B-Flute, C-Flute and E-Flute Corrugated Board",
    description: "How flute profiles affect strength, cushioning and print in corrugated packaging — with typical flute heights and where B, C, E, BC and EB flutes are used.",
    category: "corrugated",
    keyword: "B flute vs C flute vs E flute",
    image: ILL("export-carton"),
    intro: "The flute is the wavy layer inside corrugated board. Its height and frequency change how a box stacks, cushions and prints. Choosing the right flute is as important as choosing the right ply.",
    sections: [
      {
        heading: "Common flute profiles",
        blocks: [
          {
            type: "table",
            caption: "Typical industry reference values. Exact dimensions vary by manufacturer and equipment.",
            head: ["Flute", "Typical height", "Characteristics", "Common uses"],
            rows: [
              ["E", "≈ 1.1–1.6 mm", "Thin, smooth surface, good print and fold", "Retail boxes, mailers, die-cut cartons"],
              ["B", "≈ 2.5–3.0 mm", "Good crush and puncture resistance", "Shipping boxes, trays, inserts"],
              ["C", "≈ 3.5–4.0 mm", "Thicker, good stacking and cushioning", "Shipping cartons, heavier products"],
            ],
          },
        ],
      },
      {
        heading: "Double-wall combinations",
        blocks: [
          { type: "p", text: "Double-wall (5-ply) boards combine two flutes:" },
          { type: "ul", items: ["**BC flute** — thicker board with strong stacking performance for heavier loads.", "**EB flute** — a finer E flute on the outside gives a smoother print surface, while B flute adds strength."] },
        ],
      },
      {
        heading: "How flute choice affects performance",
        blocks: [
          { type: "ul", items: ["**Stacking strength:** taller flutes generally give higher edge-crush and box compression strength.", "**Flat crush and puncture:** shorter, more frequent flutes resist crushing of the board surface.", "**Print quality:** finer flutes produce a flatter surface for sharper print.", "**Space and weight:** thinner board saves storage space and freight volume."] },
        ],
      },
    ],
    recommendations: ["Use E flute where print quality and compact folding matter.", "Use B or C flute for general shipping depending on load.", "Consider EB for printed shippers and BC for heavier double-wall applications.", "Validate the full construction on a sample."],
    applications: ["Retail and e-commerce (E, EB)", "General shipping (B, C)", "Heavy-duty and stacked loads (BC)"],
    faqs: [
      { q: "Which flute is strongest?", a: "For stacking, taller flutes such as C generally perform better; for surface crush and print, finer flutes such as E or B are preferred. The best flute depends on the application." },
      { q: "Is A flute still used?", a: "A flute (the tallest common profile) is used in some regions and applications, but B, C and E and their combinations are more common in many markets." },
      { q: "Can flute direction matter?", a: "Yes. Flutes are normally vertical in box walls to maximise stacking strength." },
    ],
    relatedProducts: ["3-ply-boxes", "5-ply-boxes", "die-cut-boxes", "e-commerce-boxes"],
    cta: { title: "Need help choosing a flute?", label: "Ask our team", href: "/request-a-quote?product=3-ply-boxes" },
    review: PENDING,
  },
  {
    slug: "pharmaceutical-packaging-selection",
    title: "Pharmaceutical Packaging Selection: Cartons, Shippers and Inserts",
    description: "A practical guide to selecting pharmaceutical secondary packaging — mono cartons, inserts, partitions and shipper cartons — and what to specify.",
    category: "pharmaceutical",
    keyword: "pharmaceutical packaging selection",
    image: ILL("pharma-carton"),
    intro: "Pharmaceutical packaging carries regulated information and protects products that cannot be compromised. This guide focuses on secondary and tertiary packaging — cartons, inserts and shippers — and what buyers should specify.",
    sections: [
      {
        heading: "Packaging levels",
        blocks: [
          { type: "table", head: ["Level", "Examples", "Main role"], rows: [["Primary", "Blister, bottle, vial, tube", "Direct product contact"], ["Secondary", "Mono carton, leaflet", "Information, protection, identification"], ["Tertiary", "Shipper carton, partitions", "Distribution and handling"]] },
          { type: "note", text: "Primary pharmaceutical packaging has specific regulatory requirements. Confirm applicable requirements with your regulatory team." },
        ],
      },
      {
        heading: "Specifying pharmaceutical cartons",
        blocks: [
          { type: "ul", items: ["**Artwork control:** text accuracy and approved proofs are essential.", "**Board and print:** legible, consistent print on a suitable board.", "**Dimensions:** consistent to run on cartoning lines; accommodate any leaflet.", "**Coding:** unvarnished areas for batch, expiry and serialisation codes where needed.", "**Features:** Braille or tamper-evidence where required by your market."] },
        ],
      },
      {
        heading: "Protecting products in distribution",
        blocks: [{ type: "p", text: "Glass vials and bottles need partitions or inserts. Shipper cartons should be specified for weight and stacking. See [partitions and inserts](/corrugated-packaging/partitions-inserts)." }],
      },
    ],
    recommendations: ["Define who approves artwork and how proofs are controlled.", "Share cartoning machine details early.", "Specify coding areas and any Braille requirement up front.", "Specify shippers and partitions together with cartons."],
    applications: ["Tablet and capsule strips", "Syrups and bottles", "Injectables and vials", "Nutraceuticals"],
    faqs: [
      { q: "What is a mono carton in pharma?", a: "A single-unit carton holding one primary pack, such as one bottle or a set of blister strips, with printed product information." },
      { q: "Do pharmaceutical cartons need special board?", a: "Board choice depends on print, strength and customer requirements. Many pharmaceutical cartons use bleached boards for clean, legible print." },
      { q: "Who is responsible for regulatory text?", a: "The marketing authorisation holder is responsible for the content; the packaging supplier prints to the approved artwork." },
    ],
    relatedProducts: ["pharmaceutical-cartons", "mono-cartons", "partitions-inserts", "3-ply-boxes"],
    cta: { title: "Planning pharmaceutical packaging?", label: "Explore pharmaceutical packaging", href: "/industries/pharmaceutical-packaging" },
    review: PENDING,
  },
  {
    slug: "automotive-transit-packaging",
    title: "Automotive Transit Packaging: Protecting Components Between Plants",
    description: "How to specify corrugated transit packaging for auto components — box construction, partitions, surface protection and export considerations.",
    category: "automotive",
    keyword: "automotive transit packaging",
    image: ILL("heavy-duty"),
    intro: "Auto components move between suppliers, plants and aftermarket channels, often in large volumes and with tight quality expectations. Transit packaging must protect parts, keep them separated and make line-side handling easy.",
    sections: [
      {
        heading: "Key requirements",
        blocks: [{ type: "ul", items: ["**Load:** dense, heavy parts need strong board — often 5-ply or 7-ply.", "**Separation:** partitions and trays stop parts touching.", "**Surface protection:** machined or painted surfaces may need liners, films or soft inserts.", "**Identification:** clear areas for labels and part numbers.", "**Ergonomics:** sensible box weight and easy opening at the line."] }],
      },
      {
        heading: "Corrugated formats commonly used",
        blocks: [{ type: "table", head: ["Format", "Typical role"], rows: [["Heavy-duty cartons", "Outer transit pack for heavy parts"], ["Partitions", "Separate individual components"], ["Trays and layer pads", "Layer parts within a box"], ["Protective inserts", "Hold parts in position, protect surfaces"], ["Export cartons", "Long-distance and container shipment"]] }],
      },
      {
        heading: "Corrugated or returnable packaging?",
        blocks: [{ type: "p", text: "Returnable plastic or metal packaging suits closed loops with return logistics. Corrugated is often preferred for one-way, export, low-volume or variable flows. The decision depends on volume, distance and return logistics." }],
      },
    ],
    recommendations: ["Specify box construction from part weight and stacking height.", "Develop partitions from part drawings or samples.", "Plan for humidity on export routes.", "Optimise box size to pallet and container footprints."],
    applications: ["Engine and transmission parts", "Electrical and electronic components", "Machined and painted parts", "Aftermarket spares"],
    faqs: [
      { q: "Why do auto parts need partitions?", a: "To stop parts contacting each other, which can cause scratches, dents or damage to precision surfaces." },
      { q: "Is 7-ply always needed for heavy parts?", a: "Not always — 5-ply with the right papers and internal fitments may be sufficient. Validate with samples." },
      { q: "Can packaging include VCI protection?", a: "Corrosion protection such as VCI materials can be discussed for specific requirements." },
    ],
    relatedProducts: ["heavy-duty-cartons", "partitions-inserts", "7-ply-boxes", "export-cartons"],
    cta: { title: "Packaging auto components?", label: "Explore automotive packaging", href: "/industries/automotive-packaging" },
    review: PENDING,
  },
  {
    slug: "multiplex-popcorn-and-foodservice-packaging",
    title: "Multiplex Popcorn and Concession Packaging: A Buyer's Guide",
    description: "How cinemas can specify popcorn cones and tubs, nachos and fries trays, cups and ice cream cups as one coordinated, food-safe concession range.",
    category: "foodservice",
    keyword: "multiplex popcorn packaging",
    image: ILL("popcorn-tub"),
    intro: "Cinema concession packaging must handle grease and heat, survive interval rushes and carry the cinema's brand. Treating the range as one system — rather than buying items separately — usually gives better consistency and control.",
    sections: [
      {
        heading: "The core concession range",
        blocks: [{ type: "table", head: ["Item", "Key considerations"], rows: [["Popcorn cones", "Grease resistance, nesting, hand-held comfort"], ["Popcorn tubs", "Capacity ladder for combos, stable base, grease barrier"], ["Nachos trays", "Dip compartment, hot cheese sauce, rigidity"], ["French fries trays", "Grease resistance, upright holding"], ["Beverage cups", "Hot or cold application, lid fit, condensation"], ["Ice cream cups", "Moisture resistance, lid fit"]] }],
      },
      {
        heading: "Food contact and barriers",
        blocks: [{ type: "p", text: "Buttered popcorn, cheese sauce and fried foods need suitable food-contact board and grease barriers. Ask for the applicable food-contact documentation for each material." }],
      },
      {
        heading: "Planning the capacity ladder",
        blocks: [{ type: "p", text: "Combo pricing depends on clear size steps. Confirm capacities with samples, as perceived size depends on shape as well as volume." }],
      },
      {
        heading: "Promotions",
        blocks: [{ type: "p", text: "Film promotions run to fixed dates. Agree artwork deadlines and production lead times early." }],
      },
    ],
    recommendations: ["Specify the full range together so print and quality are consistent.", "Confirm food-contact documentation per material.", "Test capacities and nesting with samples.", "Plan promotional print well before release dates."],
    applications: ["Multiplex concessions", "Single-screen cinemas", "Events and leisure venues"],
    faqs: [
      { q: "What material are popcorn tubs made from?", a: "Typically food-grade paperboard with a grease-resistant barrier suited to buttered or flavoured popcorn." },
      { q: "Can one supplier provide the full range?", a: "Merova can quote popcorn cones and tubs, nachos and fries trays, cups and ice cream cups in one enquiry." },
      { q: "Can tubs be custom printed?", a: "Yes, custom and promotional print can be specified." },
    ],
    relatedProducts: ["popcorn-tubs", "popcorn-cones", "nachos-trays", "beverage-cups"],
    cta: { title: "Planning concession packaging?", label: "Explore multiplex packaging", href: "/industries/cinema-multiplex-packaging" },
    review: PENDING,
  },
  {
    slug: "nachos-trays-and-french-fries-trays-material-selection",
    title: "Nachos Trays and French Fries Trays: Material Selection",
    description: "How to choose board, grease barriers and formats for nachos and fries trays so they stay rigid, clean and food-safe in service.",
    category: "foodservice",
    keyword: "nachos tray material",
    image: ILL("nachos-tray"),
    intro: "Nachos and fries are hot, oily and often eaten on the move. The tray has to stay rigid, keep grease off hands and clothes, and look good at the counter.",
    sections: [
      {
        heading: "What the material must do",
        blocks: [{ type: "ul", items: ["Resist grease and oil for the serving time", "Stay rigid when loaded and carried", "Suit hot food and sauces", "Be suitable for food contact", "Print cleanly for branding"] }],
      },
      {
        heading: "Board and barrier options",
        blocks: [{ type: "p", text: "Paperboard trays use food-grade board with a barrier — for example PE coating or a water-based (aqueous) grease-resistant coating — selected for the food and serving time. Corrugated trays can be used for larger portions." }, { type: "note", text: "Barrier choice can affect recyclability and compostability. Ask about options if end-of-life matters to you." }],
      },
      {
        heading: "Format choices",
        blocks: [{ type: "table", head: ["Format", "Best for"], rows: [["Nachos tray with dip well", "Chips plus sauce in one pack"], ["Open boat tray", "Fries, snacks and sides"], ["Scoop carton", "Hand-held fries portions"]] }],
      },
    ],
    recommendations: ["Tell your supplier the food, sauce and serving temperature.", "Check rigidity with a fully loaded sample.", "Confirm food-contact documentation.", "Consider nesting for counter storage."],
    applications: ["Cinemas", "QSR", "Food courts", "Stadiums and events"],
    faqs: [
      { q: "Why do trays go soft?", a: "Grease and moisture migrate into board that is not adequately protected. A suitable barrier and board grade prevent this." },
      { q: "Can trays be compostable?", a: "Some board and coating combinations can be certified compostable. Ask for certification for the specific material." },
      { q: "Do trays need separate dip cups?", a: "Integrated dip wells avoid extra components; separate cups give more flexibility." },
    ],
    relatedProducts: ["nachos-trays", "french-fries-trays", "food-trays", "popcorn-tubs"],
    cta: { title: "Specifying trays?", label: "Request a quote for nachos trays", href: "/request-a-quote?product=nachos-trays" },
    review: PENDING,
  },
  {
    slug: "paper-beverage-cups-technical-considerations",
    title: "Paper Beverage Cups: Technical Considerations",
    description: "Hot versus cold cups, single, double and ripple walls, cup stock and coatings, capacities and lids — what to specify when buying paper cups.",
    category: "foodservice",
    keyword: "paper cups specification",
    image: ILL("beverage-cups"),
    intro: "A paper cup looks simple, but hot drinks, cold drinks and frozen desserts each place different demands on cup stock, coatings and construction.",
    sections: [
      {
        heading: "Hot versus cold",
        blocks: [{ type: "table", head: ["", "Hot cups", "Cold cups"], rows: [["Main challenge", "Heat and hand comfort", "Condensation and longer liquid contact"], ["Construction", "Single, double or ripple wall", "Usually single wall"], ["Accessories", "Lids, sleeves", "Lids, straws"]] }],
      },
      {
        heading: "Wall construction",
        blocks: [{ type: "ul", items: ["**Single wall:** economical; may need a sleeve for very hot drinks.", "**Double wall:** an outer wall creates insulation, usually removing the need for a sleeve.", "**Ripple wall:** a textured outer layer adds insulation and grip."] }],
      },
      {
        heading: "Cup stock and coatings",
        blocks: [{ type: "p", text: "Cups use food-grade cup stock with a liquid barrier — traditionally PE, with aqueous and other barriers as alternatives. Coating choice affects recyclability and compostability depending on local facilities." }],
      },
      {
        heading: "Capacities and lids",
        blocks: [{ type: "p", text: "Common industry sizes range from about 4 oz to 16 oz and above. Confirm the capacity you need (brimful versus fill line) and lid compatibility using samples." }],
      },
    ],
    recommendations: ["Choose construction based on drink temperature.", "Specify capacity and lid together.", "Ask about coating options and end-of-life.", "Confirm food-contact documentation."],
    applications: ["Cafés and QSR", "Cinemas", "Corporate pantries", "Events"],
    faqs: [
      { q: "Can hot cups be used for cold drinks?", a: "They can, but condensation and longer contact time make cold-specific cups more suitable." },
      { q: "What is the difference between brimful and fill-line capacity?", a: "Brimful is the volume when filled to the rim; fill-line capacity is the practical serving volume below the rim." },
      { q: "Are paper cups recyclable?", a: "It depends on the coating and on local collection and recycling capabilities." },
    ],
    relatedProducts: ["beverage-cups", "cup-sleeves", "ice-cream-cups", "popcorn-tubs"],
    cta: { title: "Need paper cups?", label: "Request a cup quote", href: "/request-a-quote?product=beverage-cups" },
    review: PENDING,
  },
];
