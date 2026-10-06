// City data + unique, service-specific local copy for every location page.
// Every service × city page gets its own intro, local considerations and FAQ — no copy-paste duplicates.

module.exports = [
  {
    key: 'birmingham',
    name: 'Birmingham',
    slug: 'birmingham-mi',
    county: 'Oakland County',
    neighborhoods: ['Quarton Lake Estates', 'Poppleton Park', 'Holy Name', 'Pembroke Park', 'the Rail District', 'Downtown Birmingham'],
    nearby: ['bloomfield-hills', 'beverly-hills', 'royal-oak'],
    nearbyOther: ['Troy', 'Bloomfield Township'],
    housing: '1920s Tudors and colonials alongside newer custom builds',
    pages: {
      roofing: {
        intro: [
          'Birmingham roofs range from steep 1920s Tudor gables with multiple valleys to the complex rooflines of new custom homes on Quarton Lake and Pembroke Park lots. Both demand careful flashing work and a crew that respects tight setbacks, mature trees and neighbors a driveway away.',
          'We replace and repair roofs throughout Birmingham with materials that suit the architecture — from architectural asphalt to designer shingles and synthetic slate that echo the original look of historic homes.'
        ],
        local: ['Steep Tudor pitches and multiple valleys need premium underlayment and hand-detailed flashing', 'Mature street trees mean more debris, gutter clogs and branch damage after storms', 'Tight lots: we stage materials and dumpsters to keep sidewalks and neighbors clear'],
        faq: { q: 'Can you match the look of an older Birmingham Tudor or colonial?', a: 'Yes. Designer shingles and synthetic slate are made to recreate the depth of original roofs on historic homes, while meeting today’s wind and ice ratings. We bring samples to your inspection.' }
      },
      'basement-waterproofing': {
        intro: [
          'Many of Birmingham’s older homes sit on original block foundations and clay drain tile that has been working for close to a century. When that tile collapses or clogs, water finds the cove joint — usually right after a spring thaw.',
          'We waterproof Birmingham basements of every age, from Holy Name bungalows to Poppleton Park colonials, with interior drain tile, crack repair and battery-backed sump systems.'
        ],
        local: ['Century-old clay drain tile is a frequent failure point', 'Block foundations show seepage at mortar joints and the wall–floor joint', 'Close-set homes make interior systems the least disruptive fix'],
        faq: { q: 'My Birmingham home is nearly 100 years old. Is waterproofing still worth it?', a: 'Absolutely — older foundations are often the best candidates. Interior drain tile replaces failed original tile and relieves water pressure without disturbing landscaping or neighboring properties.' }
      },
      'finished-basements': {
        intro: [
          'In Birmingham, where lots are compact and adding on is costly, the basement is often the smartest place to gain living space. We design Birmingham basements as a true extension of the home: wine rooms, home theaters, gyms and guest suites with full baths.',
          'Because older homes can have low ceilings and unusual layouts, our design phase starts with a careful look at headroom, ductwork and egress before we sketch a plan.'
        ],
        local: ['Smart use of headroom in older homes with low beams and ductwork', 'Egress windows for guest suites on narrow side yards', 'Finish levels that match the main floor of high-end homes'],
        faq: { q: 'Can you finish a basement with low ceilings in an older Birmingham home?', a: 'Usually, yes. We reroute ductwork where possible, use low-profile lighting and soffits strategically, and confirm required ceiling heights with the city before design is final.' }
      },
      renovations: {
        intro: [
          'Birmingham homeowners often love their neighborhood more than their floor plan. We renovate classic Birmingham homes — opening kitchens to family rooms, building primary suites and adding mudrooms — while keeping the character that makes these streets special.',
          'For homes in or near a historic district, we plan exterior changes with the city’s review process in mind from day one.'
        ],
        local: ['Opening closed kitchens in 1920s–1950s homes', 'Primary suite and mudroom additions on compact lots', 'Exterior work planned around city design and historic review'],
        faq: { q: 'Do exterior changes in Birmingham need extra approval?', a: 'Some do, especially in historic districts or where zoning limits apply. We review requirements with the City of Birmingham during design so your schedule accounts for any review.' }
      }
    }
  },
  {
    key: 'royal-oak',
    name: 'Royal Oak',
    slug: 'royal-oak-mi',
    county: 'Oakland County',
    neighborhoods: ['Vinsetta Park', 'Northwood', 'Normandy Oaks', 'Downtown Royal Oak', 'Woodward Corridor', 'Starr Jaycee Park'],
    nearby: ['birmingham', 'beverly-hills', 'bloomfield-hills'],
    nearbyOther: ['Ferndale', 'Berkley', 'Clawson', 'Huntington Woods'],
    housing: '1920s–1950s bungalows, Cape Cods and brick ranches',
    pages: {
      roofing: {
        intro: [
          'Royal Oak’s blocks of bungalows, Cape Cods and brick ranches were largely built between the 1920s and 1950s, and many are on their second or third roof. Cape Cods with dormers and finished upper floors are especially prone to ice dams when insulation and ventilation are lacking.',
          'We replace and repair roofs across Royal Oak — from Vinsetta Park to Northwood — and fix the ventilation problems that shorten roof life in the first place.'
        ],
        local: ['Cape Cod dormers and knee walls create ice-dam hot spots', 'Many homes still have multiple shingle layers that must come off', 'Detached garages can be re-roofed in the same visit'],
        faq: { q: 'Why does my Royal Oak Cape Cod get ice dams every winter?', a: 'Heat from the finished upstairs escapes into the roof deck and melts snow, which refreezes at the cold eaves. Fixing it takes balanced intake and exhaust ventilation, better insulation and ice-and-water shield at the eaves — all part of how we re-roof.' }
      },
      'basement-waterproofing': {
        intro: [
          'Royal Oak basements are usually block or early poured walls, often with an original floor drain and no sump pump at all. During heavy rain, many Royal Oak homeowners also deal with water from the sewer side — a different problem than seepage through the walls.',
          'We diagnose which you have, then fix it: crack repair, interior drain tile, new sump systems and the gutter and grading corrections that keep water away from the foundation.'
        ],
        local: ['Many homes have no sump pump — we add pits, pumps and backups', 'Distinguishing wall seepage from sewer backup during storms', 'Short downspouts on older homes drain right against the foundation'],
        faq: { q: 'Water came up through my floor drain during a storm. Is that a waterproofing problem?', a: 'Water from a floor drain is usually a sewer or drain-line issue rather than foundation seepage. We help you tell the difference during the inspection and point you to the right fix — often a backwater valve installed by a licensed plumber.' }
      },
      'finished-basements': {
        intro: [
          'Royal Oak homes are full of character but often short on square footage. A finished basement turns a modest bungalow or ranch into a home that fits a growing family: a family room, a kids’ play area, a home office and a second bathroom.',
          'We design Royal Oak basements to feel bright and open, with smart storage, egress windows where they count and finishes that stand up to everyday life.'
        ],
        local: ['Adding a second bathroom to one-bath bungalows and ranches', 'Home offices and play areas on modest footprints', 'Egress windows sized for side yards between close homes'],
        faq: { q: 'Can a small Royal Oak basement really feel like living space?', a: 'Yes. Light flooring, recessed lighting, an egress window and built-in storage make even compact basements feel open. We plan zones so the space works for several uses.' }
      },
      renovations: {
        intro: [
          'Royal Oak renovations are often about making a classic home work harder: opening a small kitchen to the dining room, adding a primary suite or building a second-story addition on a bungalow.',
          'We plan these projects with an eye for modern design — clean lines, good light, durable finishes — that still feels right on a tree-lined Royal Oak street.'
        ],
        local: ['Second-story and rear additions on bungalows', 'Kitchen openings and wall removal in 1920s–1950s homes', 'Updating original electrical and plumbing during the remodel'],
        faq: { q: 'Can you add a second story to my Royal Oak bungalow?', a: 'Often, yes. It starts with a structural review of the foundation and framing and a zoning check. We coordinate engineered drawings and permits as part of the design phase.' }
      }
    }
  },
  {
    key: 'bloomfield-hills',
    name: 'Bloomfield Hills',
    slug: 'bloomfield-hills-mi',
    county: 'Oakland County',
    neighborhoods: ['the Cranbrook area', 'Lone Pine Road corridor', 'Long Lake Road area', 'Bloomfield Village', 'Bloomfield Township', 'Wing Lake area'],
    nearby: ['birmingham', 'beverly-hills', 'west-bloomfield'],
    nearbyOther: ['Bloomfield Township', 'Troy', 'Auburn Hills'],
    housing: 'large custom estates and mid-century moderns on wooded lots',
    pages: {
      roofing: {
        intro: [
          'Bloomfield Hills homes are large, architecturally distinct and often roofed with materials most crews rarely touch: natural slate, cedar shake, tile and copper details. Complex rooflines with turrets, dormers and long valleys call for experienced craftsmen and meticulous flashing.',
          'We repair and replace Bloomfield Hills roofs with premium materials, protecting landscaped grounds and long drives throughout the project.'
        ],
        local: ['Slate, cedar shake and synthetic slate on estate homes', 'Copper and metal flashing on complex rooflines', 'Wooded lots mean tree-fall damage and heavy gutter loads'],
        faq: { q: 'Do you work with slate and cedar shake roofs in Bloomfield Hills?', a: 'Yes. We repair slate and shake, and for replacements we also offer synthetic slate and shake that keep the look with far less weight and maintenance. We will tell you honestly when a repair is the better value.' }
      },
      'basement-waterproofing': {
        intro: [
          'Large Bloomfield Hills homes often have finished lower levels and walkouts on sloped, wooded lots — beautiful, but a challenge when water starts moving downhill toward the foundation. A leak in a finished lower level is costly fast.',
          'We find the source and fix it with as little disruption as possible, using interior drain tile, exterior waterproofing where landscaping allows, and dual sump systems sized for big footprints.'
        ],
        local: ['Walkout basements and sloped lots channel surface water toward foundations', 'Finished lower levels: we protect and restore finishes', 'Large footprints often need two sump pumps and full backups'],
        faq: { q: 'Our lower level is already finished. Can you still waterproof it?', a: 'Yes. We remove only what is needed along the affected walls, install the system and restore the finishes. In some cases exterior waterproofing avoids interior disruption entirely.' }
      },
      'finished-basements': {
        intro: [
          'In Bloomfield Hills, a finished basement is often a showpiece: a wine cellar and tasting room, a full home theater, a fitness studio or a complete guest suite for visiting family.',
          'We design and build lower levels with the same finish quality as the main floor — custom millwork, stone, statement lighting and integrated audio — and make sure every square foot is dry and properly ventilated first.'
        ],
        local: ['Wine rooms, theaters and fitness studios', 'Walkout basements designed around views and natural light', 'Main-floor-quality finishes, millwork and lighting'],
        faq: { q: 'Can you build a wine cellar or home theater in our basement?', a: 'Yes. We plan climate control for wine storage, and sound isolation, wiring and seating tiers for theaters, coordinating any specialty AV or cooling partners under one schedule.' }
      },
      renovations: {
        intro: [
          'Many Bloomfield Hills homes were built for a different era of living: formal rooms, separated kitchens and dated primary baths. We transform them with open kitchens, spa-level primary suites and modern updates that respect the original architecture — whether it is a classic estate or a mid-century modern.',
          'Our design-build process keeps large, complex renovations organized, with one team accountable from the first sketch to the final punch list.'
        ],
        local: ['Reworking formal floor plans into open, modern living', 'Spa-style primary suites and chef’s kitchens', 'Thoughtful updates to mid-century modern homes'],
        faq: { q: 'Can you renovate a mid-century modern home without losing its character?', a: 'Yes. Modern design is in our name. We keep the clean lines, glass and open spirit of mid-century homes while updating systems, insulation and finishes.' }
      }
    }
  },
  {
    key: 'rochester-hills',
    name: 'Rochester Hills',
    slug: 'rochester-hills-mi',
    county: 'Oakland County',
    neighborhoods: ['Brooklands', 'Christian Hills', 'Hampton area', 'Stoney Creek area', 'the Bloomer Park area', 'the Oakland University area'],
    nearby: ['bloomfield-hills', 'west-bloomfield', 'birmingham'],
    nearbyOther: ['Rochester', 'Auburn Hills', 'Troy', 'Shelby Township'],
    housing: '1970s–2000s subdivision colonials and ranches',
    pages: {
      roofing: {
        intro: [
          'Most Rochester Hills subdivisions were built from the 1970s through the 2000s, which means many neighborhoods are reaching roof-replacement age at the same time. When one home on the street is re-roofed, the others are rarely far behind.',
          'We replace and repair roofs throughout Rochester Hills, upgrading builder-grade shingles and undersized ventilation to systems built for Michigan winters.'
        ],
        local: ['Builder-grade shingles from the 1990s–2000s reaching end of life', 'Undersized attic ventilation in many subdivision homes', 'HOA color and material guidelines — we help you choose an approved option'],
        faq: { q: 'Does my Rochester Hills HOA need to approve a new roof?', a: 'Many subdivisions require approval of shingle color or style. We provide product and color information for your HOA submission and wait for approval before scheduling.' }
      },
      'basement-waterproofing': {
        intro: [
          'Rochester Hills homes typically have poured concrete basements — and poured walls crack as they cure and settle. Those hairline cracks often stay dry for years, then start leaking after a wet spring.',
          'Many of these cracks are an ideal fit for injection repair, a permanent, inside-only fix. For wider seepage, we install interior drain tile and upgrade sump pumps that have reached the end of their life.'
        ],
        local: ['Poured-wall shrinkage cracks that begin leaking years later', 'Original builder sump pumps nearing end of life', 'Window well leaks on subdivision homes'],
        faq: { q: 'Is crack injection a permanent fix for my Rochester Hills basement?', a: 'For a typical poured-wall crack, yes. Injection fills the crack through the full thickness of the wall, stopping water from the inside. We warranty the repair.' }
      },
      'finished-basements': {
        intro: [
          'Rochester Hills families tend to need flexible space: a place for teenagers, a home gym, an office and room for visiting grandparents. Subdivision homes here often have generous, open basements with good ceiling height — ideal for finishing.',
          'We design basements that grow with your family, with zones that can change from play room to teen hangout to guest suite over time.'
        ],
        local: ['Large open basements with good ceiling height', 'Flexible zones for kids, teens, gyms and guests', 'Bathroom rough-ins from the builder that we can put to use'],
        faq: { q: 'My Rochester Hills basement has a bathroom rough-in. Does that save money?', a: 'Usually, yes. An existing rough-in means less concrete cutting and plumbing work. We confirm it is in a usable location during design.' }
      },
      renovations: {
        intro: [
          'In Rochester Hills, many homes from the 1980s–2000s have solid bones but dated finishes: honey oak cabinets, small islands, closed formal living rooms and builder-grade baths.',
          'We renovate these homes into bright, modern spaces — larger kitchens with real islands, open family areas and primary bathrooms that feel like a retreat.'
        ],
        local: ['Kitchen updates in 1980s–2000s colonials', 'Converting unused formal rooms into offices or open living space', 'Primary bath upgrades with walk-in showers'],
        faq: { q: 'Can we remove the wall between our kitchen and formal dining room?', a: 'Often, yes. We check whether the wall is load-bearing and what it carries, then design a beam solution if needed and handle the permit.' }
      }
    }
  },
  {
    key: 'west-bloomfield',
    name: 'West Bloomfield',
    slug: 'west-bloomfield-mi',
    county: 'Oakland County',
    neighborhoods: ['Pine Lake', 'Cass Lake area', 'Upper Straits Lake', 'Green Lake', 'Walnut Lake', 'Orchard Lake area'],
    nearby: ['bloomfield-hills', 'birmingham', 'rochester-hills'],
    nearbyOther: ['Orchard Lake Village', 'Keego Harbor', 'Farmington Hills', 'Commerce Township'],
    housing: '1960s–1990s contemporaries and lakefront homes',
    pages: {
      roofing: {
        intro: [
          'West Bloomfield’s contemporaries and lake homes bring roofing challenges you do not see everywhere: low-slope sections, large skylights, clerestory windows and roofs exposed to wind coming straight off the lake.',
          'We repair and replace West Bloomfield roofs with the right system for each section — shingles on steep slopes, membrane on low slopes and careful flashing around skylights and glass.'
        ],
        local: ['Low-slope sections on contemporary homes need membrane, not shingles', 'Skylights and clerestories are common leak sources', 'Lakefront homes face higher wind exposure'],
        faq: { q: 'My contemporary home has flat and steep sections. Can you do both?', a: 'Yes. Low-slope areas get a membrane system designed for standing water and snow load, tied into shingled or metal sections with proper transitions.' }
      },
      'basement-waterproofing': {
        intro: [
          'With dozens of lakes and a high water table in places, West Bloomfield basements face steady groundwater pressure — especially lake-adjacent homes and walkouts facing the water.',
          'We design waterproofing for those conditions: interior drain tile with high-capacity sump systems, battery backups and alarms, so a spring storm does not become a flooded lower level.'
        ],
        local: ['Higher water tables near Pine, Cass and Upper Straits Lakes', 'Lake-facing walkouts with heavy surface runoff', 'High-capacity sumps with battery backup as a standard recommendation'],
        faq: { q: 'Our home is near a lake. Will waterproofing still work?', a: 'Yes, when it is designed for the conditions. We size drain tile and sump capacity for higher groundwater and always recommend a backup pump and alarm for lake-area homes.' }
      },
      'finished-basements': {
        intro: [
          'West Bloomfield lake homes and walkouts have basements that can feel like a main floor: daylight, views and direct access to the yard or water. We design lower levels that take advantage of it — lake-view family rooms, bars that open to the patio and guest suites with their own entry.',
          'Because groundwater is a real factor here, every West Bloomfield basement starts with a moisture assessment and the right waterproofing plan.'
        ],
        local: ['Walkout lower levels designed around lake views', 'Bars and lounges opening onto patios', 'Moisture management built into every plan'],
        faq: { q: 'Is it safe to finish a basement near a lake?', a: 'Yes, with the right preparation: a dry foundation, a reliable sump system with backup, and moisture-resistant materials like insulated wall systems and waterproof flooring.' }
      },
      renovations: {
        intro: [
          'West Bloomfield’s 1960s–1990s contemporaries were designed with bold angles, vaulted ceilings and big glass. Many now need updated kitchens, baths and energy-efficient windows — without losing the drama that makes them special.',
          'We renovate contemporary and lakefront homes with a clean, modern sensibility, from kitchen and bath remodels to whole-home updates.'
        ],
        local: ['Updating 1980s contemporaries while keeping vaulted, open volumes', 'Lake-facing kitchens and great rooms', 'Window and skylight replacements during remodels'],
        faq: { q: 'Can you modernize a 1980s contemporary without a full gut?', a: 'Yes. Targeted updates — kitchen, primary bath, flooring, lighting and finishes — can transform a contemporary home. We prioritize changes with the biggest impact for your budget.' }
      }
    }
  },
  {
    key: 'beverly-hills',
    name: 'Beverly Hills',
    slug: 'beverly-hills-mi',
    county: 'Oakland County',
    neighborhoods: ['Beverly Park area', 'the Southfield Road corridor', 'the 13 Mile Road area', 'the 14 Mile Road area', 'the Groves High School area', 'Rouge River area'],
    nearby: ['birmingham', 'bloomfield-hills', 'royal-oak'],
    nearbyOther: ['Bingham Farms', 'Southfield', 'Franklin', 'Bloomfield Township'],
    housing: '1940s–1960s ranches and colonials on wooded lots',
    pages: {
      roofing: {
        intro: [
          'Beverly Hills is known for its wooded lots and mid-century ranches and colonials. Those mature trees are beautiful, but they drop limbs in storms, fill gutters and keep roofs shaded and damp — shortening shingle life and inviting moss.',
          'We inspect, repair and replace roofs throughout the village, paying special attention to tree damage, gutters and ventilation.'
        ],
        local: ['Heavy tree cover: limb damage, moss and clogged gutters', 'Long, low ranch rooflines with large surface area', 'Gutter guards are often worth it on wooded lots'],
        faq: { q: 'A tree branch hit my Beverly Hills roof. What should I do?', a: 'Call us for an inspection and, if needed, emergency tarping to stop further damage. We document the damage with photos for your insurance claim and repair or replace the affected area.' }
      },
      'basement-waterproofing': {
        intro: [
          'Many Beverly Hills homes date from the 1940s to 1960s and are reaching the age where original drain tile and block foundations start to show their years. Wooded lots also mean gutters clog quickly, dumping roof water right at the foundation.',
          'We fix both sides of the problem: the foundation itself, with crack repair or interior drain tile, and the drainage, with gutters and downspout extensions that move water away.'
        ],
        local: ['Aging block foundations and original drain tile', 'Clogged gutters overflowing against basement walls', 'Low areas on wooded lots that collect runoff'],
        faq: { q: 'Can clogged gutters really cause basement leaks?', a: 'Yes. One overflowing gutter can dump hundreds of gallons against a foundation during a storm. We often pair waterproofing with gutter repairs, guards and downspout extensions.' }
      },
      'finished-basements': {
        intro: [
          'Beverly Hills ranches have one major advantage: a basement that runs the full footprint of the house. That is a lot of potential living space — a family room, an office, a gym and a guest room can all fit.',
          'We design these long, open basements with zones and lighting that keep them from feeling like a hallway, and make sure older foundations are dry before we finish.'
        ],
        local: ['Full-footprint ranch basements with room for multiple zones', 'Dry-first approach for older foundations', 'Guest rooms with code-compliant egress'],
        faq: { q: 'Our ranch basement is long and narrow. How do you make it feel open?', a: 'We break it into zones with lighting, flooring transitions and furniture layouts rather than walls, keeping sight lines open and adding egress windows for daylight.' }
      },
      renovations: {
        intro: [
          'Beverly Hills mid-century homes are ready for their next chapter. We open up ranch floor plans, update kitchens and baths and design additions that fit the scale of these wooded lots.',
          'Our design-build approach makes it easy to plan a renovation in phases — kitchen this year, primary suite next — with a master plan that ties it together.'
        ],
        local: ['Opening ranch floor plans for modern living', 'Primary suite additions on larger lots', 'Phased renovation master plans'],
        faq: { q: 'Can we renovate in phases?', a: 'Yes. We create a whole-home plan first, then build it in phases so each stage fits your budget and timing without undoing earlier work.' }
      }
    }
  },
  {
    key: 'metro-detroit',
    name: 'Metro Detroit',
    slug: 'metro-detroit',
    county: 'Oakland, Macomb & Wayne Counties',
    isRegion: true,
    neighborhoods: ['Troy', 'Southfield', 'Ferndale', 'Novi', 'Farmington Hills', 'Sterling Heights', 'Grosse Pointe', 'Livonia', 'Dearborn', 'Clawson', 'Berkley', 'Auburn Hills'],
    nearby: ['birmingham', 'royal-oak', 'bloomfield-hills', 'rochester-hills', 'west-bloomfield', 'beverly-hills'],
    nearbyOther: [],
    housing: 'every style, from pre-war brick to new construction',
    pages: {
      roofing: {
        intro: [
          'Moda Building serves homeowners across Metro Detroit — Oakland, Macomb and Wayne counties — for roof replacement, roof repair, storm damage and gutters. From pre-war brick homes in Ferndale and Grosse Pointe to newer subdivisions in Novi and Sterling Heights, every roof gets the same inspection, the same written quote and the same cleanup standard.',
          'Southeast Michigan weather is the common thread: freeze–thaw cycles, ice dams and fast-moving summer storms with hail and wind. We build roofs to handle all of it.'
        ],
        local: ['Free inspections throughout Oakland, Macomb and Wayne counties', 'Storm damage documentation and adjuster meetings region-wide', 'Emergency tarping after wind and hail events'],
        faq: { q: 'Do you charge more to travel outside Oakland County?', a: 'No. Roof inspections and estimates are free throughout Metro Detroit.' }
      },
      'basement-waterproofing': {
        intro: [
          'From Livonia to St. Clair Shores, Metro Detroit basements share the same adversary: heavy clay soil that holds water against foundations, and spring thaws that push it through every crack. Moda Building waterproofs basements throughout Oakland, Macomb and Wayne counties.',
          'Whether you have a block foundation in an older inner-ring suburb or poured walls in a newer subdivision, we diagnose the cause and recommend the fix that will last.'
        ],
        local: ['Crack repair, drain tile and sump systems region-wide', 'Free basement inspections throughout Metro Detroit', 'Written, transferable warranty on waterproofing systems'],
        faq: { q: 'Which areas do you cover for waterproofing?', a: 'All of Metro Detroit, including Oakland, Macomb and Wayne counties. If you are unsure whether we serve your city, call us or submit the form and we will confirm.' }
      }
    }
  }
];
