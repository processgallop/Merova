import type { Vertical } from "./types";

export const verticals: Vertical[] = [
  {
    id: "corrugated",
    slug: "corrugated-packaging",
    name: "Corrugated Packaging",
    navName: "Corrugated",
    headline: "Corrugated packaging specified for the route your product travels.",
    intro:
      "Shipping boxes, heavy-duty cartons, trays, partitions and retail-ready formats, specified by ply, flute and board grade against how the pack is stacked, handled and shipped.",
    description:
      "3-ply, 5-ply and 7-ply corrugated boxes, die-cut formats, export cartons, e-commerce boxes, trays, partitions, protective packaging and retail-ready display packaging.",
    technologies: [
      { name: "Ply construction", text: "3-ply (single wall), 5-ply (double wall) and 7-ply (triple wall) boards, chosen against load, stacking height and transit conditions." },
      { name: "Flute profiles", text: "B, C and E flutes and combinations such as BC and EB, balancing compression strength, cushioning and print surface." },
      { name: "Box styles", text: "Regular slotted cartons (RSC), die-cut styles, trays, sleeves, partitions and fitments." },
      { name: "Print and finish", text: "Plain, single-colour and multi-colour print options, specified per order with the print process confirmed at quotation." },
    ],
    image: { src: "/assets/products/corrugated-shippers.webp", alt: "Stack of brown corrugated shipping boxes with one box open", kind: "representative" },
    seo: {
      primary: "corrugated packaging",
      secondary: ["corrugated boxes manufacturer", "3 ply 5 ply 7 ply boxes", "corrugated cartons", "export cartons"],
      title: "Corrugated Packaging & Corrugated Boxes | Merova Printpack",
      description: "3-ply, 5-ply and 7-ply corrugated boxes, die-cut boxes, export cartons, e-commerce boxes, trays and partitions — specified to your load and route. Request a quote.",
    },
    faqs: [
      { q: "How do I choose between 3-ply, 5-ply and 7-ply boxes?", a: "Start with the weight of the packed product, how high the boxes will be stacked, how long they will be stored and how rough the transit is. Light, short-route goods often suit 3-ply; heavier or stacked loads move to 5-ply; very heavy, export or industrial loads may need 7-ply. Merova confirms the construction against your application before sampling." },
      { q: "Can you match an existing box specification?", a: "Yes. Share the current box dimensions, ply, flute and board details (or a sample) through the quote form and the team will review it, and may suggest an alternative if it improves performance or cost." },
      { q: "Do you supply printed corrugated boxes?", a: "Printed options can be specified. The number of colours, print coverage and print process are confirmed at quotation against your artwork and quantity." },
    ],
  },
  {
    id: "paper",
    slug: "paper-packaging",
    name: "Paperboard & Paper Packaging",
    navName: "Paperboard & Paper",
    headline: "Printed cartons and paper packaging that present, protect and comply.",
    intro:
      "Folding cartons, mono cartons, pharmaceutical and food cartons, window cartons, sleeves, gift boxes and premium presentation packaging, specified by board, print and finish.",
    description:
      "Folding cartons, mono cartons, pharmaceutical cartons, food cartons, window cartons, sleeves, gift boxes, rigid boxes and printed paper packaging.",
    technologies: [
      { name: "Paperboard grades", text: "Folding boxboard (FBB), solid bleached board (SBS), duplex and kraft-based boards, selected by application, print and contact requirements." },
      { name: "Carton construction", text: "Tuck-end, straight-line, crash-lock and auto-lock bases, sleeves, trays and window patching." },
      { name: "Print and embellishment", text: "Multi-colour print with varnish, lamination, foiling and embossing options, specified per project." },
      { name: "Presentation formats", text: "Gift boxes and rigid presentation boxes for premium and corporate gifting, subject to capability confirmation." },
    ],
    image: { src: "/assets/products/printed-folding-cartons.webp", alt: "Printed folding cartons in kraft, white and black with red graphic panels", kind: "representative" },
    seo: {
      primary: "paperboard packaging",
      secondary: ["folding cartons manufacturer", "mono cartons", "pharmaceutical cartons", "printed cartons"],
      title: "Paperboard Packaging, Folding & Mono Cartons | Merova Printpack",
      description: "Folding cartons, mono cartons, pharmaceutical and food cartons, window cartons, sleeves and gift boxes — printed and finished to your brand. Request a quote.",
    },
    faqs: [
      { q: "What is the difference between a mono carton and a folding carton?", a: "In common usage the terms overlap. 'Mono carton' usually means a single-unit printed carton that holds one product (for example one bottle or one tube), while 'folding carton' is the broader category of paperboard cartons supplied flat and folded at packing." },
      { q: "Which board should I choose for my carton?", a: "It depends on the product weight, print quality expected, shelf life, food or pharmaceutical requirements and budget. Merova recommends a board grade against your application and confirms it on a sample before production." },
      { q: "Can you print to brand colour standards?", a: "Share your artwork and colour references with your enquiry. Colour targets, proofing and approval steps are agreed before production." },
    ],
  },
  {
    id: "foodservice",
    slug: "foodservice-packaging",
    name: "Foodservice & QSR Packaging",
    navName: "Foodservice & QSR",
    headline: "Foodservice packaging for cinemas, QSR, cafés and food brands.",
    intro:
      "Popcorn cones and tubs, nachos and fries trays, burger and pizza boxes, ice cream cups, beverage cups and takeaway packaging, specified for food contact and branded for the counter.",
    description:
      "Popcorn cones, popcorn tubs, nachos trays, French fries trays, burger boxes, food trays, ice cream cups, beverage cups, cup sleeves, pizza, sandwich, bakery and takeaway boxes.",
    technologies: [
      { name: "Food-contact board", text: "Food-grade paperboard and cup stock, specified for the food type, temperature and contact duration." },
      { name: "Barrier and coating", text: "Grease, moisture and liquid barriers (for example PE or aqueous coatings), selected for hot, cold, oily or wet foods." },
      { name: "Formed and folded formats", text: "Cups, cones, tubs, trays, clamshells and folding boxes produced to defined capacities and dimensions." },
      { name: "Brand print", text: "Branded print for multiplexes, QSR chains and food brands, with artwork proofed before production." },
    ],
    image: { src: "/assets/products/illustrations/popcorn-tub.svg", alt: "Illustration of a printed paper popcorn tub", kind: "illustration" },
    seo: {
      primary: "foodservice packaging",
      secondary: ["QSR packaging", "popcorn packaging", "paper cups", "food trays", "multiplex packaging"],
      title: "Foodservice & QSR Packaging | Popcorn, Cups, Trays | Merova Printpack",
      description: "Popcorn cones and tubs, nachos and fries trays, ice cream cups, beverage cups, burger, pizza and takeaway boxes for cinemas, QSR and food brands. Request a quote.",
    },
    faqs: [
      { q: "Are your foodservice products suitable for direct food contact?", a: "Foodservice products are specified with food-contact materials for the intended food and temperature. The applicable food-contact documentation for each material is confirmed and shared at quotation — tell us the food type, temperature and market when you enquire." },
      { q: "Can you supply a complete multiplex concession range?", a: "Popcorn cones and tubs, nachos trays, fries trays, beverage cups and ice cream cups can be quoted together so the range shares one print standard. Share your item list and volumes in a single enquiry." },
      { q: "Do you offer custom sizes?", a: "Capacities and dimensions are specified per order. Tell us the portion size or existing pack dimensions and the team will confirm what can be produced." },
    ],
  },
  {
    id: "flexible",
    slug: "plastic-packaging",
    name: "Plastic & Flexible Packaging",
    navName: "Plastic & Flexible",
    headline: "Films, pouches and bags — the right polymer for the job, including compostable options.",
    intro:
      "BOPP rolls, LDPE pouches and films, POF shrink, PVC cling, laminated and barrier films, custom pouches and certified-compostable alternatives, specified by material, micron and format.",
    description:
      "Compostable bags, compostable shrink and cling films, PVC cling film, BOPP rolls, LDPE pouches and films, POF shrink film, laminated rolls, barrier films and custom pouches.",
    technologies: [
      { name: "BOPP", text: "Biaxially oriented polypropylene — clear, stiff, high-gloss film for wrapping, lamination, labels and tapes." },
      { name: "LDPE", text: "Low-density polyethylene — flexible, tough and heat-sealable film for pouches, liners and bags." },
      { name: "POF and PVC", text: "Polyolefin shrink film for retail shrink-wrapping, and PVC cling film for food wrapping and catering use." },
      { name: "Laminates and barrier films", text: "Multi-layer structures combining films (and sometimes foil or metallised layers) to control oxygen, moisture and light." },
      { name: "Compostable films", text: "Films made from compostable polymers. Claims are made only against a stated standard and certificate for the specific grade." },
    ],
    image: { src: "/assets/products/illustrations/film-roll-clear.svg", alt: "Illustration of a roll of clear packaging film", kind: "illustration" },
    seo: {
      primary: "flexible packaging",
      secondary: ["BOPP rolls", "LDPE pouches", "POF shrink film", "PVC cling film", "compostable bags"],
      title: "Plastic & Flexible Packaging | BOPP, LDPE, POF, PVC | Merova Printpack",
      description: "BOPP rolls, LDPE pouches and films, POF shrink, PVC cling, laminated and barrier films, custom pouches and compostable alternatives. Request a quote.",
    },
    faqs: [
      { q: "What does micron mean for packaging film?", a: "A micron (µm) is one-thousandth of a millimetre and describes film thickness. Thicker film is generally stronger and stiffer but uses more material; the right micron depends on the product, the machine and the protection needed." },
      { q: "Are compostable films the same as biodegradable films?", a: "No. 'Compostable' means the material breaks down under defined composting conditions within a defined time, verified against a standard (such as EN 13432 or ASTM D6400 for industrial composting). 'Biodegradable' on its own has no defined timeframe or conditions. Merova states compostability only with the certificate for the specific grade." },
      { q: "Can you print on films and pouches?", a: "Printed films and pouches can be specified. The print process, number of colours and minimum quantities are confirmed at quotation." },
    ],
  },
  {
    id: "custom",
    slug: "custom-packaging",
    name: "Custom & Specialised Packaging",
    navName: "Custom & Specialised",
    headline: "When nothing standard fits, we start from your product.",
    intro:
      "Bespoke structures, mixed-material packs and unusual requirements — from a drawing, a photograph or a sample. Merova assesses the application and develops the right pack through sampling.",
    description:
      "Bespoke structural packaging, sustainable material alternatives and specialised packaging developed from your specifications, drawings or samples.",
    technologies: [
      { name: "Structural design", text: "Dielines developed around the product's dimensions, weight, fragility and the way it is packed and used." },
      { name: "Sampling", text: "Physical samples made for fit and handling checks before production is committed." },
      { name: "Material selection", text: "Corrugated, paperboard and flexible materials combined where one material cannot meet every requirement." },
      { name: "Validation", text: "Fit, drop and compression checks agreed against the application, with results recorded on the sample approval." },
    ],
    image: { src: "/assets/products/bespoke-dielines.webp", alt: "Bespoke carton prototypes with dielines, a ruler and vernier calipers on a cutting mat", kind: "representative" },
    seo: {
      primary: "custom packaging",
      secondary: ["custom packaging manufacturer", "bespoke packaging", "custom boxes", "packaging development"],
      title: "Custom Packaging Development | Bespoke Boxes & Structures | Merova Printpack",
      description: "Bespoke packaging developed from your drawings, photographs or samples — structural design, sampling and material selection. Discuss your custom requirement.",
    },
    faqs: [
      { q: "What should I send to start a custom packaging project?", a: "Whatever you have: product dimensions and weight, photographs, drawings or dielines, an existing sample, target quantities and how the product is shipped and sold. The more context, the faster the first proposal." },
      { q: "Do you make samples before production?", a: "Yes, sampling is part of the development process so fit and handling can be checked before a production run is committed. Sampling terms are confirmed with each project." },
      { q: "Is my design information kept confidential?", a: "Enquiry information is used only to assess and respond to your requirement. If you need a formal non-disclosure agreement, mention it in your enquiry." },
    ],
  },
];

export const verticalById = Object.fromEntries(verticals.map((v) => [v.id, v])) as Record<Vertical["id"], Vertical>;
export const verticalBySlug = (slug: string) => verticals.find((v) => v.slug === slug);
