# Design System Strategy: The Kinetic Forge

## 1. Overview & Creative North Star
**Creative North Star: "The Neon Terminal"**
This design system moves away from the static, academic feel of traditional coding platforms toward a high-octane, "Cyber-Tactile" environment. We are building a "Digital Dojo"—a space that feels like a high-end IDE met a premium gaming dashboard. 

The aesthetic strategy avoids the "template" look by eschewing rigid, bordered grids in favor of **Tonal Fluidity**. We use intentional asymmetry (e.g., placing heavy headers against airy sidebars) and "glowing" focal points to guide the user's eye through the logic of the code. The UI should feel like it is powered by the code within it—pulsing, responsive, and precision-engineered.

---

## 2. Colors & Surface Philosophy
The palette is rooted in deep obsidian tones to reduce eye strain during long "grind" sessions, punctuated by high-chroma "Status Signals."

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for sectioning. We define space through **Value-Shifting**. 
*   **Method:** A `surface-container-low` code editor sits directly against a `surface` background. The change in hex code is the boundary. This creates a seamless, "molded" look rather than a boxed-in feel.

### Surface Hierarchy & Nesting
Treat the dashboard as a series of physical layers.
*   **Level 0 (Base):** `surface` (#0e0e0e) - The infinite void.
*   **Level 1 (Sections):** `surface-container-low` (#131313) - Global navigation and sidebars.
*   **Level 2 (Cards/Modules):** `surface-container` (#1a1a1a) - Main content areas.
*   **Level 3 (Interactive):** `surface-container-high` (#20201f) - Hover states and active input fields.

### The "Glass & Gradient" Rule
To elevate the "game-like" feel, main CTAs and "Success" states must use a **Linear Glow**. 
*   **CTA Gradient:** `primary` (#a1ffc2) to `primary-container` (#00fc9a) at a 135° angle.
*   **Glassmorphism:** For floating modals or "Level Up" notifications, use `surface-variant` at 60% opacity with a `20px` backdrop-blur. This keeps the user grounded in their workspace while surfacing urgent info.

---

## 3. Typography: The Editorial Logic
We use a high-contrast typographic pairing to balance technical precision with a modern editorial edge.

*   **The Voice (Display & Headlines):** `Space Grotesk`. Its quirky, geometric terminals evoke a "tech-brutalist" vibe. Use `display-lg` for achievement titles to make the user feel the weight of their progress.
*   **The Workhorse (Body & UI):** `Inter`. Chosen for its exceptional legibility at small sizes. All UI labels and descriptive text live here.
*   **The Engine (Code):** A crisp Monospaced font (system-default or JetBrains Mono). 
    *   *Rule:* Code blocks should always have a 1.5 line-height to ensure logic is readable at a glance.

---

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering**, not shadows.

*   **The Layering Principle:** Instead of a drop shadow, elevate a card by moving it from `surface-container` (#1a1a1a) to `surface-container-highest` (#262626). The "lift" is perceived by the eye through color value, keeping the UI crisp.
*   **Ambient Shadows:** Use only for high-level floating elements (e.g., Command Palette). Use a `40px` blur with 8% opacity using the `on-surface` color.
*   **The "Ghost Border" Fallback:** For the "glowing border" requested, use the `outline-variant` (#484847) at **15% opacity**. This creates a hint of a container that feels like a light refraction rather than a stroke.
*   **Status Glows:** Success (Easy) challenges should emit a subtle outer glow using the `primary_dim` color at 10% opacity.

---

## 5. Components

### Buttons
*   **Primary (Action):** Gradient fill (`primary` to `primary_container`), `label-md` uppercase, `xl` (1.5rem) roundedness. No border.
*   **Secondary (Ghost):** No background. `Ghost Border` (15% opacity `outline-variant`). On hover, transition to `surface-container-highest`.
*   **Tertiary (Text):** `on-surface-variant` color. Underline only on hover.

### The "Forge" Coding Cards
*   **Rule:** Forbid divider lines.
*   **Structure:** Use `lg` (1rem) padding and vertical white space to separate the Problem Title from the Metadata. 
*   **Difficulty Indicators:** Use `primary` (Easy), `secondary` (Medium), and `tertiary` (Hard) as **Subtle Pills**. The pill should be a `surface-container-highest` background with a 2px left-accent border of the difficulty color.

### Code Editor Surface
*   **Background:** `surface_container_lowest` (#000000).
*   **Active Line:** `surface_variant` at 20% opacity.
*   **Gutter:** `surface_container` with `on_surface_variant` text for line numbers.

### Progress Chips
*   **Style:** `md` roundedness. Use `secondary_container` for the background and `on_secondary_fixed` for text to create a high-end "Gold/Bronze" achievement feel.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use `space-grotesk` for all numerical data (scores, percentages) to give them a "leaderboard" feel.
*   **Do** use the `primary` (neon green) color sparingly. It is a "reward" color. If everything glows, nothing is important.
*   **Do** lean into `surface-container-lowest` for the code editor to create a "focused" deep-work environment.

### Don’t:
*   **Don't** use 100% white (#ffffff) for long-form body text. Use `on_surface_variant` (#adaaaa) to prevent "halo-ing" on dark backgrounds.
*   **Don't** use standard "Alert" boxes. Use a `tertiary_container` (ruby red) bar that slides in from the top, integrated into the layout's surface hierarchy.
*   **Don't** use sharp 90-degree corners. Even the code editor should have at least `sm` (0.25rem) rounding to maintain the "accessible" high-tech feel.