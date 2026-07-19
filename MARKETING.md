# VISP launch and marketing suite

Research checked: 19 July 2026. Re-check community rules immediately before posting; moderators change them without notice.

Primary URL: https://visp-stream.com

## 1. The strategy in one page

VISP should not market itself as another mobile streaming app. Moblin, IRL Pro, Larix, PRISM, and similar apps already occupy that category. VISP's useful wedge is:

> Your phone is the camera. Your existing OBS setup stays the studio.

The first audience is a Twitch or Kick creator who already has an OBS production and wants to leave the desk without abandoning scenes, alerts, graphics, chat, or control. The first promise is a concrete workflow:

> Send one or more phone cameras to OBS at home, keep the broadcast alive through a brief signal drop, and control OBS from the phone.

Do not lead with protocols, infrastructure, “control plane,” or self-hosting. Those are proof for technical buyers, not the opening pitch.

### Launch gate

Do not run a broad launch until these five assets exist:

1. A 25–40 second uncut proof video: phone outdoors → live feed visible in OBS → scene switch from phone → second phone feed → brief network interruption and recovery.
2. Three real product screenshots replacing the visible `phone-in-hand shot` placeholder on the live homepage.
3. A public route from the homepage to docs, GitHub, privacy/contact information, and the supported client downloads or beta-access instructions.
4. A clear answer on the landing page to “Do I need to self-host this?” The site sells a hosted beta while the repository describes a self-hosted system; that ambiguity will cost conversions.
5. One successful end-to-end setup by someone who did not build VISP, with the time-to-first-picture recorded.

The current beta is real and reachable, but the homepage is not ready for a large burst of skeptical traffic. Fixing the proof assets is higher leverage than opening ten social accounts.

### 30-day objective

Recruit 15 qualified beta users, get 8 to complete setup, get 5 to run a real stream, and obtain 3 publishable clips or testimonials. Optimize for activated broadcasters, not impressions.

### Core metrics

Track this funnel weekly:

| Metric | Definition | First target |
| --- | --- | ---: |
| Qualified visits | Visitors from streaming/OBS sources | 300 |
| Signup conversion | Twitch/Kick sign-ins ÷ qualified visits | 15% |
| Setup completion | Users with a usable relay path and OBS source | 50% of signups |
| First picture | Users who send a phone/browser feed into OBS | 60% of setups |
| First real stream | Users who broadcast outside a test | 5 |
| Retained creator | Streams again within 14 days | 3 |
| Proof created | Permissioned testimonial or usable clip | 3 |

Use distinct links for attribution:

```text
https://visp-stream.com/?utm_source=reddit&utm_medium=organic&utm_campaign=beta_launch&utm_content=irlstreaming
https://visp-stream.com/?utm_source=x&utm_medium=organic&utm_campaign=beta_launch&utm_content=proof_video
https://visp-stream.com/?utm_source=instagram&utm_medium=organic&utm_campaign=beta_launch&utm_content=reel_01
https://visp-stream.com/?utm_source=youtube&utm_medium=organic&utm_campaign=beta_launch&utm_content=short_01
```

Do not use a URL shortener on Reddit. Some relevant communities explicitly ban them.

## 2. Positioning and message bank

### Ideal customer profiles

1. **IRL creator with a home OBS rig** — the best initial user. Already understands OBS and cares about fallback scenes, chat, and remote control.
2. **Small multi-camera production** — podcasts, local sports, events, worship, maker streams, or interviews that can reuse spare phones as remote feeds.
3. **Kick/Twitch creator adding occasional outside segments** — does not need a full backpack or cloud OBS subscription, but wants more production value than a direct phone stream.
4. **Self-hoster/video engineer** — cares about SRT/RTMP, MediaMTX, revocable credentials, and owning the infrastructure. Valuable for feedback and credibility, but not the lead mass-market segment.

### One-liners

- VISP turns phones into remote cameras for the OBS production you already built.
- Go outside without leaving your OBS scenes, alerts, and graphics behind.
- Multiple phone cameras, separate microphones, one home studio.
- IRL streaming without rebuilding your show on a phone.
- A self-hostable SRT/RTMP relay and remote-control layer for OBS.

### Short description

VISP sends one or more phone cameras to OBS at home, where your existing scenes, alerts, and graphics keep running. It includes Twitch and Kick sign-in, per-device credentials, chat, stream metadata, and remote OBS scene/start/stop control. The hosted beta is free and the server is open source.

### Proof points that are supported by the current product

- iOS and Android camera publishing over SRT.
- Browser publishing over WebRTC.
- SRT and RTMP ingest/read through MediaMTX.
- Multiple independently revocable publishing devices.
- Separate microphone per phone feed.
- Twitch and Kick login, chat, and stream metadata controls.
- Authenticated OBS start/stop and scene switching through an outbound-only plugin.
- A brief source interruption does not itself end the destination broadcast when OBS remains live on a fallback scene.
- VISP does not receive the creator's Twitch or Kick stream key.
- Free during beta; no credit card required.
- GPL-2.0 source: https://github.com/JoniJuntto/visp

