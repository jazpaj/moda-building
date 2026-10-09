// Problem-based entry points ("What's going on at your home?"). Each one opens the estimate form with the
// service pre-selected and the problem attached to the lead (hidden "problem" field).
// `service` = site service key; `icon` = key in ui.ICON. Order matters: roofing first.

module.exports = [
  { id: 'roof-leak', service: 'roofing', icon: 'drop', title: 'Roof leaking?', text: 'Water stains, drips or a wet attic. We find the source and stop it — emergency tarping if needed.', cta: 'Stop the leak' },
  { id: 'storm-damage', service: 'roofing', icon: 'storm', title: 'Storm or hail damage?', text: 'Missing shingles or dents after a storm. We document the damage and meet your adjuster.', cta: 'Book a storm inspection' },
  { id: 'old-roof', service: 'roofing', icon: 'home', title: 'Roof showing its age?', text: 'Curling shingles, granules in the gutters or a roof past 20 years. Find out if it is repair or replace.', cta: 'Get a free roof check' },
  { id: 'gutters', service: 'roofing', icon: 'gutter', title: 'Gutters overflowing?', text: 'Water spilling over the edge soaks fascia and foundation. Seamless gutters and guards fix it.', cta: 'Fix my gutters' },
  { id: 'wet-basement', service: 'basement-waterproofing', icon: 'drop', title: 'Water in the basement?', text: 'Puddles, damp walls or water at the floor joint after rain. We find where it gets in and stop it.', cta: 'Dry my basement' },
  { id: 'foundation-crack', service: 'basement-waterproofing', icon: 'crack', title: 'Cracks in the foundation?', text: 'Leaking or widening wall cracks. Most poured-wall cracks are a permanent, inside-only repair.', cta: 'Get cracks checked' },
  { id: 'sump-pump', service: 'basement-waterproofing', icon: 'pump', title: 'Sump pump struggling?', text: 'Running nonstop, never running or no backup. A failed pump is the top cause of flooded basements.', cta: 'Check my sump pump' },
  { id: 'musty-basement', service: 'basement-waterproofing', icon: 'wind', title: 'Musty smell or white powder?', text: 'Odors and chalky walls mean moisture is moving through the concrete — worth catching early.', cta: 'Book an inspection' },
  { id: 'unused-basement', service: 'finished-basements', icon: 'sofa', title: 'Basement going unused?', text: 'Turn bare concrete into a family room, bar, theater, gym or guest suite — designed and built by one team.', cta: 'Plan my basement' },
  { id: 'need-space', service: 'finished-basements', icon: 'ruler', title: 'Running out of space?', text: 'A finished lower level is often the most affordable square footage you can add.', cta: 'Explore the options' },
  { id: 'guest-suite', service: 'finished-basements', icon: 'bed', title: 'Need a guest suite or office?', text: 'Bedroom with egress window, full bath and quiet office space — built to code and permitted.', cta: 'Design my space' },
  { id: 'dated-kitchen', service: 'renovations', icon: 'kitchen', title: 'Kitchen feeling dated?', text: 'Closed-off layout, worn cabinets or no real island. We design and build modern kitchens.', cta: 'Plan my kitchen' },
  { id: 'closed-layout', service: 'renovations', icon: 'layout', title: 'Layout not working anymore?', text: 'Open walls, rework rooms or add on — with structural and permit work handled for you.', cta: 'Rethink my layout' },
  { id: 'old-bath', service: 'renovations', icon: 'bath', title: 'Bathroom overdue for an update?', text: 'Curbless showers, double vanities and heated floors in a primary suite you will love.', cta: 'Plan my bathroom' }
];

// Which problems appear where (ids above).
module.exports.home = ['roof-leak', 'storm-damage', 'old-roof', 'wet-basement', 'unused-basement', 'dated-kitchen'];
