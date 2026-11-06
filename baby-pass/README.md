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

## Status: draft

The site is shared by link for partner review and is not public until launch.
Every page carries `noindex`, and the staff page has a DRAFT ribbon. Items still
waiting on IDOH carry a yellow **Pending** tag on the page, so reviewers can see
what is unconfirmed.

## Deploy

This folder lives in the shared `resource-center` repo, next to `ddpp/`.

In Netlify: Add new site > Import an existing project > GitHub, pick the
`resource-center` repo, and set **Base directory** to `baby-pass`. Leave the
rest alone: Netlify reads this folder's `netlify.toml`. Rename the site to
something like `baby-pass` so the URL is `baby-pass.netlify.app`.

## Embedding on modcollective.org

Live at `https://babypass.netlify.app`. Each page goes on its own MOD page,
pasted once into an Elementor HTML widget:

| Snippet | Page |
|---|---|
| `embed-snippet-staff.html` | Staff resource center |
| `embed-snippet-enroll.html` | Enrollment |
| `embed-snippet-families.html` | Family guide |

Each snippet's comment has the Elementor settings (Canvas template, zero
padding). The pages report their height to the snippet, so the frame always
fits with no inner scrollbar, and in-page links scroll the MOD page.

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

Until a feed exists they show "not connected yet". Add `?sample` to the URL to
see them with sample numbers, which are labelled SAMPLE on the page.

When the forms are live, a Feed tab in the enrollment workbook should hold
exactly this, and nothing else:

```
benefit,enrolled,cap,label,updated
diapers,212,500,children enrolled,2026-11-02T10:20:28-05:00
car_seats,431,1200,families enrolled,2026-11-02T10:20:28-05:00
```

Publish **only** that tab (File > Share > Publish to web > Feed > CSV), then
set its URL as `BP_FEED_URL` in Netlify's environment variables. Never publish
the entire document: the log tabs hold family information.

`enrolled` should count approved enrollments, not form submissions, because
a submission can still be declined afterward (a duplicate household, or a full benefit). Where approvals are recorded decides how the
Apps Script that fills the Feed tab gets written.

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

## At launch

1. Remove `X-Robots-Tag` from `netlify.toml`, and delete `robots.txt`.
2. Remove the `noindex` meta tags from both pages, and the DRAFT ribbon.
3. Confirm no Pending tags are left on either page.
4. Get written sign-off from each partner on the final pages, for the grant record.

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