### Claims not to make

Do not say “zero downtime,” “unbreakable,” “bonded internet,” “end-to-end encrypted video,” “no latency,” “works on any phone,” “multistreams everywhere,” or “replaces a streaming backpack.” The current product does not bond networks, transcode, host OBS, manage platform stream keys, guarantee uptime, or horizontally scale MediaMTX.

### Honest competitive frame

OBS's own mobile-app guide lists PRISM Live Studio, IRL Pro, and Moblin. Creators also use Larix, BELABOX, VDO.Ninja, hosted SRT relays, and cloud OBS services. Do not attack these tools.

Use this comparison:

- **Mobile encoder apps** are good at capturing and sending a phone feed.
- **Hosted SRT/SRTLA relays** are good at moving a feed and may add bonding or cloud OBS.
- **VISP** bundles the relay workflow, device access, browser/phone publishing, Twitch/Kick context, and authenticated OBS control around a creator's existing home OBS setup.

VISP's defensible story is integration and control, not that it invented phone-to-OBS streaming.

## 3. Reddit plan

Reddit rewards useful participation and punishes drive-by promotion. Use one real personal account, disclose that you built VISP in every relevant post, answer every good-faith comment, and never seed fake praise or have friends coordinate votes.

### Community matrix

| Community | Fit | Current rule finding | Action |
| --- | --- | --- | --- |
| r/IRLstreaming | Excellent audience fit | No community-specific rules returned on 19 Jul 2026; sitewide spam rules still apply | Participate first, then make one transparent, feedback-led post |
| r/SideProject | Good launch/story fit | No community-specific rules returned | Post the build story once; do not cross-post identical copy |
| r/BetaTests | Good tester recruitment | No spam/low effort; account 24h+ and 2+ combined karma | Post a structured test request |
| r/alphaandbetausers | Good tester recruitment | No community-specific rules returned | Post a concise beta request after participating |
| r/opensource | Good technical fit | Promotion allowed in moderation; promotional flair; repository must have an OSI license; AI-generated content is ban-worthy | Human must write the final post in their own words; use the factual outline below only |
| r/selfhosted | Strong technical fit | Production-ready apps with docs; projects under 3 months only in the current New Project Megathread; Wednesday tool exception exists | Use only the current New Project Megathread for now |
| r/droidappshowcase | Moderate Android fit | One app post/week; real description and direct Google Play/GitHub link; no promo-only accounts; verified email, 24h+, 2+ karma | Wait for public Android access, then post once |
| r/iOSApps | Moderate iOS fit | 10 local karma; App Store/TestFlight link only; once/30 days; non-qualified developers use App Shelf Megathread | Wait for a public TestFlight/App Store link and earn local karma |
| r/KickStreaming | Strong provider fit | No selling; self-promotion only in moderation; Kick-related content only | Ask moderators before a product post; pitch the free Kick workflow |
| r/streaming | Strong audience, high risk | Third-party tools require prior mod approval; unapproved ads can trigger permanent ban | Modmail first; do nothing without explicit approval |
| r/obs | Strong audience, wrong venue for an ad | Self-promotion is not allowed except when required for help; useful how-to links may be allowed when not spammed | Do not launch-post; answer relevant questions honestly and submit the plugin to OBS Resources |
| r/Twitch | Huge audience, closed door | July 2026 is the final month for new permission requests; app/tool/service promotion ends entirely after 1 Sep 2026 | Do not build the plan around it; never astroturf a question or reply |
| r/streaming / r/TwitchStreaming | Poor launch venue | Direct/self/third-party promotion is prohibited or approval-gated | Skip |
| r/VIDEOENGINEERING | Useful expert feedback | Exact rules were not reliably retrievable in this research | Modmail a technical demo request before posting |

### Reddit posting sequence

Do not publish these all on the same day. That makes the account look like a campaign bot and produces duplicate discussions.

1. Spend 7–10 days making useful, non-promotional comments in r/IRLstreaming, r/obs, r/selfhosted, and the relevant app community.
2. Post to r/BetaTests and recruit 3–5 testers.
3. Fix the first repeated setup failure and record the proof video.
4. Post the result and limitations to r/IRLstreaming.
5. Three or four days later, post the builder story to r/SideProject.
6. Use the r/selfhosted New Project Megathread, not the main feed.
7. Post to app-specific communities only when public install links exist.

### Ready post: r/IRLstreaming

**Title**

```text
I built a free beta that sends multiple phone cameras into your home OBS setup
```

**Body**

