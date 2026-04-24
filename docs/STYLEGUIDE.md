# Writing Style Guide

Voice and tone for docs, in-app copy, commit messages, and PR descriptions.

## Core voice

**Plainspoken. Specific. A little weathered.**

Think: a neighbor who actually picks fruit, not a startup marketer. We describe what's true, not what sounds exciting.

## Do

- Use short sentences. Break long ones.
- Use concrete nouns. "Fig tree on 3rd & Main" beats "local produce source."
- Cite sources. "Per USDA PLANTS" beats "studies show."
- Name tradeoffs. "Fuzzy locations hide your garden but make pins harder to find" beats "unmatched privacy."
- Be regional-aware. "Mulberries ripen in June here" — *here*, not everywhere.
- Use the Oxford comma.

## Don't

- **No hype words.** "Revolutionary," "game-changing," "disrupting," "reimagining," "unleashing," "seamless," "cutting-edge." If you typed one, delete it.
- **No growth-hacky copy.** No "join thousands," no social-proof fabrication, no urgency manufacturing.
- **No corporate softening.** "We regret to inform you" → "We're not shipping this."
- **No emoji pepper.** Emoji are fine where they carry meaning (🌿 for the brand, 🍎 in species chips). Not as decoration on every heading.
- **No "simply"** or **"just"**. They condescend to the reader.
- **No ALL CAPS** for emphasis. Use italics sparingly.

## Tense & person

- **Docs:** second person, present tense. *"You open the app. It centers on your location."*
- **Changelog:** past tense. *"Added offline queue for pin creation."*
- **Commit messages:** imperative. *"Add offline queue for pin creation."*
- **Marketing copy:** active, confident, short. *"A free map of food growing around you."* not *"We aim to provide..."*

## Words we use a specific way

| Word | Our usage |
|---|---|
| **forager** | Anyone using the app. Not "user" in docs/copy. |
| **pin** | A map marker for a specific tree/plant. Not "listing" in UI copy (though it's called that in the DB for historical reasons). |
| **ripe** | Ready to eat now. Never metaphorical. |
| **public land** | Streets, parks, trails, right-of-ways. We define this specifically. |
| **open source** | Two words, no hyphen. |
| **AGPL** | Always spell out first reference: "AGPLv3 (GNU Affero General Public License)." |

## Species copy

When writing about a species:

✅ *"Black walnut (Juglans nigra). Ripens September–October in temperate zones. Husks stain hands and asphalt. Hull, crack, and roast."*

❌ *"Black walnuts are an amazing superfood packed with nutrients!"*

## Error messages

- **Own the problem.** "We couldn't load the map" beats "Error loading map."
- **Say what to do.** "Try tapping reload, or check your connection."
- **Don't blame the user** even when it is their fault. "This file is too big" beats "You uploaded a file that's too big."

## Length

- **Hero copy:** under 12 words.
- **Section intro:** under 30 words.
- **Paragraph:** under 4 sentences in marketing, under 6 in docs.
- **Bullet:** under 20 words.

If a sentence is long, break it. If a paragraph is long, it's probably two thoughts.

## Inclusivity

- Don't assume location, hemisphere, or climate. "June" means different things in Sydney and Seattle.
- Don't assume urban or rural. Plenty of apartment-dwellers forage parks; plenty of rural folks don't.
- Don't assume able-bodiedness. Not everyone can climb ladders or walk far.
- Use "they" as a singular pronoun. Fine.

## References

- The Elements of Style, Strunk & White
- Revising Prose, Richard Lanham (the paramedic method is gold)
- Anything by Wendell Berry, for how to write about land

---

*When in doubt, read it aloud. If it sounds like a press release, rewrite it.*
