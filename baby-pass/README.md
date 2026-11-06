# BABY PASS Resource Center

Two pages for Indiana's diaper and car seat benefit pilot, hosted on Netlify.

```
index.html                     staff page, for MOMS Helpline Communication Specialists
enroll.html                    enrollment page: counters and the Jotform embedded
families.html                  family guide, English and Spanish, sent after enrollment
netlify/functions/count.mjs    the two live counters, read from a published sheet
netlify.toml                   config; keeps the site out of search until launch
robots.txt                     same, for crawlers that ignore headers
img/                           logos cleaned from the brand package, and the favicon
card/                          eCard art for IQPay (not served by the site)
```

Built on the same pattern as the Diaper Dollars resource center: static pages,
one serverless function, no credentials anywhere.

## Status: live

Launched November 6, 2026 on modcollective.org (see the embedding table
below). The Netlify site stays out of search on purpose: the public addresses
are the MOD pages, and the staff pages shouldn't be searchable. Set noindex on
the three staff MOD pages in WordPress too.

## Deploy

This folder lives in the shared `resource-center` repo, next to `ddpp/`.

In Netlify: Add new site > Import an existing project > GitHub, pick the
`resource-center` repo, and set **Base directory** to `baby-pass`. Leave the
rest alone: Netlify reads this folder's `netlify.toml`. Rename the site to
something like `baby-pass` so the URL is `baby-pass.netlify.app`.

## Embedding on modcollective.org

`/babypass` is the public BABY PASS info page on modcollective.org. Each page
here goes on its own top-level MOD page (slug `babypass-...`), pasted once into
an Elementor HTML widget:

| Snippet | MOD page | Who |
|---|---|---|
| `embed-snippet-client.html` | modcollective.org/babypass-client/ | Families. On the card, in IQPay's resource link, and in the welcome text, so the slug never changes after launch |
| `embed-snippet-staff.html` | modcollective.org/babypass-staff/ | MOMS Helpline staff |
| `embed-snippet-enroll.html` | modcollective.org/babypass-enroll/ | Staff, on calls |
| `embed-snippet-training.html` | modcollective.org/babypass-training/ | Staff, before they enroll anyone |

Keep the three staff pages out of the site menu and set them to noindex.
Each snippet's comment has the Elementor settings (Canvas template, zero
padding). The pages report their height to the snippet, so the frame always
fits with no inner scrollbar, and in-page links scroll the MOD page.

The buttons between the staff pages always go to the MOD addresses above,
even when a page is opened straight from Netlify (`BP_PAGES` in `index.html`,
`enroll.html`, `training.html`; change all three together).

The enrollment page sizes the Jotform frame itself rather than loading
Jotform's embed handler script, which throws once the page is framed on
another domain.

## Things to fill in

| What | Where |
|---|---|
| Enrollment form | Embedded in `enroll.html` (Jotform 262915028133150). If the form is replaced, change the ID in the iframe, the two script lines below it, and the fallback link |
| Training check link (Jotform) | `BP_TRAINING_URL`, same place |
| IDOH, MOMS Helpline, MOD logos (optional) | `.partners` in every footer. Text links for now |
| Spanish review by a native speaker | `#content-es` in `families.html` |

Setting a link turns its button on. Until then the buttons read "link coming"
and do nothing.

## Confirmed by IDOH (November 5, 2026)

Nothing is Pending. If a new open item comes up, tag it on the page and list it here.

- **Eligibility:** pilot ZIP, plus SNAP, WIC, Medicaid, or home visiting, plus a
  child under 3, plus the family says they need the benefit (the specialist's
  judgment). The evaluation questions (six diaper, D1-D6, and six car seat,
  C1-C6, as revised in late October 2026) are baseline only. They never decide
  eligibility, so there is no cut score to keep off the page.
- **A completed enrollment means the family is in** (Brendan, Nov 6). Only the
  eligibility questions gate (pilot ZIP, a qualifying program, child under 3,
  a benefit selected). The last step is the family replying YES to the BABY PASS
  text, which verifies their phone number with MOD Collective.
- **The live enrollment form is the source of truth** for question wording and
  page order (Brendan, Nov 6). If the page and the form disagree, fix the page.