```text
Full disclosure: I built this.

I wanted to stream away from the desk without replacing the OBS production already running at home. VISP lets a phone act as a remote camera and microphone while OBS keeps handling the actual show — scenes, alerts, graphics, and the destination stream.

The current beta supports iOS, Android, and a browser publisher. You can add more than one phone as separate sources, follow Twitch or Kick chat, edit stream info, and switch OBS scenes or start/stop OBS from the phone. Each phone gets its own revocable publishing credential, and VISP never needs the Twitch/Kick stream key.

It is free during beta and the server is open source.

What it does not do: network bonding, transcoding, cloud-hosted OBS, or guaranteed zero-drop streaming. The idea is to keep OBS live on a fallback scene while a phone feed reconnects.

25-second real setup/demo: [UPLOAD NATIVE VIDEO OR GIF HERE]
Try it: https://visp-stream.com/?utm_source=reddit&utm_medium=organic&utm_campaign=beta_launch&utm_content=irlstreaming
Source: https://github.com/JoniJuntto/visp

I am specifically looking for feedback from people who already run IRL through OBS: where does this workflow still feel harder than Moblin/IRL Pro + a relay, and what would stop you from testing it on a real stream?
```

Use a native video upload. Do not lead with a link card.

### Ready post: r/BetaTests

**Title**

```text
[Web/iOS/Android] Test a phone-to-OBS remote streaming workflow — free beta
```

**Body**

```text
I am looking for 5 streamers who already use OBS and can test one complete workflow:

1. Sign in with Twitch or Kick.
2. Add the generated VISP source to OBS.
3. Send a phone or browser camera to OBS from a different network.
4. Switch an OBS scene from the phone.
5. Interrupt the phone connection briefly and confirm the source recovers.

VISP is a free beta for using one or more phones as remote cameras while the existing OBS setup remains the production studio. It does not host OBS, bond connections, or handle your Twitch/Kick stream key.

Time needed: about 20 minutes.
Platforms: current Chrome/Edge/Safari; physical iPhone or Android device for the native app.
Feedback wanted: setup time, the first confusing step, delay/stability, and whether you would trust it for a real stream.

Demo: [VIDEO]
Test: https://visp-stream.com/?utm_source=reddit&utm_medium=organic&utm_campaign=beta_launch&utm_content=betatests
Source/docs: https://github.com/JoniJuntto/visp and https://docs.visp-stream.com

I built VISP and will be in the thread answering questions and fixing reproducible setup problems.
```

### Ready post: r/SideProject

**Title**

```text
I built an open-source bridge between phone cameras and the OBS setup at home
```

**Body**

```text
Most “stream from your phone” products replace the desktop production. I wanted the opposite: keep OBS at home doing scenes, alerts, and the final broadcast, and treat phones in the field as camera sources.

VISP now has:

- iOS/Android SRT publishing and browser WebRTC publishing
- multiple phone feeds with separate microphones
- Twitch/Kick sign-in, chat, and stream-info controls
- per-device revocable credentials
- an OBS plugin for remote start/stop and scene switching without opening an inbound port
- a self-hostable MediaMTX-based relay/control plane

It is GPL-2.0 and free during beta. It does not transcode, bond networks, host OBS, or touch provider stream keys.

Live product: https://visp-stream.com/?utm_source=reddit&utm_medium=organic&utm_campaign=beta_launch&utm_content=sideproject
Source: https://github.com/JoniJuntto/visp

The part I am testing now is not “does SRT work?” It is whether a normal OBS creator can reach first picture without understanding the relay underneath. If you use OBS, I would value the one setup step that looks most likely to lose you.
```

### Ready comment: r/selfhosted New Project Megathread

```text
VISP — a GPL-2.0, self-hosted SRT/RTMP relay and control layer for remote live streaming.

It uses MediaMTX for media, PostgreSQL plus an Elysia/tRPC app for auth and device state, a TanStack portal, iOS/Android/browser publishers, and an outbound-polling OBS plugin. Twitch/Kick users get independently revocable device credentials, chat/metadata controls, and remote OBS scene/start/stop control without giving VISP their provider stream key.

Current limits: two-host deployment, no transcoding, no network bonding, no billing/quotas, and no horizontal MediaMTX scaling. The project first became public on 18 July 2026, so I am posting it only in this new-project thread as required.

Repo: https://github.com/JoniJuntto/visp
Docs: https://docs.visp-stream.com
Hosted beta: https://visp-stream.com/?utm_source=reddit&utm_medium=organic&utm_campaign=beta_launch&utm_content=selfhosted_megathread

I built it and would especially value feedback on the deployment/security model or the first-run broadcaster flow.
```

### Factual outline for r/opensource — do not paste generated copy

r/opensource currently says all AI-generated content is ban-worthy. Write the post personally from scratch. Include:

- Title prefix/flair: `Promotional`.
- Why you personally built a phone-to-home-OBS workflow.
- GPL-2.0 repository link.
- What is genuinely open: server, web portal, native clients, OBS plugin, deployment templates.
- Current architecture in one paragraph.
- Honest v1 limits: no transcoding, bonding, cloud OBS, billing, or horizontal scaling.
- One concrete contribution request, such as testing Windows OBS packaging or improving first-run deployment docs.
- Disclosure that you are the maintainer.

