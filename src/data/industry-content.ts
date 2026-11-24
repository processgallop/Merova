import type { Faq } from "./catalog";

type N = { title: string; text: string };
export const INDUSTRY_CONTENT: Record<string, { headline: string; intro: string; needs: N[]; faqs: Faq[] }> = {
  "food-beverage": {
    headline: "Packaging that performs at every point of service.",
    intro: "From the sweet counter to the cinema concession and the delivery rider, food packaging has to hold heat and grease, look like the brand and arrive intact. Choose your business to see what it uses, by material.",
    needs: [{ title: "Food contact", text: "Board, coatings and films specified for the food, with documentation per material." }, { title: "Service speed", text: "Formats that open, fill and close fast at peak hours." }, { title: "Delivery", text: "Containers and outer cartons that survive the ride without leaks." }, { title: "Brand on every serve", text: "Cups, tubs, bags and wraps printed in brand colours." }],
    faqs: [{ q: "Can you supply everything a food outlet needs in one order?", a: "Yes. Add products from any category to one enquiry and we will quote them together." }, { q: "Do you supply compostable alternatives?", a: "Yes, for most formats. Each compostable product is published with its certification." }],
  },
  "pharma-healthcare": {
    headline: "Accurate cartons, leaflets and shippers for healthcare.",
    intro: "Healthcare packaging carries regulated text and must be consistent run after run. We supply secondary and tertiary packaging (cartons, leaflets, labels and shippers) with controlled artwork and dimensions.",
    needs: [{ title: "Artwork control", text: "Every SKU proofed and approved before production." }, { title: "Line performance", text: "Consistent dimensions for automatic cartoners." }, { title: "Coding space", text: "Unvarnished panels for batch, expiry and MRP." }],
    faqs: [{ q: "Do you supply primary or sterile packaging?", a: "No. Validated primary and sterile barrier packaging is outside our scope. We supply cartons, leaflets, labels and transit packaging." }],
  },
  retail: {
    headline: "Make the first impression count.",
    intro: "Retail packaging is the brand in the customer's hand. Cartons, rigid boxes, bags and labels are specified together so every touchpoint looks like one brand.",
    needs: [{ title: "Shelf impact", text: "Print and finish that stand out at arm's length." }, { title: "Unboxing", text: "Rigid boxes and inserts that make opening part of the product." }, { title: "Consistency", text: "Colour matched across cartons, bags and labels." }],
    faqs: [{ q: "Can you match our brand colours?", a: "Yes. Share Pantone references or a physical standard; colour is approved on a proof." }],
  },
  "ecommerce-logistics": {
    headline: "Packaging that survives the network and still delights.",
    intro: "E-commerce and logistics packaging must protect against drops and compression, fit courier size bands and, for D2C brands, deliver a good unboxing.",
    needs: [{ title: "Protection", text: "Mailers, shippers, inserts and bubble film specified to the product." }, { title: "Right-sizing", text: "Box sizes that cut volumetric weight and void fill." }, { title: "Tamper evidence", text: "Courier bags with permanent seals." }],
    faqs: [{ q: "Can you help reduce damage in transit?", a: "Yes. Share the product, current pack and damage pattern; we propose a construction and sample it." }],
  },
  "automotive-industrial": {
    headline: "Strength that moves business forward.",
    intro: "Industrial packaging protects heavy, precise and high-value parts through storage, inter-plant transport and export.",
    needs: [{ title: "Load and stacking", text: "5- and 7-ply constructions specified to weight and stack height." }, { title: "Part separation", text: "Partitions and inserts that stop parts touching." }, { title: "Export", text: "Moisture-resistant, marked cartons for long transit." }],
    faqs: [{ q: "Do you supply returnable packaging?", a: "Our range is single-trip corrugated and film. Heavy-duty corrugated can be specified for limited re-use." }],
  },
  "corporate-publishing": {
    headline: "Print that represents the company well.",
    intro: "Brochures, catalogues, company profiles, flyers and premium bags for corporates, agencies, publishers and events.",
    needs: [{ title: "Quality", text: "Paper, binding and finish matched to the brand." }, { title: "Deadlines", text: "Event and launch dates planned backwards from delivery." }],
    faqs: [{ q: "What file format do you need?", a: "Print-ready PDF with 3 mm bleed and fonts embedded." }],
  },
  hospitality: {
    headline: "Packaging for hotels, caterers and banquets.",
    intro: "Laundry and garbage bags, cling film, catering containers and compostable tableware for hospitality operations.",
    needs: [{ title: "Back of house", text: "Cling film, bin liners and laundry bags in bulk." }, { title: "Events", text: "Compostable trays, plates and cutlery for banquets." }],
    faqs: [{ q: "Can you supply monthly?", a: "Yes. Regular call-off schedules can be agreed after the first order." }],
  },
  gifting: {
    headline: "Gift packaging for festivals, clients and celebrations.",
    intro: "Hamper boxes, rigid boxes, premium bags and sweet boxes for Diwali, weddings and corporate gifting, delivered on time for the date that matters.",
    needs: [{ title: "Season planning", text: "Festive capacity books early; approve artwork 6–8 weeks ahead." }, { title: "Presentation", text: "Foil, emboss and inserts that lift perceived value." }],
    faqs: [{ q: "What is the minimum order for hamper boxes?", a: "Indicatively 500 hampers; confirmed at quotation." }],
  },
  "agri-horticulture": {
    headline: "Packaging for nurseries and produce.",
    intro: "Compostable nursery bags and corrugated produce trays for growers and nurseries.",
    needs: [{ title: "Planting", text: "Compostable grow bags that go into the ground." }, { title: "Produce", text: "Ventilated corrugated trays and boxes." }],
    faqs: [{ q: "How long does a compostable nursery bag last in the field?", a: "Field life depends on the grade and climate; it is agreed per order." }],
  },
};

