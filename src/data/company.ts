/**
 * Corporate content. Everything here describes approach and process.
 * No metrics, certifications, client names, dates or people are stated:
 * those are added only once Merova management supplies verified details
 * (tracked in docs/ISSUE-REGISTER.md).
 */

export const PROCESS_STEPS = [
  { name: "Consultation", short: "What you pack, how it ships, volumes and targets.", detail: "We start with the product, how it is filled, stored, shipped and sold, the quantities involved and what is not working today. Existing samples, drawings and photographs help." },
  { name: "Design", short: "Structure and artwork developed around the pack.", detail: "Structural options and artwork layouts are developed around the product and the brand, and reviewed with you before engineering begins." },
  { name: "Engineering", short: "Material, construction and tolerances specified.", detail: "Board grade, ply and flute, film structure or cup stock are specified together with dimensions and tolerances, and written onto a specification you can review." },
  { name: "Sampling", short: "Physical samples for fit and handling checks.", detail: "Samples are produced so fit, assembly, handling and — where agreed — drop or compression performance can be checked before tooling or production." },
  { name: "Approval", short: "Specification and artwork signed off.", detail: "The sample, the specification and the artwork proof are approved. These become the reference for production and for every repeat order." },
  { name: "Manufacturing", short: "Production to the approved reference.", detail: "Production runs to the approved specification, with in-process checks on dimensions, print and construction." },
  { name: "Quality Inspection", short: "Final checks before release.", detail: "Finished goods are inspected against the approved sample and specification before release." },
  { name: "Dispatch", short: "Packed, labelled and dispatched as agreed.", detail: "Goods are packed, labelled and dispatched according to the agreed delivery arrangement, with dispatch communication to your team." },
  { name: "Client Support", short: "Follow-up, repeats and improvements.", detail: "After delivery we support repeat orders, artwork changes, feedback and any issue resolution, and look for improvements on the next run." },
];

export const QUALITY_STAGES = [
  { name: "Incoming material inspection", text: "Board, paper, film and ink are checked against the specified grade and supplier documentation before use." },
  { name: "Production quality control", text: "Checks at defined points during the run — dimensions, crease and cut, print registration and colour, seal or glue integrity." },
  { name: "Dimensional accuracy", text: "Internal dimensions, tolerances and fit are verified against the approved sample and specification." },
  { name: "Printing quality", text: "Colour, registration, legibility and position are checked against the approved artwork proof." },
  { name: "Testing", text: "Performance tests relevant to the product — such as drop, compression or burst for corrugated, or thickness and seal checks for films — are agreed per project." },
  { name: "Inspection & release", text: "Final inspection of count, construction, print and packing condition before goods are released." },
  { name: "Traceability", text: "Production records are kept so a delivery can be traced back to its order, materials and production run." },
  { name: "Corrective action", text: "Non-conformances and complaints are recorded with a root cause and a corrective action, and reviewed to prevent recurrence." },
];

export const MANUFACTURING_PROCESSES = [
  { name: "Material selection & preparation", text: "Board, paper, film and inks selected and prepared for the specified job." },
  { name: "Printing", text: "Print applied to board, paper or film to the approved artwork, using the process suited to the material and quantity." },
  { name: "Corrugation & conversion", text: "Corrugated board converted into boxes, trays, partitions and fitments by slotting, die-cutting and gluing or stitching." },
  { name: "Cutting & creasing", text: "Cartons and die-cut formats cut and creased to the approved dieline." },
  { name: "Finishing", text: "Varnish, lamination, window patching and other finishing operations as specified." },
  { name: "Forming & folding", text: "Folding, gluing and forming of cartons, cups, trays and foodservice formats." },
  { name: "Film conversion", text: "Films slit, wound, sealed or converted into pouches and bags to the specified dimensions." },
  { name: "Inspection, packing & dispatch", text: "Finished goods inspected, packed, labelled and prepared for dispatch." },
];

export const CLIENT_SERVICE = [
  { name: "Dedicated coordination", text: "A named point of contact who coordinates your enquiry, samples, orders and dispatch." },
  { name: "Technical assistance", text: "Help choosing materials, constructions and specifications for your application." },
  { name: "Artwork management", text: "Dieline supply, artwork checks and proof approval before production." },
  { name: "Sample approvals", text: "Structured sample submissions with the specification, so approval is clear and recorded." },
  { name: "Order updates", text: "Updates at key stages so your team can plan receiving and packing." },
  { name: "Dispatch communication", text: "Dispatch details shared when goods leave, so receipt can be planned." },
  { name: "Complaint resolution", text: "Issues logged, investigated and resolved with a documented corrective action." },
];