### Future post: r/droidappshowcase

Use only after a public Google Play or direct GitHub app page is available.

```text
Title: [Dev] VISP — use an Android phone as a remote camera for your home OBS production

I built VISP for streamers who want to leave the desk without replacing the OBS show running at home. The Android app publishes the selected camera and microphone over SRT, shows Twitch/Kick chat, edits stream info, and can switch scenes or start/stop paired OBS.

The beta is free. It does not bond mobile connections or host OBS; it keeps the phone as a source and your own OBS as the studio.

Android: [PUBLIC GOOGLE PLAY LINK]
Demo: [NATIVE VIDEO]
Source: https://github.com/JoniJuntto/visp

I am the developer. The feedback I need most is battery/thermal behavior after 30 minutes and reconnect behavior when moving between Wi-Fi and mobile data. Please include device model and Android version if reporting a problem.
```

### Modmail template: r/streaming, r/KickStreaming, or r/VIDEOENGINEERING

```text
Subject: Permission request — transparent VISP beta demo/feedback post

Hi mods,

I built VISP, a free/open-source relay and OBS-control workflow that sends phone cameras into an existing home OBS production. I would like to post one native 25–40 second demonstration, disclose my affiliation in the first line, list the product's limitations, and ask for technical workflow feedback. The post would contain one product link and one GitHub link; there would be no giveaway, affiliate link, vote request, or repeated promotion.

Proposed title:
“I built a free beta that sends multiple phone cameras into your home OBS setup”

Proposed full text: [PASTE THE EXACT DRAFT]

Would this be allowed here, and is there a preferred flair or recurring thread? I will not post without approval.

Thanks,
Joni
```

### Reddit comment response bank

**“How is this different from Moblin/IRL Pro?”**

```text
Those are strong mobile encoders, and I do not claim VISP invented phone-to-OBS streaming. VISP's focus is the surrounding workflow: managed/revocable device paths, browser and native publishers, Twitch/Kick context, and authenticated OBS start/stop/scene control around the home studio. It also accepts compatible SRT/RTMP encoders. If you already have a relay and remote control setup you love, you may not need VISP.
```

**“Does it bond cellular connections?”**

```text
No. VISP currently uses SRT resilience but does not implement SRTLA or connection bonding. If bonding is a requirement, use a tool built for it; I do not want to imply otherwise.
```

**“Is it really self-hosted?”**

```text
The full server, portal, clients, OBS plugin, and deployment templates are in the GPL-2.0 repository. The hosted beta at visp-stream.com is the easiest way to test it; self-hosting currently assumes a two-host deployment and is aimed at technical operators.
```

**“Do you get my Twitch/Kick stream key?”**

```text
No. OBS keeps the platform stream key. VISP authenticates the camera-to-relay path and sends remote control commands to the paired OBS plugin; it does not configure or store the provider broadcast key.
```

**“What happens when mobile data drops?”**

```text
The phone source reconnects. OBS can remain live on a fallback scene, so the destination broadcast does not have to end just because the camera source disappears briefly. VISP does not promise that the camera feed itself never drops.
```

## 4. Proof-video system

One real recording can supply X, Instagram, TikTok, YouTube Shorts, Reddit, Product Hunt, and the landing page. Export clean masters, then upload separately to each platform so no platform watermark is present.

### Hero proof video: 35 seconds

Shoot vertically in 1080×1920, but keep critical text in a central safe area that can also crop to square/landscape.

| Time | Visual | On-screen text / voice |
| --- | --- | --- |
| 0–2s | Split screen: phone outside, OBS at home | “What if your phone was just another OBS camera?” |
| 2–7s | Tap Go Live; OBS source appears | “VISP sends it home.” |
| 7–13s | Second phone appears as another scene/source | “Two phones. Two mics. One production.” |
| 13–19s | Switch OBS scene from phone | “Control OBS from the field.” |
| 19–26s | Toggle network off; OBS shows fallback; reconnect | “Signal dip? OBS stays live.” |
| 26–31s | Show chat and stream-info sheet | “Twitch + Kick chat and controls.” |
| 31–35s | Product mark and URL | “VISP — free during beta.” |

Caption burned into video: “Fallback keeps the OBS broadcast live; VISP does not bond networks or guarantee an uninterrupted camera feed.” This prevents the visual shorthand from becoming an inflated claim.

### Six repeatable short-video concepts

1. **The cable test:** walk out of Wi-Fi range while OBS stays on fallback, then show the camera return.
2. **Two old phones:** turn two spare phones into two OBS angles with separate audio meters.
3. **Friend cam:** send a trusted friend the setup route and bring their remote camera into a scene.
4. **Stream key stays home:** visually show OBS holding the destination configuration while VISP only supplies a media source.
5. **Wrist control:** show the Apple Watch scene list and a scene change, only when that client is publicly accessible.
6. **The honest comparison:** “Moblin/IRL Pro vs VISP: encoder app versus an integrated relay/control workflow.” Give credit and name cases where the established tool is the better choice.

