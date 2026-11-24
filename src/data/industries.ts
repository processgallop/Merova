import type { Industry } from "./types";

export const industries: Industry[] = [
  {
    id: "pharmaceutical",
    image: "/assets/products/renders/pharma-carton.webp",
    slug: "pharmaceutical-packaging",
    name: "Pharmaceuticals & Healthcare",
    shortName: "Pharma & Healthcare",
    headline: "Packaging for medicines and healthcare products, where accuracy is not optional.",
    intro:
      "Medicine cartons, secondary packaging, protective shipping boxes, inserts and partitions for pharmaceutical, nutraceutical and healthcare products — specified for legibility, consistency and safe distribution.",
    challenges: [
      { title: "Text accuracy and legibility", text: "Cartons carry regulated information. Artwork control and proof approval matter as much as the board." },
      { title: "Consistency across batches", text: "Dimensions, print and construction must stay consistent so cartons run reliably on packing lines." },
      { title: "Protection in distribution", text: "Bottles, vials and devices need partitions, inserts and outer cases that prevent breakage and movement." },
    ],
    considerations: ["Board grade and print legibility", "Space for batch coding and variable data", "Tamper-evident features where required", "Inserts and partitions for fragile primary packs", "Outer shipper strength for distribution"],
    featured: ["pharmaceutical-cartons", "mono-cartons", "folding-cartons", "partitions-inserts", "3-ply-boxes", "5-ply-boxes", "protective-packaging", "ldpe-pouches"],
    icon: "Pill",
    faqs: [
      { q: "Do you supply pharmaceutical cartons with leaflet space?", a: "Carton dimensions are specified around your primary pack and any patient information leaflet. Share the product and leaflet dimensions with your enquiry." },
      { q: "Do you hold pharmaceutical packaging certifications?", a: "Merova lists only certifications that are current and verifiable. Please ask the team for current certification status and documentation relevant to your requirement." },
    ],
    seo: {
      primary: "pharmaceutical packaging",
      secondary: ["pharma cartons", "medicine boxes", "healthcare packaging", "pharmaceutical mono cartons"],
      title: "Pharmaceutical Packaging | Medicine Cartons & Shippers | Merova Printpack",
      description: "Pharmaceutical cartons, mono cartons, inserts, partitions and protective shipping boxes for medicines and healthcare products. Request a quote.",
    },
  },
  {
    id: "automotive",
    image: "/assets/products/renders/heavy-duty.webp",
    slug: "automotive-packaging",
    name: "Automotive & Auto Components",
    shortName: "Automotive",
    headline: "Transit packaging that keeps auto components clean, separated and undamaged.",
    intro:
      "Heavy-duty corrugated boxes, export cartons, component trays, partitions and protective inserts for auto components moving between suppliers, plants and aftermarket channels.",
    challenges: [
      { title: "Heavy and irregular parts", text: "Dense, oily or awkwardly shaped components need strong board and the right internal fitments." },
      { title: "Surface protection", text: "Machined and painted surfaces must not rub or scratch in transit." },
      { title: "Line-side handling", text: "Packs must be easy to open, count and unpack at the assembly line." },
    ],
    considerations: ["5-ply or 7-ply construction for weight", "Partitions and trays to separate parts", "Protective inserts for finished surfaces", "Export-ready cartons for long routes", "Clear labelling areas for part identification"],
    featured: ["heavy-duty-cartons", "7-ply-boxes", "5-ply-boxes", "export-cartons", "corrugated-trays", "partitions-inserts", "protective-packaging", "ldpe-film", "ldpe-pouches"],
    icon: "Car",
    faqs: [
      { q: "Can you design partitions around our component?", a: "Yes. Share the component drawing or a sample, the quantity per box and the target box weight. Partition layouts are developed and checked on a sample." },
      { q: "Do you make returnable packaging?", a: "Corrugated packaging is generally single or limited-trip. If you need multi-trip packaging, describe the cycle in your enquiry so the team can advise on suitable options." },
    ],
    seo: {
      primary: "automotive packaging",
      secondary: ["auto component packaging", "heavy duty corrugated boxes", "export cartons", "corrugated partitions"],
      title: "Automotive Packaging | Auto Component Boxes & Partitions | Merova Printpack",
      description: "Heavy-duty corrugated boxes, export cartons, trays, partitions and protective inserts for auto components. Request a quote.",
    },
  },
  {
    id: "food-beverage",
    image: "/assets/products/renders/takeaway-box.webp",
    slug: "food-packaging",
    name: "Food & Beverage",
    shortName: "Food & Beverage",
    headline: "Food and beverage packaging specified for contact, freshness and the shelf.",
    intro:
      "Food cartons, beverage and ice cream cups, takeaway and delivery boxes, trays, food-grade films and shipping cases for food manufacturers, restaurants and beverage brands.",
    challenges: [
      { title: "Food contact", text: "Materials must suit the food, its temperature and how long it stays in the pack." },
      { title: "Grease and moisture", text: "Oily, wet or frozen foods need appropriate barriers so the pack stays strong and clean." },
      { title: "Shelf and counter appeal", text: "Packaging is often the first brand touchpoint — print quality and structure both matter." },
    ],
    considerations: ["Food-contact material documentation", "Grease, moisture and temperature resistance", "Portion sizes and capacities", "Print and brand consistency", "Secondary and transit packaging strength"],
    featured: ["food-cartons", "beverage-cups", "ice-cream-cups", "takeaway-boxes", "food-trays", "bakery-boxes", "pizza-boxes", "pvc-cling-film", "laminated-rolls", "corrugated-trays"],
    icon: "UtensilsCrossed",
    faqs: [
      { q: "Which documents do I get for food-contact packaging?", a: "The applicable food-contact documentation depends on the material and market. It is confirmed per material at quotation — tell us the food type and where it will be sold." },
      { q: "Can you supply both primary and transit packaging?", a: "Primary formats (cartons, cups, trays, films) and transit formats (corrugated shippers and trays) can be quoted together in one enquiry." },
    ],
    seo: {
      primary: "food packaging",
      secondary: ["food packaging manufacturer", "food cartons", "beverage cups", "takeaway boxes", "food grade packaging"],
      title: "Food & Beverage Packaging | Cartons, Cups, Trays | Merova Printpack",
      description: "Food cartons, beverage and ice cream cups, takeaway boxes, trays and food-grade films for food and beverage businesses. Request a quote.",
    },
  },
  {
    id: "retail",
    image: "/assets/products/renders/display-unit.webp",
    slug: "retail-packaging",
    name: "Retail & Consumer Goods",
    shortName: "Retail",
    headline: "Retail packaging that sells on the shelf and unpacks fast in store.",
    intro:
      "Printed cartons, display boxes, shelf-ready packaging, promotional packaging and branded sleeves for consumer brands and retailers.",
    challenges: [
      { title: "Standing out on shelf", text: "Structure, print and finish have to work together at a glance." },
      { title: "Store labour", text: "Shelf-ready packs that open in one move save time at replenishment." },
      { title: "Promotions", text: "Displays and sleeves must be produced on short timelines without losing quality." },
    ],
    considerations: ["Print quality and colour consistency", "Shelf-ready opening features", "Display stability and assembly", "Window and sleeve options", "Transit strength to store"],
    featured: ["folding-cartons", "retail-ready-packaging", "display-packaging", "window-cartons", "sleeves", "gift-boxes", "pof-shrink-film", "die-cut-boxes"],
    icon: "Store",
    faqs: [
      { q: "What is shelf-ready packaging?", a: "Shelf-ready (or retail-ready) packaging is a case that ships the product and then opens — usually along a perforation — into a tray that goes straight onto the shelf, reducing handling in store." },
      { q: "Can you produce promotional display units?", a: "Counter and floor display formats can be specified. Share the product, the number of units to display and the campaign timeline." },
    ],
    seo: {
      primary: "retail packaging",
      secondary: ["shelf ready packaging", "display boxes", "printed retail cartons", "branded sleeves"],
      title: "Retail Packaging | Printed Cartons, SRP & Displays | Merova Printpack",
      description: "Printed retail cartons, shelf-ready packaging, display boxes and branded sleeves for consumer brands and retailers. Request a quote.",
    },
  },
  {
    id: "gifts-premium",
    image: "/assets/products/renders/gift-box.webp",
    slug: "gift-packaging",
    name: "Gifts & Premium Packaging",
    shortName: "Gifts & Premium",
    headline: "Presentation packaging that makes the opening part of the gift.",
    intro:
      "Gift boxes, premium presentation boxes, sleeves, inserts and printed cartons for corporate gifting, festive hampers and premium consumer products.",
    challenges: [
      { title: "Perceived value", text: "Board, finish and fit communicate quality before the product is seen." },
      { title: "Seasonal timelines", text: "Festive and corporate gifting runs to fixed dates." },
      { title: "Fit and presentation", text: "Inserts must hold mixed items neatly and securely." },
    ],
    considerations: ["Rigid versus folding construction", "Finishes such as lamination, foil and emboss", "Custom inserts for mixed contents", "Sleeves and wraps", "Transit outers to protect finished gift packs"],
    featured: ["gift-boxes", "rigid-boxes", "sleeves", "window-cartons", "folding-cartons", "partitions-inserts", "printed-paper-packaging", "e-commerce-boxes"],
    icon: "Gift",
    faqs: [
      { q: "Do you make rigid gift boxes?", a: "Rigid box capability is subject to confirmation for each project. Share the size, quantity and finish you have in mind and the team will confirm the available options." },
      { q: "How early should we plan festive packaging?", a: "As early as possible. Development, sampling, approvals and production all take time — share your delivery date with your enquiry so the team can confirm a realistic schedule." },
    ],
    seo: {
      primary: "gift packaging",
      secondary: ["gift boxes manufacturer", "premium packaging", "corporate gift boxes", "rigid boxes"],
      title: "Gift & Premium Packaging | Gift Boxes & Presentation Boxes | Merova Printpack",
      description: "Gift boxes, premium presentation boxes, sleeves and inserts for corporate gifting and premium products. Request a quote.",
    },
  },
  {
    id: "industrial",
    image: "/assets/products/renders/export-carton.webp",
    slug: "industrial-packaging",
    name: "Manufacturing & Industrial",
    shortName: "Industrial",
    headline: "Industrial packaging built for weight, stacking and long storage.",
    intro:
      "Industrial corrugated boxes, transit packaging, component packaging, heavy-duty cases and protective packaging for manufacturers and engineering businesses.",
    challenges: [
      { title: "Load and stacking", text: "Boxes must hold their shape under heavy loads and tall pallet stacks." },
      { title: "Storage conditions", text: "Humidity and long storage reduce board strength over time." },
      { title: "Handling damage", text: "Forklifts, conveyors and manual handling all test the pack." },
    ],
    considerations: ["Board grade and ply for compression strength", "Edge and corner protection", "Internal partitions and fitments", "Shrink and stretch wrapping for unitising", "Labelling and traceability areas"],
    featured: ["heavy-duty-cartons", "7-ply-boxes", "5-ply-boxes", "rsc-boxes", "export-cartons", "protective-packaging", "partitions-inserts", "ldpe-film", "pof-shrink-film"],
    icon: "Factory",
    faqs: [
      { q: "How do I know what box strength I need?", a: "Share the product weight, box dimensions, stacking height and storage conditions. Box construction is recommended against those inputs and verified on a sample where needed." },
      { q: "Can you supply large-format boxes?", a: "Maximum box sizes depend on board and process. Share your dimensions with your enquiry and the team will confirm feasibility." },
    ],
    seo: {
      primary: "industrial packaging",
      secondary: ["industrial corrugated boxes", "heavy duty boxes", "transit packaging", "industrial cartons"],
      title: "Industrial Packaging | Heavy-Duty & Transit Boxes | Merova Printpack",
      description: "Industrial corrugated boxes, heavy-duty cartons, transit and protective packaging for manufacturers. Request a quote.",
    },
  },
  {
    id: "ecommerce",
    image: "/assets/products/renders/ecommerce-mailer.webp",
    slug: "ecommerce-packaging",
    name: "E-commerce & Logistics",
    shortName: "E-commerce",
    headline: "E-commerce packaging that survives the parcel network and arrives on-brand.",
    intro:
      "E-commerce boxes, mailers, shipping cartons, protective inserts and polybags for online brands, marketplaces and logistics operations.",
    challenges: [
      { title: "Parcel handling", text: "Single parcels are dropped, tumbled and stacked in mixed loads." },
      { title: "Dimensional weight", text: "Oversized boxes cost more to ship and need more void fill." },
      { title: "Unboxing and returns", text: "Packs must open neatly, present the brand and, ideally, support returns." },
    ],
    considerations: ["Right-sized boxes to reduce void", "Self-locking and tear-strip options", "Protective inserts for fragile items", "Branded print inside or outside", "Polybags and pouches for soft goods"],
    featured: ["e-commerce-boxes", "3-ply-boxes", "die-cut-boxes", "rsc-boxes", "protective-packaging", "partitions-inserts", "ldpe-pouches", "compostable-bags"],
    icon: "Truck",
    faqs: [
      { q: "Can boxes be printed on the inside?", a: "Inside print can be specified for some formats. Mention it in your enquiry with your artwork." },
      { q: "How can I reduce shipping costs with packaging?", a: "Right-sizing boxes to the product, reducing void fill and choosing the lightest construction that still protects the product usually help. The team can review your current packs." },
    ],
    seo: {
      primary: "ecommerce packaging",
      secondary: ["e-commerce boxes", "shipping boxes", "mailer boxes", "courier bags"],
      title: "E-commerce Packaging | Mailer & Shipping Boxes | Merova Printpack",
      description: "E-commerce boxes, mailers, shipping cartons, protective inserts and polybags for online brands and logistics. Request a quote.",
    },
  },
  {
    id: "cinema",
    image: "/assets/products/renders/popcorn-tub.webp",
    slug: "cinema-multiplex-packaging",
    name: "Multiplexes & Cinemas",
    shortName: "Multiplexes",
    headline: "Concession packaging for multiplexes — one range, one print standard.",
    intro:
      "Popcorn cones, popcorn tubs, nachos trays, French fries trays, beverage cups and ice cream cups for cinema concessions, designed to work together at the counter.",
    challenges: [
      { title: "High-volume service", text: "Packs must nest, dispense and fill quickly during interval rushes." },
      { title: "Grease and heat", text: "Buttered popcorn, cheese sauce and hot snacks test board and coatings." },
      { title: "Brand and promotions", text: "Concession packs are a brand surface for the cinema and for film promotions." },
    ],
    considerations: ["Food-contact board and coatings", "Capacity ladder across combo sizes", "Nesting and stacking for counter storage", "Consistent print across the full range", "Promotional and seasonal designs"],
    featured: ["popcorn-cones", "popcorn-tubs", "nachos-trays", "french-fries-trays", "beverage-cups", "ice-cream-cups", "cup-sleeves", "burger-boxes", "custom-qsr-packaging"],
    icon: "Clapperboard",
    faqs: [
      { q: "Can you match our existing popcorn tub sizes?", a: "Share the current capacities or dimensions (or a sample) and the team will confirm what can be produced." },
      { q: "Can promotional designs be produced for a film release?", a: "Promotional print can be specified. Share the artwork deadline and launch date so the schedule can be confirmed." },
    ],
    seo: {
      primary: "multiplex packaging",
      secondary: ["popcorn packaging", "cinema concession packaging", "popcorn tubs", "nachos trays"],
      title: "Multiplex & Cinema Packaging | Popcorn Tubs, Cones, Cups | Merova Printpack",
      description: "Popcorn cones and tubs, nachos trays, fries trays, beverage cups and ice cream cups for cinema concessions. Request a quote.",
    },
  },
  {
    id: "fmcg",
    image: "/assets/products/renders/laminate-roll.webp",
    slug: "fmcg-packaging",
    name: "FMCG & Consumer Packaging",
    shortName: "FMCG",
    headline: "FMCG packaging that keeps pace with high-volume lines.",
    intro:
      "BOPP rolls, LDPE pouches, POF shrink, PVC cling, flexible films, cartons and shipping cases for fast-moving consumer goods — with compostable alternatives where suitable.",
    challenges: [
      { title: "Machine performance", text: "Films and cartons must run consistently on high-speed packing lines." },
      { title: "Shelf presence", text: "Packs must look consistent across very large volumes and repeat runs." },
      { title: "Material choice", text: "Brands are balancing protection, cost and end-of-life outcomes." },
    ],
    considerations: ["Film type and micron for the machine", "Seal strength and barrier needs", "Print consistency across repeats", "Shrink and bundling formats", "Compostable or recyclable alternatives"],
    featured: ["bopp-rolls", "ldpe-pouches", "pof-shrink-film", "pvc-cling-film", "laminated-rolls", "custom-pouches", "compostable-bags", "folding-cartons", "rsc-boxes"],
    icon: "ShoppingBasket",
    faqs: [
      { q: "Which film should I use for shrink bundling retail packs?", a: "POF shrink film is widely used for retail shrink-wrapping because of its clarity and strength. The right choice depends on your machine, product and display requirements." },
      { q: "Do you offer compostable alternatives?", a: "Compostable bags and films are available as options. Compostability is stated only with the certificate for the specific grade — ask for documentation with your quote." },
    ],
    seo: {
      primary: "FMCG packaging",
      secondary: ["BOPP rolls", "LDPE pouches", "POF shrink film", "consumer packaging"],
      title: "FMCG Packaging | Films, Pouches, Shrink & Cartons | Merova Printpack",
      description: "BOPP rolls, LDPE pouches, POF shrink, PVC cling, flexible films and cartons for FMCG brands, with compostable options. Request a quote.",
    },
  },
  {
    id: "electronics",
    image: "/assets/products/protective-inserts.webp",
    slug: "electronics-packaging",
    name: "Electronics & Appliances",
    shortName: "Electronics",
    headline: "Protective packaging for electronics and appliances, from component to finished unit.",
    intro:
      "Corrugated boxes, protective inserts, partitions, printed cartons and protective films for consumer electronics, appliances and electronic components.",
    challenges: [
      { title: "Drop and impact", text: "High-value products need fitments that hold them still and absorb shock." },
      { title: "Presentation", text: "Retail electronics packaging must look premium on shelf and at unboxing." },
      { title: "Component handling", text: "Components and sub-assemblies need separation and clean handling." },
    ],
    considerations: ["Fitments and inserts for immobilisation", "Box construction for product weight", "Retail print and finish", "Partitions for components", "Protective films and pouches"],
    featured: ["protective-packaging", "partitions-inserts", "5-ply-boxes", "die-cut-boxes", "folding-cartons", "e-commerce-boxes", "ldpe-pouches", "ldpe-film"],
    icon: "Cpu",
    faqs: [
      { q: "Do you supply anti-static packaging?", a: "Anti-static requirements need specific materials. Describe your requirement in your enquiry and the team will confirm what can be supplied." },
      { q: "Can corrugated inserts replace foam?", a: "In many applications corrugated or paperboard fitments can replace foam. Feasibility depends on product weight and fragility and is checked on a sample." },
    ],
    seo: {
      primary: "electronics packaging",
      secondary: ["appliance packaging", "protective packaging", "corrugated inserts", "electronics boxes"],
      title: "Electronics & Appliance Packaging | Protective Boxes & Inserts | Merova Printpack",
      description: "Corrugated boxes, protective inserts, partitions and printed cartons for electronics and appliances. Request a quote.",
    },
  },
];

export const industryById = Object.fromEntries(industries.map((i) => [i.id, i])) as Record<Industry["id"], Industry>;
export const industryBySlug = (slug: string) => industries.find((i) => i.slug === slug);
