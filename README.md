# MOD Resource Centers

One repo, one folder per program. Each folder is its own Netlify site.

| Folder | Program | Audience |
|---|---|---|
| `ddpp/` | Diaper Dollars (Illinois DDPP) | Site staff, and enrolled families |
| `baby-pass/` | BABY PASS (Indiana) | MOMS Helpline staff, and enrolled families |

Each folder's own README covers its pages, its counter, and what not to change.

## How Netlify builds these

Every site points at this repo with a different **base directory**. Netlify
reads the `netlify.toml` inside that folder, so publish and function paths
there stay relative to the folder.

| Netlify site | Base directory |
|---|---|
| DDPP | `ddpp` |
| BABY PASS | `baby-pass` |

To keep a push to one program from rebuilding the other, set **Build
settings > Ignore builds** on each site to:

```
git diff --quiet $CACHED_COMMIT_REF $COMMIT_REF -- .
```

That command runs inside the base directory, so it skips the build when
nothing in that folder changed.

## Adding another program

Make a new top-level folder with its own `netlify.toml`, then add a Netlify
site with that folder as its base directory.
