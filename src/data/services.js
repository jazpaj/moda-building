// Service page content. Order = priority order from the brief (roofing first everywhere).
// `formValue` must match an option in the lead form's "Service desired" dropdown.

module.exports = [
  {
    key: 'roofing',
    slug: 'roofing',
    name: 'Roofing',
    short: 'Roofing',
    formValue: 'Roofing',
    navLabel: 'Roofing',
    coverage: 'All of Metro Detroit',
    cityKeys: ['birmingham', 'royal-oak', 'bloomfield-hills', 'rochester-hills', 'west-bloomfield', 'beverly-hills', 'metro-detroit'],
    title: 'Roofing Contractor Metro Detroit | Roof Replacement | Moda Building',
    description: 'Metro Detroit roofing contractor for roof replacement, roof repair, storm and hail damage, insurance claims and gutters. Free roof inspection and written estimate.',
    keyword: 'roofing contractor Metro Detroit',
    h1: 'Roof replacement and repair across Metro Detroit',
    heroSub: 'Free inspection, a clear written quote and a crew that protects your landscaping and cleans up every nail. Most roofs are replaced in one or two days.',
    cardText: 'Replacement, repair, storm damage and insurance claims, gutters and free roof inspections.',
    intro: [
      'Michigan roofs work hard. Freeze–thaw cycles open small gaps, ice dams push water under shingles, and summer storms bring hail and high wind. Moda Building inspects, repairs and replaces roofs for homeowners from Birmingham and Bloomfield Hills to every corner of Metro Detroit.',
      'Every project starts with a photo-documented inspection so you can see exactly what we see. If the roof can be repaired, we say so. If it needs replacing, you get a line-item quote covering materials, ventilation, flashing and cleanup — no surprises after tear-off.'
    ],
    subservices: [
      {
        id: 'roof-replacement',
        title: 'Roof replacement',
        text: 'Full tear-off down to the deck, deck repairs as needed, ice-and-water shield at eaves and valleys, synthetic underlayment, new flashing and balanced ventilation. We finish with a magnetic sweep of your yard and driveway.',
        points: ['Complete tear-off — no layering over old shingles', 'Ice-and-water shield where Michigan code and common sense call for it', 'Manufacturer warranty registration handled for you']
      },
      {
        id: 'roof-repair',
        title: 'Roof repair',
        text: 'Missing shingles, lifted tabs, failed pipe boots, leaking chimney or skylight flashing — many leaks are a targeted repair, not a new roof. We find the source, fix it and photograph the result.',
        points: ['Leak tracing from attic and roof deck', 'Flashing, boot and vent replacement', 'Emergency tarping after storm damage']
      },
      {
        id: 'storm-damage',
        title: 'Storm and hail damage & insurance claims',
        text: 'After hail or high wind, damage is often invisible from the ground. We inspect, document every impact and creased shingle with dated photos, and meet your adjuster on-site so nothing is missed. You stay in control of your claim; we make sure the evidence is complete.',
        points: ['Dated, photo-documented damage report', 'On-site adjuster meetings', 'Repairs built to the approved scope']
      },
      {
        id: 'shingle-types',
        title: 'Shingle and roofing material options',
        text: 'Architectural asphalt is the Metro Detroit standard, but many homes in Birmingham and Bloomfield Hills call for designer shingles, synthetic slate or standing-seam metal accents. We help you weigh look, lifespan and budget.',
        points: []
      },
      {
        id: 'gutters',
        title: 'Gutters and downspouts',
        text: 'Seamless aluminum gutters sized for your roof area, properly pitched downspouts and optional guards. Good drainage protects your fascia, foundation and basement — which is why we look at it on every roof job.',
        points: ['Seamless 5" and 6" gutters', 'Downspout extensions away from the foundation', 'Gutter guards for tree-heavy lots']
      },
      {
        id: 'free-inspection',
        title: 'Free roof inspection',
        text: 'A no-pressure inspection of shingles, flashing, ventilation, gutters and attic. You receive photos and an honest recommendation — repair, replace or leave it alone for now.',
        points: []
      }
    ],
    materials: [
      { name: 'Architectural asphalt shingles', life: '25–30+ years', note: 'Dimensional look, strong wind ratings, best value. The most common choice in Metro Detroit.' },
      { name: 'Designer / luxury shingles', life: '30+ years', note: 'Heavier, sculpted profiles that imitate slate or shake — popular on upscale colonials and Tudors.' },
      { name: 'Synthetic slate & shake', life: '40–50 years', note: 'Composite products with the character of slate or cedar at a fraction of the weight and upkeep.' },
      { name: 'Standing-seam metal', life: '40–60 years', note: 'Clean, modern lines. Often used on porches, bays and modern builds, or for the full roof.' }
    ],
    costFactors: [
      'Roof size and pitch (steeper roofs need more labor and safety equipment)',
      'Number of layers to tear off and any deck boards that need replacing',
      'Material choice — architectural, designer, synthetic or metal',
      'Chimneys, skylights, valleys and dormers that need new flashing',
      'Ventilation upgrades and ice-and-water shield coverage',
      'Gutters, permits and access to the roof'
    ],
    priceRanges: [
      { label: 'Roof repair', range: '$450 – $2,500' },
      { label: 'Architectural shingle replacement (typical home)', range: '$12,000 – $30,000' },
      { label: 'Designer shingle or synthetic slate', range: '$25,000 – $60,000+' },
      { label: 'Seamless gutters', range: '$1,800 – $5,000' }
    ],
    faqs: [
      { q: 'How do I know if I need a roof repair or a full replacement?', a: 'Age, the extent of damage and how many leaks you have all matter. A roof under about 15 years old with isolated damage is usually a repair candidate. Widespread granule loss, curling, multiple leaks or a roof over 20 years old usually points to replacement. Our free inspection gives you photos and a straight answer.' },
      { q: 'How long does a roof replacement take?', a: 'Most single-family homes are torn off and re-roofed in one to two days. Larger or steeper roofs, or premium materials like synthetic slate, can take longer. We give you a schedule before we start.' },
      { q: 'Will my homeowners insurance pay for a new roof?', a: 'If the damage was caused by a covered event such as hail or wind, insurance often covers some or all of the replacement minus your deductible. Wear and age are not usually covered. We document the damage and meet your adjuster so the claim reflects what is actually on your roof.' },
      { q: 'Do you pull permits?', a: 'Yes. We pull the required building permit with your city or township and schedule any inspections.' },
      { q: 'What warranty do I get?', a: 'Every roof includes our workmanship warranty plus the shingle manufacturer’s warranty, which we register for you. Ask about extended system warranties when you choose a qualifying product line.' },
      { q: 'Can you replace a roof in winter?', a: 'Yes, within limits. Shingles need certain temperatures to seal, so we watch the forecast and use cold-weather installation methods. Emergency repairs and tarping happen year-round.' }
    ],
    crossSell: { to: 'basement-waterproofing', text: 'Water problems rarely stop at the roof line. Overflowing gutters and short downspouts are a leading cause of wet basements.', cta: 'See basement waterproofing' }
  },
  {
    key: 'basement-waterproofing',
    slug: 'basement-waterproofing',
    name: 'Basement Waterproofing',
    short: 'Waterproofing',
    formValue: 'Basement Waterproofing',
    navLabel: 'Waterproofing',
    coverage: 'All of Metro Detroit',
    cityKeys: ['birmingham', 'royal-oak', 'bloomfield-hills', 'rochester-hills', 'west-bloomfield', 'beverly-hills', 'metro-detroit'],
    title: 'Basement Waterproofing Metro Detroit | Moda Building',
    description: 'Basement waterproofing in Metro Detroit: leak and crack repair, interior drain tile, sump pumps, exterior waterproofing and foundation repair, backed by a written warranty.',
    keyword: 'basement waterproofing Metro Detroit',
    h1: 'Basement waterproofing that keeps Metro Detroit basements dry',
    heroSub: 'We find where the water is getting in, fix the cause, and back it with a written warranty — so your basement is ready to use, store or finish.',
    cardText: 'Leak and crack repair, interior drain tile, sump pumps, exterior waterproofing and foundation repair.',
    intro: [
      'Oakland County sits on dense clay soil that holds water against foundation walls. Add spring thaw, heavy rain and aging drain tile, and even well-built homes end up with damp walls, efflorescence or water on the floor.',
      'Moda Building diagnoses the source first — cracks, failed tile, hydrostatic pressure, grading or gutters — and recommends the least invasive fix that will actually last. And when your basement is dry, we can finish it.'
    ],
    subservices: [
      { id: 'leak-crack-repair', title: 'Leak and crack repair', text: 'Poured-wall cracks are sealed with injected epoxy or polyurethane from the inside, stopping water and restoring the wall. Block walls and cove joints need a different approach — we explain which applies to your home.', points: ['Injection repair for poured concrete', 'Cove-joint and floor-crack sealing', 'Window well and penetration leaks'] },
      { id: 'interior-drain-tile', title: 'Interior drain tile systems', text: 'A perforated drain installed along the inside perimeter, below the floor, relieves water pressure and carries it to a sump pump. It is the most reliable fix for chronic seepage at the wall–floor joint.', points: ['Perimeter drain below the slab', 'Wall membrane to direct seepage', 'Concrete restored and cleaned up'] },
      { id: 'sump-pumps', title: 'Sump pumps and backups', text: 'New and replacement pumps, sealed lids, battery or water-powered backups and alarms. A sump pump that fails during a storm is the most common cause of a flooded finished basement.', points: ['Primary pump replacement', 'Battery backup systems', 'High-water alarms'] },
      { id: 'exterior-waterproofing', title: 'Exterior waterproofing', text: 'When conditions call for it, we excavate to the footing, clean and repair the wall, apply a waterproofing membrane and drainage board, and install new exterior drain tile.', points: [] },
      { id: 'foundation-repair', title: 'Foundation repair', text: 'Bowing or cracked block walls, settling and shifting are stabilized with wall anchors, bracing or rebuilds, depending on severity.', points: [] },
      { id: 'warranty', title: 'Written warranty', text: 'Waterproofing work is backed by a written warranty that stays with the home — a real selling point if you move.', points: [] }
    ],
    materials: [
      { name: 'Crack injection', life: 'Permanent repair', note: 'Best for isolated cracks in poured concrete walls.' },
      { name: 'Interior drain tile + sump', life: 'Long-term system', note: 'Best for widespread seepage, block walls and wall–floor joint leaks.' },
      { name: 'Exterior membrane + drainage', life: 'Long-term system', note: 'Best when the wall itself must be protected from the outside, or with exterior access.' },
      { name: 'Sump pump with battery backup', life: '7–10 years (pump)', note: 'Essential for any home with drain tile — doubly so before finishing.' }
    ],
    costFactors: [
      'Wall type — poured concrete or concrete block',
      'Linear feet of drain tile needed',
      'Interior vs. exterior approach and access around the home',
      'Number and type of cracks',
      'Sump pump and backup system selection',
      'Finished walls or flooring that must be removed and replaced'
    ],
    priceRanges: [
      { label: 'Crack injection (per crack)', range: '$500 – $1,200' },
      { label: 'Sump pump replacement', range: '$900 – $2,500' },
      { label: 'Battery backup system', range: '$1,200 – $2,800' },
      { label: 'Interior drain tile (typical home)', range: '$8,000 – $20,000' },
      { label: 'Exterior waterproofing', range: '$15,000 – $40,000+' }
    ],
    faqs: [
      { q: 'Why does my basement leak only in spring?', a: 'Spring thaw and heavy rain saturate Michigan’s clay soil. The water pressure against your walls and under your floor peaks, pushing water through cracks and the joint where the wall meets the floor.' },
      { q: 'Interior or exterior waterproofing — which is better?', a: 'Both work when chosen for the right reason. Interior drain tile manages water that reaches the foundation and is less disruptive to landscaping. Exterior waterproofing stops water at the wall and is useful for bowing walls or when the basement is already finished. We explain the trade-offs for your home.' },
      { q: 'Is white powder on my basement walls a problem?', a: 'That powder is efflorescence: mineral deposits left behind as water evaporates through concrete. It means moisture is moving through the wall and is worth inspecting.' },
      { q: 'Do I need to waterproof before finishing my basement?', a: 'If you have any signs of water — staining, efflorescence, musty smells, past leaks — yes. Drywall, carpet and framing hide leaks until they become mold and expensive repairs. Dry it first, then finish it.' },
      { q: 'Is the warranty transferable?', a: 'Yes. Our written waterproofing warranty transfers to the next owner, which buyers and inspectors appreciate.' },
      { q: 'How long does an interior drain tile system take?', a: 'Most homes take two to four days, depending on the length of wall and the number of obstacles in the basement.' }
    ],
    crossSell: { to: 'finished-basements', text: 'Dry it, then finish it. Once your basement is waterproofed, it is the most cost-effective square footage you can add to your home.', cta: 'Explore finished basements' }
  },
  {
    key: 'finished-basements',
    slug: 'finished-basements',
    name: 'Finished Basements',
    short: 'Finished Basements',
    formValue: 'Finished Basement',
    navLabel: 'Finished Basements',
    coverage: 'Metro Detroit, focus on 4 target cities',
    cityKeys: ['birmingham', 'royal-oak', 'bloomfield-hills', 'rochester-hills'],
    title: 'Finished Basements Birmingham MI & Oakland County | Moda Building',
    description: 'Design-build basement finishing in Birmingham, Royal Oak, Bloomfield Hills and Rochester Hills: rec rooms, bars, theaters, guest suites, gyms, egress windows and bathrooms.',
    keyword: 'finished basements Birmingham MI',
    h1: 'Finished basements, designed and built as one project',
    heroSub: 'Rec rooms, wet bars, home theaters, guest suites and gyms — designed around how your family lives, built by one team from plan to final inspection.',
    cardText: 'Design-build basements: rec rooms, bars, theaters, guest suites, gyms, egress and bathrooms.',
    intro: [
      'A finished basement is often the largest, most affordable space you can add to a Metro Detroit home. Done well, it feels like a natural part of the house — warm, bright and quiet — not an afterthought below the stairs.',
      'Moda Building handles design and construction under one contract. We start by confirming the basement is dry, then plan layout, lighting, mechanicals and finishes before a single stud goes up.'
    ],
    subservices: [
      { id: 'design-build', title: 'Our design/build process', text: 'One team owns the whole project: a moisture check, a measured floor plan, 3D layout options, a fixed-scope proposal, permits, construction and final walkthrough. You make decisions once, with a clear picture of the result.', points: ['Moisture and code review before design', 'Floor plan and finish selections', 'Fixed-scope proposal and schedule'] },
      { id: 'layouts', title: 'Layouts and spaces', text: 'Most of our basements combine two or three of these zones around the structure you already have — posts, ductwork and the mechanical room.', points: ['Rec and family rooms', 'Wet bars and kitchenettes', 'Home theaters with sound control', 'Guest suites with full baths', 'Home gyms with rubber flooring', 'Offices and kids’ play areas'] },
      { id: 'egress-windows', title: 'Egress windows', text: 'Michigan’s residential code requires an emergency escape opening in basement sleeping rooms. A properly sized egress window and well also floods the space with daylight. We cut the foundation, install the window and well, and finish the interior.', points: [] },
      { id: 'bathrooms', title: 'Basement bathrooms', text: 'Full baths, half baths and steam showers, with below-floor plumbing or an up-flush system when the sewer line is above floor level.', points: [] },
      { id: 'cost-ranges', title: 'Cost ranges', text: 'Finished basements are priced by size and finish level. Bathrooms, bars, egress windows and theater systems are the biggest variables.', points: [] }
    ],
    materials: [
      { name: 'Insulated wall systems', life: 'Moisture-smart', note: 'Rigid foam against the foundation, then framing — warm, mold-resistant walls.' },
      { name: 'Luxury vinyl plank', life: 'Waterproof', note: 'The go-to basement floor: warm underfoot, waterproof, looks like wood.' },
      { name: 'Sound-control drywall & insulation', life: 'Quiet', note: 'Keeps theater and bar noise downstairs.' },
      { name: 'Recessed & layered lighting', life: 'Bright', note: 'Low-profile LED fixtures and dimmable zones make a basement feel like the main floor.' }
    ],
    costFactors: [
      'Square footage being finished',
      'Bathroom (half, full or none) and plumbing location',
      'Wet bar, kitchenette or built-in cabinetry',
      'Egress window cut-in',
      'Theater, audio and low-voltage wiring',
      'Ceiling height, soffits and relocating ductwork or posts'
    ],
    priceRanges: [
      { label: 'Basic finish (open rec room)', range: '$35,000 – $60,000' },
      { label: 'Mid-range with bathroom', range: '$60,000 – $100,000' },
      { label: 'High-end with bar, theater or suite', range: '$100,000 – $175,000+' },
      { label: 'Egress window installed', range: '$4,500 – $8,500' }
    ],
    faqs: [
      { q: 'How long does it take to finish a basement?', a: 'Design and permitting usually take three to six weeks. Construction typically runs eight to twelve weeks, depending on size, bathrooms and finish selections.' },
      { q: 'Do I need a permit to finish my basement?', a: 'Yes. Finishing a basement requires building, electrical, mechanical and often plumbing permits. We pull them and schedule every inspection.' },
      { q: 'Do I need an egress window?', a: 'If the basement will include a bedroom, Michigan’s residential code requires an emergency escape opening. Even without a bedroom, an egress window adds light and a second exit.' },
      { q: 'What if my basement has had water problems?', a: 'We fix the water first. Our team also handles basement waterproofing, so the dry-it-then-finish-it plan is one project with one warranty conversation.' },
      { q: 'Can you work around my furnace, posts and ductwork?', a: 'Yes. Good basement design hides or celebrates them — soffits, wrapped posts, built-ins and a tidy mechanical room with access for service.' },
      { q: 'Does a finished basement add value?', a: 'A well-built, permitted basement adds usable living space and appeal at resale. The return depends on your neighborhood and finish level; we design to suit both your family and your market.' }
    ],
    crossSell: { to: 'basement-waterproofing', text: 'Every great basement starts dry. If you have seen water, staining or a musty smell, we waterproof first — same team, one plan.', cta: 'Basement waterproofing' }
  },
  {
    key: 'renovations',
    slug: 'renovations',
    name: 'Full Home Renovations',
    short: 'Renovations',
    formValue: 'Full Renovation',
    navLabel: 'Renovations',
    coverage: '6 target cities',
    cityKeys: ['birmingham', 'royal-oak', 'bloomfield-hills', 'rochester-hills', 'west-bloomfield', 'beverly-hills'],
    title: 'Home Renovation Bloomfield Hills & Oakland County | Moda Building',
    description: 'Whole-home remodels, kitchens, bathrooms and additions in Bloomfield Hills, Birmingham, Royal Oak, Rochester Hills, West Bloomfield and Beverly Hills. Design-build, one team.',
    keyword: 'home renovation Bloomfield Hills',
    h1: 'Full home renovations with modern design at the center',
    heroSub: 'Whole-home remodels, kitchens, bathrooms and additions for Oakland County homes — one design-build team, one schedule, one point of contact.',
    cardText: 'Whole-home remodels, kitchens, bathrooms and additions with a clear design process.',
    intro: [
      'Much of Oakland County’s housing was built between the 1920s and 1990s: generous lots and good bones, often with closed-off kitchens, dated baths and floor plans that do not fit modern life.',
      'Moda Building renovates with a modern eye — open, light-filled rooms, clean detailing and materials that last — while respecting the architecture of the home. Design and construction live under one roof, so the plan you approve is the plan we build.'
    ],
    subservices: [
      { id: 'whole-home', title: 'Whole-home remodels', text: 'Reworking layouts, opening walls, updating systems and finishes throughout — often while you stay in part of the house. We phase the work to keep you living comfortably.', points: ['Structural wall removal and beams', 'Electrical, plumbing and HVAC updates', 'Flooring, trim and lighting throughout'] },
      { id: 'kitchens', title: 'Kitchen remodels', text: 'Custom and semi-custom cabinetry, quartz and natural stone, islands sized for real families, and lighting and storage planned in detail.', points: [] },
      { id: 'bathrooms', title: 'Bathroom remodels', text: 'Primary suites with curbless showers and freestanding tubs, family baths built for daily wear, and powder rooms with a little drama.', points: [] },
      { id: 'additions', title: 'Additions', text: 'Family rooms, primary suites, mudrooms and second-story additions designed to look original to the house, with structural and permit drawings included.', points: [] },
      { id: 'design-process', title: 'Our design process', text: 'Discovery visit, measured drawings, design concepts, selections and a fixed-scope proposal. You see the plan, the finishes and the price before construction begins.', points: [] },
      { id: 'timelines', title: 'Typical timelines', text: 'Bathrooms: 4–6 weeks. Kitchens: 8–12 weeks. Additions and whole-home remodels: 4–9 months. Design and permitting add 4–10 weeks up front.', points: [] }
    ],
    materials: [
      { name: 'Kitchen remodel', life: '8–12 weeks', note: 'Layout changes, cabinetry, counters, appliances, lighting and flooring.' },
      { name: 'Bathroom remodel', life: '4–6 weeks', note: 'Tile, fixtures, vanities, glass, ventilation and heated floors.' },
      { name: 'Addition', life: '4–7 months', note: 'Foundation to finish, matched to your existing roofline and exterior.' },
      { name: 'Whole-home remodel', life: '4–9 months', note: 'Phased to reduce disruption; systems updated while walls are open.' }
    ],
    costFactors: [
      'Scope — single room, multiple rooms or the whole home',
      'Structural changes such as removing walls or adding beams',
      'Moving plumbing, gas or electrical',
      'Cabinetry, countertop and fixture selections',
      'Age of the home and what is found behind the walls',
      'Architectural drawings, engineering and permit requirements'
    ],
    priceRanges: [
      { label: 'Bathroom remodel', range: '$30,000 – $75,000' },
      { label: 'Kitchen remodel', range: '$60,000 – $175,000' },
      { label: 'Addition', range: '$250 – $450 per sq ft' },
      { label: 'Whole-home remodel', range: '$150,000 – $500,000+' }
    ],
    faqs: [
      { q: 'Can we live at home during the renovation?', a: 'Often, yes. For kitchens we can set up a temporary kitchen; for whole-home work we phase the project and seal off work areas with dust protection. For larger projects we talk honestly about when a short move-out makes sense.' },
      { q: 'Do you provide design, or do I need an architect?', a: 'We are design-build: our team handles design, drawings and selections. For additions and major structural changes we coordinate engineered and architectural drawings as needed for permits.' },
      { q: 'How do you handle surprises behind the walls?', a: 'Older Oakland County homes can hide outdated wiring or past repairs. We investigate during design where we can, include allowances in the proposal, and never proceed with a change without your written approval.' },
      { q: 'Do you serve areas outside the six core cities?', a: 'Our renovation work focuses on Birmingham, Royal Oak, Bloomfield Hills, Rochester Hills, West Bloomfield and Beverly Hills. Elsewhere in Metro Detroit, renovations are available on request — just ask.' },
      { q: 'Is financing available?', a: 'Yes, financing options are available on qualifying projects. See our financing page or ask during your consultation.' }
    ],
    crossSell: { to: 'finished-basements', text: 'Renovating upstairs? The basement is often the best place to add the space you need — a guest suite, gym or family room.', cta: 'See finished basements' }
  }
];