## 5. X, Threads, and Bluesky

X's own organic guidance recommends concise copy, a clear CTA, media, and only one or two hashtags. Threads and Bluesky can use the same idea but should receive a native rewrite, not identical automated blasts.

### Profile

**Name:** `VISP — remote cameras for OBS`

**Bio:**

```text
Your phone is the camera. Your OBS setup stays the studio. Remote multi-camera streaming for Twitch + Kick. Free beta · open source.
```

**Pinned post:**

```text
Your phone can leave the studio without your production leaving OBS.

VISP sends one or more phone cameras home to the scenes, alerts, and graphics you already built — with chat and remote OBS control in your hand.

Free during beta: https://visp-stream.com

[35-SECOND PROOF VIDEO]
```

### Launch thread

```text
1/ I built VISP because “stream from your phone” usually means giving up the OBS production you already spent years building.

VISP takes the opposite approach: the phone is a camera. OBS stays the studio.

[PROOF VIDEO]
```

```text
2/ A phone sends video + its own mic to OBS at home. Add a second phone and it becomes another real source, not a video-call window.
```

```text
3/ From the field you can follow Twitch/Kick chat, edit stream info, switch OBS scenes, and start or stop the broadcast through a paired plugin.

The OBS machine opens no inbound control port.
```

```text
4/ Honest limits: no network bonding, transcoding, hosted OBS, or magic zero-drop claim. The workflow keeps OBS live on a fallback while a phone source reconnects.
```

```text
5/ The hosted beta is free, there is no credit card, and the full project is GPL-2.0.

Try it: https://visp-stream.com
Source: https://github.com/JoniJuntto/visp

I want feedback from creators who already use OBS for IRL or remote productions.
```

### Standalone X posts

```text
The most expensive part of an IRL setup is often not the phone.

It is rebuilding everything your home OBS already does.

So don't rebuild it. Send the camera home.

[VIDEO]
```

```text
Two spare phones.
Two camera angles.
Two microphones.
One OBS production at home.

[VIDEO]
```

```text
Your Twitch/Kick stream key should stay where it already works: in OBS.

VISP authenticates the camera feed and remote controls OBS. It never needs the destination stream key.

[DIAGRAM OR VIDEO]
```

```text
What should happen when an IRL camera loses signal?

Our answer: OBS stays live on a fallback, the phone reconnects, and the show returns.

Not “zero drops.” A recovery workflow you can actually see.

[DEMO]
```

```text
I need 5 OBS streamers to try breaking VISP.

Test one phone from a different network, switch a scene remotely, walk through a dead zone, and tell me the first step that felt unsafe or confusing.

Free beta: https://visp-stream.com
```

```text
Built in public: VISP is now GPL-2.0.

Server, relay integration, web portal, mobile clients, OBS plugin, and deployment templates:
https://github.com/JoniJuntto/visp

The sharp edges are documented too.
```

## 6. Instagram, TikTok, Facebook Reels, and YouTube Shorts

Upload original files to every platform. Instagram says materially unoriginal/repurposed content may not be recommended, and YouTube treats URLs in Shorts descriptions and comments as non-clickable. Put the VISP link in each profile and, on YouTube, add it as a channel profile link or use a related long-form video.

### Reel/Short caption 1: hero demo

```text
Your phone is the camera. Your OBS setup stays the studio.

VISP sends multiple phone feeds into the scenes, alerts, and graphics you already built — then puts Twitch/Kick chat and OBS scene control back in your hand.

Free during beta. Link in bio.

#IRLStreaming #OBSStudio
```

### Reel/Short caption 2: two phones

```text
The spare phone in your drawer could be a second live camera with its own mic.

This is two phones feeding one home OBS production through VISP. No video-call layout. They arrive as real sources.

Would you use the second angle for a friend cam, backstage, or a wide shot?

#LiveStreaming #OBSStudio
```

### Reel/Short caption 3: failure test

```text
We turned the phone's connection off on purpose.

The camera vanished. OBS stayed live on a fallback. The phone reconnected and the scene returned.

That is the honest goal: graceful recovery, not a fake “never drops” promise.

VISP is free during beta. Link in bio.

#IRLStreaming #TwitchStreamer
```

### 15-second script

```text
[0–2s] “You don't need to rebuild your stream on a phone.”
[2–6s] Show phone feed appearing in OBS: “Send the camera to OBS at home.”
[6–10s] Switch scenes from phone: “Keep your scenes, alerts, and control.”
[10–13s] Show second phone: “Add another phone when you need it.”
[13–15s] “VISP. Free beta. Link in bio.”
```

### 45-second educational script