const pt = (title: string, text: string) => ({ title, text });
export const OPERATOR_CONTENT: Record<string, { headline: string; intro: string; points: N[]; faqs: Faq[] }> = {
  "sweet-shops": { headline: "Packaging for sweet shops and mithai stores.", intro: "Daily counter boxes, festive gift packs, butter paper, carry bags and seals, all in one enquiry. Sweet boxes are sealed with paper stickers, as plastic films around sweet boxes are prohibited in India.", points: [pt("Counter", "Sweet boxes by weight, butter paper liners and seal stickers."), pt("Festive gifting", "Premium printed and rigid boxes, hampers and premium bags."), pt("Delivery and bulk", "Food bags, containers and 3-ply outer cartons.")], faqs: [{ q: "When should we order for Diwali?", a: "Approve artwork 6–8 weeks before the festival to secure capacity." }] },
  bakeries: { headline: "Packaging for bakeries and patisseries.", intro: "Cake and pastry boxes, bread bags, butter and greaseproof paper and labels for bakeries.", points: [pt("Cakes", "Cake boxes from ½ kg to 2 kg with windows."), pt("Pastries", "Cavity boxes and cupcake inserts."), pt("Bread", "SOS bags and greaseproof wraps.")], faqs: [{ q: "Can cake boxes have a window?", a: "Yes, in PET or compostable film." }] },
  "multiplex-cinema": { headline: "Packaging for multiplex and cinema concessions.", intro: "Everything for the concessions counter: popcorn tubs and cones, nachos trays, fries cartons, cups and sleeves, with corrugated cartons for storage and distribution.", points: [pt("Concession counter", "Popcorn tubs and cones, nachos trays, fries cartons."), pt("Beverages", "Paper cups, sleeves and cup carriers."), pt("Storage", "3-ply and 5-ply cartons for back-of-house.")], faqs: [{ q: "Can you print film promotions on tubs?", a: "Yes. Promotional runs can be printed; minimums depend on format and print method." }] },
  "restaurants-cafes": { headline: "Packaging for restaurants and cafés.", intro: "Cups, bowls, takeaway boxes, bags and wraps for dine-in, takeaway and delivery, with compostable alternatives.", points: [pt("Beverages", "Hot and cold cups, sleeves, carriers."), pt("Takeaway", "Bowls, boxes, bags and wraps."), pt("Kitchen", "Cling film, butter and greaseproof paper.")], faqs: [{ q: "Do you have compostable options?", a: "Yes. Compostable containers, cups and cutlery are available, each with certification." }] },
  qsr: { headline: "Packaging for quick service restaurants.", intro: "Burger boxes, fries cartons, cups, trays, bags and wraps specified for speed at peak hours.", points: [pt("Assembly line", "Clamshells, fries cartons and wraps that close in a second."), pt("Beverages", "Cups, sleeves and carriers."), pt("Distribution", "Outer cartons for central kitchens.")], faqs: [{ q: "Can you hold stock for scheduled call-offs?", a: "Call-off arrangements can be discussed for regular volumes." }] },
  "ice-cream-desserts": { headline: "Packaging for ice cream and dessert businesses.", intro: "Ice cream cups and tubs, sleeves, labels and compostable spoons for parlours and dessert brands.", points: [pt("Scoops", "Single-serve cups with lids."), pt("Take-home", "Tubs from 250 ml to 1 L."), pt("Serving", "Compostable spoons and cups.")], faqs: [{ q: "Are your ice cream cups freezer-safe?", a: "Cups are PE-coated for frozen use; confirm the storage temperature with your enquiry." }] },
  "cloud-kitchens": { headline: "Packaging for cloud kitchens and food delivery.", intro: "Leak-resistant containers, takeaway boxes, bags and seal stickers built for the delivery ride.", points: [pt("Mains", "Paper bowls, plastic and compostable containers."), pt("Sides and dry items", "Takeaway boxes and food bags."), pt("Tamper evidence", "Seal stickers on every bag.")], faqs: [{ q: "Which container is best for curries?", a: "PP containers or PE-lined paper bowls with tight lids. Moulded fibre suits less liquid dishes." }] },
  "food-manufacturers": { headline: "Packaging for food manufacturers and processors.", intro: "Printed cartons, labels, BOPP and laminate films, shrink films and shipping cartons for packed foods.", points: [pt("Primary", "Laminated pouches, roll stock and BOPP."), pt("Secondary", "Printed cartons, shrink bundling and labels."), pt("Tertiary", "3- and 5-ply shippers, trays and stretch film.")], faqs: [{ q: "Can you run trials on our machines?", a: "Yes. Film samples can be provided for machine trials before the first order." }] },
  supermarkets: { headline: "Packaging for supermarkets and retail food stores.", intro: "Carry bags, labels, cling film and shelf-ready cartons for food retail.", points: [pt("Checkout", "Paper and compostable carry bags."), pt("Fresh counters", "Labels, cling film and containers."), pt("Shelf", "Retail-ready and display packaging.")], faqs: [{ q: "Can bags be printed with our store branding?", a: "Yes, in 1–4 colours." }] },
  "pharma-manufacturers": { headline: "Packaging for pharmaceutical manufacturers.", intro: "Mono cartons, leaflets, labels and shippers with controlled artwork and consistent dimensions. Primary and sterile packaging is outside our scope.", points: [pt("Cartons", "Mono cartons with coding panels and leaflet space."), pt("Information", "Package inserts and labels."), pt("Shipping", "Shippers with partitions.")], faqs: [{ q: "Can you add Braille?", a: "Braille embossing is available on enquiry." }] },
  "medical-devices": { headline: "Packaging for medical device businesses.", intro: "Cartons, rigid boxes, inserts and shippers for devices and kits, excluding sterile barrier packaging.", points: [pt("Presentation", "Cartons and rigid boxes with inserts."), pt("Protection", "Corrugated inserts and bubble film."), pt("Documentation", "Inserts and labels.")], faqs: [] },
  "apparel-footwear": { headline: "Packaging for apparel and footwear brands.", intro: "Shoe boxes, carry bags, mailers, courier bags and labels for stores and online orders.", points: [pt("Store", "Kraft and premium carry bags."), pt("Online", "Mailers and courier bags."), pt("Product", "Cartons, tags and labels.")], faqs: [] },
  jewellery: { headline: "Packaging for jewellery retailers.", intro: "Rigid boxes, premium bags and seals that match the value of the piece.", points: [pt("Boxes", "Rigid boxes with velvet or fabric inserts."), pt("Bags", "Laminated bags with rope handles."), pt("Seals", "Foiled stickers and seals.")], faqs: [] },
  "cosmetics-personal-care": { headline: "Packaging for cosmetics and personal care.", intro: "Cartons, labels, rigid gift sets and shelf-ready displays for beauty brands.", points: [pt("Shelf", "Printed mono and folding cartons."), pt("Gift sets", "Rigid boxes with inserts."), pt("Retail", "Counter displays.")], faqs: [] },
  "electronics-retail": { headline: "Packaging for electronics and appliances.", intro: "Cartons and rigid boxes for accessories, inserts and 5-ply shippers for appliances.", points: [pt("Retail box", "Folding and rigid boxes."), pt("Protection", "Corrugated inserts and bubble film."), pt("Shipping", "5-ply cartons and labels.")], faqs: [] },
  "department-lifestyle": { headline: "Packaging for department and lifestyle stores.", intro: "Branded carry bags, labels and stickers.", points: [], faqs: [] },
  "ecommerce-d2c": { headline: "Packaging for e-commerce, D2C brands and marketplace sellers.", intro: "Mailer boxes, courier bags, shipping labels and protective packaging that pass the courier network and look good on arrival.", points: [pt("Dispatch", "Mailers, shippers and courier bags."), pt("Protection", "Inserts and air bubble film."), pt("Brand moments", "Printed inserts and seal stickers.")], faqs: [{ q: "Which is cheaper to ship: a box or a courier bag?", a: "Courier bags are lighter and smaller, so they usually cost less to ship. Boxes protect better. Many brands use both by product type." }] },
  "fulfilment-3pl": { headline: "Packaging for fulfilment centres, 3PL and warehousing.", intro: "Shippers in standard sizes, stretch film, labels and courier bags in volume.", points: [pt("Packing benches", "Standard-size shippers and courier bags."), pt("Dispatch", "Shipping labels."), pt("Pallets", "Stretch film and sheets.")], faqs: [] },
  courier: { headline: "Packaging for courier businesses.", intro: "Courier bags, compostable mailers and labels.", points: [], faqs: [] },
  automotive: { headline: "Packaging for automotive manufacturers and component suppliers.", intro: "5- and 7-ply cartons, partitions, inserts and export packaging for parts moving between plants and overseas.", points: [pt("Inter-plant", "Heavy-duty cartons with partitions."), pt("Export", "Marked, moisture-resistant cartons."), pt("Identification", "Part and shipping labels.")], faqs: [{ q: "Can partitions be made to our part drawings?", a: "Yes. Share drawings or samples and we will design the cell layout." }] },
  "engineering-electrical": { headline: "Packaging for engineering and electrical equipment.", intro: "Heavy-duty corrugated, inserts, stretch film and labels for machinery, panels and components.", points: [pt("Heavy loads", "7-ply and export cartons."), pt("Protection", "Inserts and bubble film."), pt("Unitising", "Stretch film.")], faqs: [] },
  "spare-parts": { headline: "Packaging for spare-parts and industrial distributors.", intro: "RSC boxes, partitions, labels and LDPE bags.", points: [], faqs: [] },
  corporates: { headline: "Printing and packaging for corporates.", intro: "Company profiles, brochures, premium bags and gift boxes.", points: [pt("Literature", "Profiles, brochures and catalogues."), pt("Events", "Premium bags and gift boxes.")], faqs: [] },
  "agencies-events": { headline: "Print for marketing agencies and event organisers.", intro: "Brochures, flyers, stickers and premium bags delivered to the event date.", points: [pt("Campaigns", "Flyers, leaflets and inserts."), pt("Events", "Branded bags and gift boxes.")], faqs: [] },
  "publishers-education": { headline: "Print for publishers and educational institutions.", intro: "Brochures, prospectuses and leaflets.", points: [], faqs: [] },
  "hotels-catering": { headline: "Packaging for hotels, caterers and banquets.", intro: "Laundry and garbage bags, cling film, catering containers and compostable tableware.", points: [pt("Housekeeping", "Compostable laundry and garbage bags."), pt("Kitchen", "Cling film, butter paper and containers."), pt("Banquets", "Compostable trays, plates and cutlery.")], faqs: [] },
  gifting: { headline: "Packaging for corporate and festive gifting.", intro: "Hamper boxes, rigid boxes, premium bags and sweet boxes, delivered before the date that matters.", points: [pt("Hampers", "Partitioned boxes for mixed contents."), pt("Premium", "Rigid boxes and premium bags."), pt("Shipping", "Mailers and inserts for gifts sent by courier.")], faqs: [{ q: "Can each hamper carry a personalised message?", a: "Printed inserts and stickers can be personalised; discuss quantities with the team." }] },
  "nurseries-agri": { headline: "Packaging for nurseries and produce growers.", intro: "Compostable nursery bags and corrugated produce trays and boxes.", points: [pt("Nursery", "Compostable grow bags."), pt("Produce", "Corrugated trays and 3-ply boxes.")], faqs: [] },
  "pharma-distributors": { headline: "Packaging for pharmaceutical distributors.", intro: "Shippers, labels and stretch film.", points: [], faqs: [] },
  "hospitals-labs": { headline: "Packaging for hospitals and diagnostic laboratories.", intro: "Labels, LDPE bags and compostable bin liners.", points: [], faqs: [] },
  pharmacies: { headline: "Packaging for pharmacies.", intro: "Carry bags and labels.", points: [], faqs: [] },
};
