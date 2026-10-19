# Multi-Platform Live Social Post Preview & Workspace Responsiveness Plan

This plan introduces a dedicated **Multi-Platform Live Social Post Preview** component that renders authentic, real-time native post cards for **X/Twitter, LinkedIn, Instagram, Facebook, and YouTube** prior to scheduling or publishing, while also ensuring all workspace navigation tabs (`Streams`, `Planner`, `Analytics`, `Accounts`) and interactive buttons respond immediately to clicks.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following product and UX decisions incorporate your confirmed preferences and address the unresponsive button behavior in the workspace:

- **Confirmed Decision 1 — Target Social Networks**: Full native post card rendering for **X/Twitter, LinkedIn, Instagram, Facebook, and YouTube**, each styled to match the respective network's typography, header metadata, media framing, and engagement action bar.
- **Confirmed Decision 2 — Preview Layout Modes**: **Interactive platform tabs** for focused single-network inspection paired with a **Side-by-Side Comparison toggle** that lets marketers compare how a post adapts across multiple selected channels simultaneously.
- **Confirmed Decision 3 — Platform-Specific Simulation**:
  - **Character Truncation & Read-More Cutoffs**: Enforces platform-accurate character limits (`280` for X, `3,000` for LinkedIn, `2,200` for Instagram, `63,206` for Facebook, `5,000` for YouTube) and simulates native `"…more"` / `"...see more"` fold cutoffs (e.g., LinkedIn's ~210-character fold and Instagram's ~125-character caption fold) with interactive expand/collapse in the preview.
  - **Automatic Entity & Link Card Rendering**: Real-time regex parsing highlights `#hashtags` and `@mentions` in platform accent colors and automatically detects URLs in the caption to render an interactive OpenGraph-style link preview card when no overriding media attachment is present.
- **Critical Fix — Guaranteed Tab & Button Responsiveness**: Replaces implicit Radix state-only tab switching with explicit `onClick` state handlers and direct conditional view rendering so that clicking `Planner`, `Analytics`, `Accounts`, channel filters, and composer triggers responds in under 100ms without event-swallowing.

---

### 1. Overview & Core Concept

- **What It Does**: Provides social media managers with an instant, high-fidelity preview of how their draft caption, hashtags, links, and media assets will appear on every selected social network before dispatching or scheduling.
- **Target Audience / Persona**: Marketing managers, content creators, and agency teams orchestrating multi-channel campaigns who need to verify character cutoffs, link cards, and visual framing across networks without leaving the composer.
- **Key Value**: Eliminates formatting mistakes (such as broken hooks hidden behind LinkedIn/Instagram `"see more"` folds or truncated X posts) and guarantees responsive, zero-latency switching across all workspace views.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Composing & Live Updating**: As the user types a caption, inserts `#hashtags` or `@mentions`, pastes a URL, or selects a media attachment in the Composer or Social Media Generator, the Live Preview updates keystroke-by-keystroke.
  2. **Switching & Comparing Networks**: Users click single-line platform tabs (`X / Twitter`, `LinkedIn`, `Instagram`, `Facebook`, `YouTube`) to inspect one network, or toggle **Compare Side-by-Side** to view all active target channels in a responsive multi-column grid.
  3. **Inspecting Fold Cutoffs & Character Limits**: Each preview card displays a tabular character counter (`tabular-nums`) and a visual warning if the caption exceeds that network's threshold, while allowing the user to click `"…see more"` inside the simulated card to test above-the-fold hook strength.
  4. **Seamless Workspace Navigation**: Clicking `Streams`, `Planner`, `Analytics`, or `Accounts` in the command center toolbar immediately switches the active workspace view, and inline channel filter buttons filter streams in real time.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: High-craft SaaS workspace adhering to single-elevation depth (`1px` subtle borders, clean neutral slate/white surfaces) and zero static pill clutter.
  - *Color Palette & Mood*:
    - **60% Neutral Canvas**: Crisp light/dark adaptive workspace surface (`--background`).
    - **30% Structural Surfaces**: Clean card containers with hairline borders (`border-border`) and muted metadata text (`text-muted-foreground`) separated by `·` dividers.
    - **10% Semantic & Platform Accents**: Emerald primary action buttons for publishing/scheduling, paired with subtle platform-authentic accents inside the simulated native cards (`#0A66C2` for LinkedIn, `#1D9BF0` for X, `#1877F2` for Facebook, `#E1306C` for Instagram, `#FF0000` for YouTube).
  - *Typography & Hierarchy*: Crisp sans-serif hierarchy for UI controls and native post simulation, paired with `tabular-nums` (`font-mono`) for character counters, engagement metrics, and scheduled timestamps.
  - *Component Styling & Layout*: Full 1440px desktop presence with a 2-column split inside the Composer (Left: Editor, AI Rewrite, Media & Schedule controls; Right: Live Multi-Platform Preview Canvas with Single/Compare toggle).