```text
Hook: “How do IRL streamers keep OBS at home when the camera is outside?”

Body: “The phone does not have to send directly to Twitch or Kick. It can send an SRT feed to a relay, and OBS reads that feed as a media source. OBS still owns the destination stream, scenes, alerts, and graphics. VISP packages that workflow with device credentials, phone and browser publishers, chat, and remote OBS controls.”

Limit: “This does not bond mobile connections or make dead zones disappear. A fallback scene keeps the destination broadcast alive while the camera reconnects.”

CTA: “I am testing VISP free with OBS creators now. Link in bio.”
```

### YouTube long-form video

**Title:**

```text
How to send a phone camera to OBS from anywhere (VISP beta setup)
```

**Thumbnail text:** `PHONE → OBS, ANYWHERE`

**Outline:**

1. Show the completed workflow in the first 20 seconds.
2. Explain what VISP does and does not do.
3. Sign in and create/choose a publishing device.
4. Import/add the OBS media source.
5. Publish from browser, iPhone, or Android.
6. Add a second phone.
7. Pair the OBS plugin and switch scenes.
8. Demonstrate fallback and reconnection.
9. Cover latency and network expectations.
10. Link the product, docs, and repository in the description.

**Description:**

```text
VISP turns one or more phones into remote camera sources for an OBS production running at home. This walkthrough covers setup, a second camera, Twitch/Kick controls, remote scene switching, and reconnect behavior.

Try the free beta: https://visp-stream.com/?utm_source=youtube&utm_medium=organic&utm_campaign=beta_launch&utm_content=setup_video
Docs: https://docs.visp-stream.com
Source: https://github.com/JoniJuntto/visp

VISP does not bond network connections, transcode video, host OBS, or handle your Twitch/Kick stream key.
```

## 7. Product and developer launch channels

### Product Hunt

Product Hunt currently features live products, not waitlists, and asks for a direct product URL, a short tagline, a 260-character description, a square thumbnail, at least two gallery images, and a maker comment. Launch only when public access and proof assets are ready.

**Name:** `VISP`

**Tagline:**

```text
Turn phones into remote cameras for your home OBS studio
```

**Description (under 260 characters):**

```text
Send one or more phone cameras to the OBS production you already built. Keep scenes, alerts, chat, and remote OBS control while streaming away from home. Free during beta and open source.
```

**Topics:** `Live Streaming`, `Creator Tools`, `Open Source`

**Pricing:** `Free`

**Maker comment:**

```text
Hi Product Hunt — I built VISP because mobile streaming tools often make creators replace the OBS production they already know.

VISP treats a phone as a remote camera instead. OBS at home keeps handling scenes, alerts, graphics, and the final Twitch/Kick broadcast. VISP adds multiple phone feeds, per-device credentials, chat and stream-info controls, and authenticated scene/start/stop control through an OBS plugin.

The beta is free and the full project is GPL-2.0. Its current limits are intentional and public: no network bonding, transcoding, hosted OBS, or provider stream-key storage.

I would especially like feedback from creators who already have an IRL or remote-production workflow: what would make you trust—or reject—this setup for a real stream?
```

Gallery assets:

1. Phone-to-relay-to-home-OBS workflow diagram.
2. Phone camera screen with floating chat.
3. OBS showing two VISP sources.
4. Remote scene selector.
5. Honest comparison/limits card.

### Hacker News

HN's current rules prohibit generated or AI-edited text. Do not paste any copy from this document into HN. Write the submission and first comment yourself. A Show HN must be something readers can actually try, ideally with minimal signup friction, and vote solicitation is prohibited.

Personal outline to write from:

- Title fact: you built a self-hosted SRT/RTMP relay plus phone clients and an outbound-polling OBS control plugin.
- Motivation: retain home OBS production while camera operators are remote.
- Interesting engineering: connection-establishment auth, active-stream survival during app outage, encrypted plus hashed publishing credentials, MediaMTX hooks/reconciliation, browser WHIP, and no inbound OBS port.
- Live demo/repository links.
- Non-goals and operational limits.
- One technical question you genuinely want discussed.

### OBS Resources

This is more important than advertising in r/obs. Create an OBS forum account, enable 2FA, wait for the new-account restriction to clear, and submit the plugin through **Resources → Add Resource → OBS Studio Plugins**. New resources are reviewed.

**Resource title:** `VISP Remote Control`

**Tagline:**

```text
Authenticated remote start, stop, and scene switching for VISP phone and web clients
```

**Description:**

```text
VISP Remote Control pairs OBS Studio 31 with a VISP server so an authenticated web or phone client can start or stop streaming and switch scenes remotely.

The plugin makes one outbound HTTPS poll every two seconds. It opens no inbound port and does not expose OBS WebSocket to the public internet. Pairing uses a random one-time token; the server stores only its SHA-256 hash, and rotation invalidates previous pairings.

VISP never receives or configures the streaming-service key already stored in OBS.

Platforms: Windows, macOS, Ubuntu
License: GPL-2.0
Source: https://github.com/JoniJuntto/visp
Documentation: https://docs.visp-stream.com/docs/obs-remote-control
```