export const TEAM_FUNCTIONS = [
  { name: "Management", text: "Sets direction, commercial policy and customer commitments, and is accountable for delivery." },
  { name: "Production leadership", text: "Plans and runs production to the approved specification and schedule." },
  { name: "Quality team", text: "Owns inspection, testing, records and corrective action across incoming, in-process and final stages." },
  { name: "Technical specialists", text: "Specify materials and constructions, and support sampling and trials." },
  { name: "Design", text: "Develops structures, dielines and artwork layouts, and supports proofing." },
  { name: "Customer service", text: "Coordinates enquiries, samples, orders and dispatch, and is your day-to-day contact." },
];

export const SUSTAINABILITY_TOPICS = [
  { name: "Recycled paper", text: "Recycled-content papers and boards are used where they meet the performance requirement. Recycled content is stated per grade, with supplier documentation." },
  { name: "Responsible material sourcing", text: "Materials are sourced from suppliers who can document grade and origin. Certified-source options can be requested." },
  { name: "Waste management", text: "Production waste is segregated so recyclable material can be recovered." },
  { name: "Production offcut recycling", text: "Paper and board offcuts from cutting and trimming are collected for recycling." },
  { name: "Material optimisation", text: "Board grades and film structures are specified to the lightest option that still meets the performance requirement." },
  { name: "Packaging weight optimisation", text: "Right-sizing and structural design reduce material use, void fill and freight volume." },
  { name: "Recyclable formats", text: "Mono-material and paper-based formats are recommended where the application allows, so packaging stays in one recycling stream." },
  { name: "Compostable materials", text: "Certified-compostable bags and films are offered as options, stated only against the certificate for the specific grade." },
  { name: "Plastic alternatives", text: "Paper-based inserts, trays and bags can replace some plastic components; each case is assessed for performance." },
  { name: "Resource efficiency", text: "Planning, nesting of dielines and fewer make-readies help reduce start-up waste." },
];

export const CLAIM_DEFINITIONS = [
  { term: "Recyclable", text: "Can be collected, sorted and reprocessed into new material — but only where suitable collection and recycling facilities exist. Coatings, laminates and contamination can affect recyclability." },
  { term: "Recycled content", text: "Contains material recovered from previous use. Stated as a percentage for a specific grade, based on supplier documentation." },
  { term: "Biodegradable", text: "Broken down by microorganisms over time. On its own the term specifies neither conditions nor timeframe, so Merova does not use it as a standalone claim." },
  { term: "Compostable", text: "Breaks down under defined composting conditions within a defined time, verified against a standard (for example EN 13432, ASTM D6400 or IS 17088). Industrial and home compostability are different certifications." },
];

/**
 * SAMPLE facility facts for preview. Replace with Merova-verified data (verification items V-09, V-10).
 * Every block that renders these shows a "Sample data" badge.
 */
export const SAMPLE_FACILITY = {
  facts: [
    { value: "4", label: "material categories under one specification process" },
    { value: "71", label: "product types in the portfolio" },
    { value: "9", label: "industries served" },
    { value: "2", label: "locations: office and plant (sample addresses)" },
  ],
  equipment: [
    { area: "Printing", items: ["Multi-colour sheet-fed offset press", "Flexographic printing for corrugated and film", "Digital label press"] },
    { area: "Corrugation & conversion", items: ["Corrugation line for 3, 5 and 7-ply board", "Rotary and flatbed die-cutters", "Folder-gluers and stitching"] },
    { area: "Foodservice & film", items: ["Paper cup and container forming", "Film slitting and rewinding", "Pouch and bag making"] },
    { area: "Quality", items: ["Bursting strength and ECT testing", "Thickness and GSM measurement", "Colour viewing booth"] },
  ],
  certifications: [
    { name: "ISO 9001:2015 quality management", status: "Sample: certificate to be supplied" },
    { name: "FSSC 22000 / food-contact compliance", status: "Sample: certificate to be supplied" },
    { name: "FSC® chain of custody", status: "Sample: certificate to be supplied" },
    { name: "CPCB certificates for compostable grades", status: "Sample: certificate to be supplied" },
  ],
};

export const VALUES = [
  { title: "Specified, not sold", text: "We start from the product, the line and the route, and specify packaging to suit, rather than pushing a catalogue item." },
  { title: "Sample before production", text: "Fit, handling and print are approved on a sample, and that sample becomes the reference for every repeat order." },
  { title: "Print as a discipline", text: "Colour, registration and finish are controlled from proof to final inspection." },
  { title: "Material honesty", text: "Compostable, recyclable and conventional materials are named precisely, and claims are backed by certificates." },
];