- **The enrollment form blocks submission** for a family who doesn't qualify, or
  who says no to any consent question. Every submission is an application and
  starts the automated workflow. Staff refer ineligible families to WIC, home
  visiting, and the Indiana Diaper Bank.
- **One car seat benefit per family.** It's $100, used within 90 days.
- **Consent is a checklist, not a script.** Staff cover four points (sharing,
  texts, one application, it's true) in their own words, then answer Yes for
  each on the form. The details are on the page and in `BABY PASS/BABY_PASS_Consent_Script.md` in
  the FY27 folder. Change both together.
- **Staff questions** go to support@modcollective.org or 463-837-1840.

## The counters

The staff page shows two counters: diapers in **children** (limit 500) and car
seats in **families** (limit 1,200). The units are different on purpose.

They are live (connected November 6, 2026). The numbers come from the **Feed**
tab of the `IN FY27 BABY PASS - Enrollment` Google Sheet, which is published
on its own as CSV. Only that tab is published; the form responses are not.
The link is in `netlify/functions/count.mjs` (`BP_FEED_URL` in Netlify
overrides it). Add `?sample` to a page URL to see sample numbers, labelled
SAMPLE.

The Feed tab holds exactly this, computed by formulas from the Form responses
tab:

```
benefit,enrolled,cap,label,updated
diapers,<children>,500,children enrolled,<latest submission>
car_seats,<families>,1200,families enrolled,<latest submission>
```

- **diapers**: the sum of the number in "How many eligible children..." on
  rows where "Is the client enrolling for diapers?" is Yes.
- **car_seats**: rows where "Is the client enrolling for a car seat?" is Yes.
- Rows whose Staff Email starts with `test@` are skipped.
- The formulas use columns D (car seat), E (children), F (diapers). If the
  form's columns move, fix the formulas.

Google and the function each cache for 5 minutes, so a new enrollment can take
up to about 10 minutes to show. Never publish the entire document.

## Brand rules the pages follow

- **BABY PASS**: two words, all caps, everywhere.
- BABY PASS leads. Partner marks sit in the footer, below the unity bar
  (blue, teal, red), which appears once per page and nowhere else.
- The teal accent carries more weight on the staff page, since the teal mark
  is approved for Helpline-facing training. The family page is mostly blue.
- The payment platform and the operations contractor are not named.
- Teal `#149A9A` and red `#FF4440` fail contrast as body text on white, so text
  uses darker versions (`#0C6B6B`, `#B3261E`) and the brand values are kept for
  fills and the unity bar.
- No brand font was supplied. Both pages use Nunito, a rounded sans that sits
  well next to the wordmark. Swap it in the `<link>` and `--font` if the
  designer specifies one.

The white logo SVGs in the brand package have a dark rectangle baked in behind
the artwork. The copies in `img/` have it removed and are cropped to the art.

## The card art

`card/` holds the eCard design to send to IQPay:

| File | Use |
|---|---|
| `baby-pass-card-art.svg` / `.png` | Production art. CR80 (3.375 x 2.125 in) plus 1/16 in bleed, 300 dpi |
| `baby-pass-card-guides.svg` / `.png` | The same art with trim, safe zone, and where the number, name, and network mark go |
| `baby-pass-card-mockup.png` | How it looks to a family, with a sample masked number |

IQPay adds the card number, name, and network mark itself. Ask for their art
spec; the SVG scales to any size they need. The card folder is blocked from
the public site in `netlify.toml`.

## Launch record

- November 6, 2026: DRAFT ribbon removed; the four MOD pages live.
- Still to do: native-speaker review of the Spanish family guide
  (`#content-es` in `families.html`), and written partner sign-off on the
  final pages for the grant record.

## The training page

`training.html` frames the BABY PASS staff training, which runs on the MOD
Training Engine (a Google Apps Script web app; source in `training-engine/`
in the FY27 folder, course file `courses/baby-pass.json`). The "Take the
training check" buttons on the staff page link here (`BP_TRAINING_URL`).

Training content changes happen in the engine, not in this repo. The frame
URL ends in `&embed=1`, which hides the training's own logo bar because this
page already carries the header. The frame sizes itself from the training's
`modTrainingHeight` messages, and passes its own height up to modcollective.org
the same way the other pages do.