### GitHub repository launch hygiene

Before driving developer traffic:

- Add a real screenshot or short demo GIF above the architecture section.
- Add `topics` such as `obs-studio`, `srt`, `rtmp`, `mediamtx`, `twitch`, `kick`, `irl-streaming`, and `expo` in GitHub repository settings.
- Add a concise “Who this is for / not for” section.
- Enable Discussions with `Show and tell`, `Help`, and `Ideas` categories.
- Create issue templates for bug reports and beta feedback.
- Publish checksums and supported-platform notes prominently in each release.
- Link the hosted beta and docs in the repository About fields.

### Directory listings

After public client access is stable, submit one accurate listing to AlternativeTo and relevant app directories. Position VISP as an alternative/complement to hosted IRL relay workflows, not falsely as a drop-in replacement for a mobile encoder. Use the same limitations and open-source disclosure.

## 8. Creator partnerships, Discord, and direct outreach

Five hands-on creators will teach more than fifty low-context launch posts. Recruit people who already show OBS scenes or IRL setup tutorials, especially creators with 1k–50k followers whose audience asks technical questions.

Do not scrape emails, mass-DM Discord members, or enter communities only to drop a link. Contact public business addresses or ask moderators where tool demos belong.

### Creator outreach email

**Subject:** `Could I set up a free remote phone camera for your OBS show?`

```text
Hi [NAME],

I liked your [SPECIFIC STREAM/VIDEO], especially [REAL DETAIL]. You already use OBS in a way VISP is built around: the studio stays at home while the camera can move.

VISP sends one or more phone cameras into an existing OBS production and adds Twitch/Kick chat plus remote scene/start/stop control. It is free during beta and open source. It does not bond connections or host OBS.

Could I personally help you set up one test source and stay available during a private 20-minute trial? I am looking for blunt workflow feedback, not a guaranteed post. If it is useful and you later choose to show it, I can give your audience free beta access; there is no affiliate arrangement.

35-second proof: [VIDEO]
Product: https://visp-stream.com
Source: https://github.com/JoniJuntto/visp

Thanks,
Joni
```

### Discord moderator request

```text
Hi — I built a free/open-source phone-to-OBS relay and remote-control tool called VISP. I do not want to drop an unsolicited product link. Is there a channel or scheduled showcase where a transparent 30-second demo and request for technical beta feedback would be welcome? If not, no problem.
```

### Beta tester follow-up

Send after a completed test, not immediately after signup:

```text
Thanks for testing VISP. Four short answers would help:

1. How many minutes until the phone first appeared in OBS?
2. Which step was least clear?
3. What failed or felt unsafe?
4. Would you use it on a real stream? Why or why not?

If the test worked, may I quote your answer with your name/channel? “No” is completely fine.
```

## 9. LinkedIn and Facebook groups

LinkedIn is secondary for creator acquisition but useful for local production, broadcast engineering, and open-source credibility.

### LinkedIn post

```text
I have released VISP, an open-source remote-camera and OBS control workflow for live production.

The problem is simple: a creator wants to take a camera into the field but keep the scenes, graphics, alerts, and destination stream running in OBS at home.

VISP sends phone or browser camera feeds through an SRT/RTMP/WebRTC relay to OBS, gives each publishing device revocable credentials, and lets an authenticated phone control OBS scenes and start/stop state through an outbound-only plugin.

The hosted beta is free. The full system is GPL-2.0.

It is intentionally not a transcoder, bonded uplink, or cloud OBS service. I am looking for broadcasters and small production teams willing to test the first-run workflow.

Demo: [VIDEO]
Product: https://visp-stream.com
Source: https://github.com/JoniJuntto/visp
```

For Facebook groups, ask an admin before posting. Use a native demo video and a local-production use case (“two phones at a community event feeding the OBS operator”), not the generic launch copy.

## 10. Thirty-day execution calendar

The same proof event should create several pieces of content. Do not invent a new campaign every day.