- **Interactive Feedback & Motion**:
  - Instantaneous tab and filter transitions ($\le 150\text{ms}$).
  - Live character progress bar that shifts from neutral to amber (85%+ capacity) to crimson (over limit) with an explicit text label.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Reusable Standalone Live Preview Component**
  - *Chosen Approach*: Build a dedicated, self-contained `SocialPostLivePreview` component that accepts caption text, selected platforms, media attachment, link URL, author profile metadata, and scheduled time, and embed it across both the **Omnichannel Composer** (in the Dashboard) and the **Social Media Generator / Manager** views.
  - *Why*: Ensures consistent, high-fidelity previewing wherever posts are drafted while keeping platform-specific truncation and entity-parsing logic modular.
  - *Alternatives Considered*: Inline preview markup duplicated inside each page—rejected because it leads to inconsistent rendering and maintenance drift.

- **Decision 2: Direct React State Tab & Control Switching**
  - *Chosen Approach*: Bind explicit `onClick` handlers directly to every tab button (`Streams`, `Planner`, `Analytics`, `Accounts`) and filter control, paired with deterministic conditional rendering of each tab panel.
  - *Why*: Prevents Radix UI portal/context desynchronization in React 19 + Next.js 16 Turbopack so that every button click is 100% responsive.
  - *Alternatives Considered*: Relying solely on implicit Radix `onValueChange` events—rejected due to the unresponsive trigger behavior observed in the preview environment.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌───────────────────────────────────────────────────────────────────────────┐
│                    VisionAI Social Command Workspace                      │
│  ┌─────────────────┬─────────────────┬─────────────────┬───────────────┐  │
│  │  Streams View   │  Planner View   │ Analytics View  │ Accounts View │  │
│  └────────┬────────┴────────┬────────┴─────────────────┴───────────────┘  │
│           │                 │                                             │
│           ▼                 ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │               Omnichannel Composer & Post Generator                 │  │
│  │  ┌──────────────────────────────┐  ┌─────────────────────────────┐  │  │
│  │  │   Draft & Schedule Controls  │  │   SocialPostLivePreview     │  │  │
│  │  │  • Target Network Toggles    │  │  • View Mode: Tab | Compare │  │  │
│  │  │  • Caption & AI Tone Assist  │──┼─▶• Entity & URL Link Parser │  │  │
│  │  │  • Media & URL Attachment    │  │  • Fold Cutoff Simulator    │  │  │
│  │  │  • Date/Time Slot Picker     │  │  • Per-Network Card Render  │  │  │
│  │  └──────────────────────────────┘  └─────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────┘
```

- **Data Model & Platform Rules**:
  - **Platform Specification Map**:
    - `twitter` (X): Max `280` chars · Fold at `280` chars · `16:9` media frame · Compact engagement bar (Reply, Repost, Like, Views, Bookmark).
    - `linkedin`: Max `3,000` chars · Above-the-fold cutoff at `210` chars (`"…see more"`) · Corporate header with headline & visibility icon · Reactions + Like/Comment/Repost/Send bar.
    - `instagram`: Max `2,200` chars · Above-the-fold cutoff at `125` chars (`"…more"`) · `1:1` square media frame with fallback visual canvas · Heart/Comment/Share/Save icon bar + caption below media.
    - `facebook`: Max `63,206` chars · Above-the-fold cutoff at `250` chars (`"See more"`) · Page header with timestamp & globe icon · Edge-to-edge media + link card + Like/Comment/Share footer.
    - `youtube`: Max `5,000` chars · Above-the-fold cutoff at `150` chars (`"Read more"`) · `16:9` video/Community post player frame with duration overlay, channel avatar, subscriber badge, and ThumbsUp/Comment bar.

- **Interactive Component & State Mapping**:
  - **Workspace Navigation Bar**: Clicking `Streams`, `Planner`, `Analytics`, or `Accounts` mutates `activeTab` via direct `onClick` handlers and immediately renders the active view.
  - **Channel Filter Controls**: Direct single-line segmented buttons (`All`, `X / Twitter`, `LinkedIn`, `Instagram`, `Facebook`, `YouTube`) filter the active stream items in memory with zero latency.
  - **Live Preview Controls**:
    - `previewMode` toggle (`"single"` vs. `"compare"`): Switches between a single focused card with network selector tabs and a multi-card comparison grid showing all selected channels.
    - `expandedCards` state map: Tracks whether the user has clicked `"…see more"` on each platform card to test truncated vs. full caption appearance.
    - `parseRichText(caption)`: Tokenizes the draft caption into plain text segments, clickable-styled `#hashtags`, `@mentions`, and extracted `https://...` URLs for automatic link preview card rendering.