| Day | Action | Asset / outcome |
| ---: | --- | --- |
| 1 | Replace homepage placeholder and add docs/GitHub/privacy/client routes | Trustworthy landing page |
| 2 | Recruit one friendly but non-builder tester | Observe setup silently |
| 3 | Fix the largest setup failure | Better activation |
| 4 | Record hero proof video | Master clip |
| 5 | Cut 35s, 15s, square GIF, and screenshots | Cross-platform pack |
| 6 | Set up profiles, bios, UTM links, and analytics | Measurement ready |
| 7 | Comment usefully in target Reddit communities | Account/community context |
| 8 | Post structured r/BetaTests request | 3–5 testers |
| 9 | Publish X launch thread | Proof-led awareness |
| 10 | Publish hero Reel/TikTok/Short separately | Discovery |
| 11 | Personally onboard testers | Activation |
| 12 | Publish “two phones” clip | Feature proof |
| 13 | Ask relevant subreddit/Discord moderators for permission | Safe access |
| 14 | Publish r/IRLstreaming post if participation/rules allow | Qualified discussion |
| 15 | Publish the long YouTube setup guide | Searchable proof/support |
| 16 | Submit OBS plugin resource | Durable trusted discovery |
| 17 | Publish failure/reconnect test | Credibility |
| 18 | Post in r/selfhosted New Project Megathread | Technical users |
| 19 | Fix the most repeated beta issue | Product improvement |
| 20 | Publish r/SideProject build story | Builder audience |
| 21 | Collect permissioned tester quote/clip | Social proof |
| 22 | Publish one case study: setup time, use case, failure found | Evidence |
| 23 | Contact five carefully selected creators | Partnership pipeline |
| 24 | Publish security/stream-key explainer | Objection handling |
| 25 | Prepare Product Hunt gallery and draft | Launch readiness |
| 26 | Publish second educational Short | Search/discovery |
| 27 | Follow up with activated testers, not all signups | Retention |
| 28 | Launch Product Hunt only if access/proof gates are met | Product discovery |
| 29 | Publish transparent 30-day numbers and lessons | Build trust |
| 30 | Review funnel and keep only the two channels producing activated streamers | Focus |

### Weekly content cadence after launch

- 2 proof videos: a real workflow or failure test.
- 1 educational piece: SRT, OBS fallback, remote production, or credential safety.
- 1 user story or public build update.
- 10–15 substantive replies to streamer questions with no forced product mention.
- 5 targeted creator conversations.

## 11. Experiments and decision rules

Test one variable at a time:

1. Hook A: “phone is a camera” vs. Hook B: “leave the desk without leaving OBS.”
2. Creator demo vs. clean product animation. Expect the real demo to win.
3. CTA “try free” vs. “test it with me.” During beta, the assisted-test CTA may produce fewer but better users.
4. IRL creator audience vs. small-event production audience.

Keep a channel only if it produces one of these within 30 days:

- two activated broadcasters;
- one creator partnership with a relevant audience;
- one durable high-intent listing or tutorial that continues sending qualified traffic.

Stop posting where there are impressions but no setups. Do not compensate with more frequency.

## 12. Research sources

Product and competitors:

- VISP live product: https://visp-stream.com
- VISP documentation: https://docs.visp-stream.com
- VISP repository: https://github.com/JoniJuntto/visp
- OBS mobile streaming apps: https://obsproject.com/kb/mobile-streaming-apps
- Moblin App Store listing: https://apps.apple.com/us/app/moblin/id6466745933

Reddit rules and current policy:

- r/obs rules: https://www.reddit.com/r/obs/about/rules
- r/IRLstreaming rules: https://www.reddit.com/r/IRLstreaming/about/rules
- r/KickStreaming rules: https://www.reddit.com/r/KickStreaming/about/rules
- r/streaming rules: https://www.reddit.com/r/streaming/about/rules
- r/selfhosted rules: https://www.reddit.com/r/selfhosted/about/rules
- r/opensource rules: https://www.reddit.com/r/opensource/about/rules
- r/BetaTests rules: https://www.reddit.com/r/BetaTests/about/rules
- r/androidapps rules: https://www.reddit.com/r/androidapps/about/rules
- r/droidappshowcase rules: https://www.reddit.com/r/droidappshowcase/about/rules
- r/iOSApps rules: https://www.reddit.com/r/iOSApps/about/rules
- r/Twitch July 2026 tool-promotion change: https://www.reddit.com/r/Twitch/comments/1uy704w/rtwitch_upcoming_rule_change_for_app_tool_service/
- Reddit organic playbook: https://redditinc.com/hubfs/Reddit%20Inc/Content/Reddit%20Pros%20organic%20playbook.pdf

Platform guidance:

- X organic best practices: https://business.x.com/en/basics/organic-best-practices
- Instagram creator best-practices hub: https://about.fb.com/news/2024/10/best-practices-education-hub-creators-instagram/
- Instagram recommendations: https://www.facebook.com/help/instagram/313829416281232
- TikTok organic playbook: https://ads.tiktok.com/business/library/Organic_Playbook.pdf
- YouTube Shorts overview: https://support.google.com/youtube/answer/10059070
- YouTube link behavior: https://support.google.com/youtube/answer/13748639
- Product Hunt posting guide: https://help.producthunt.com/en/articles/479557-how-to-post-a-product
- Product Hunt featuring criteria: https://help.producthunt.com/en/articles/9883485-product-hunt-featuring-guidelines
- Show HN guidelines: https://news.ycombinator.com/showhn.html
- Hacker News guidelines: https://news.ycombinator.com/newsguidelines.html
- OBS resource submission: https://obsproject.com/forum/threads/how-to-post-a-plugin-read-here.23124/

