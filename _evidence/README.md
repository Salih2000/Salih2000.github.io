# Evidence log

Dated, third-party records of what this site published and when. Jekyll skips folders that start with an underscore, so nothing here is published on the site. Git keeps these files byte for byte (see `.gitattributes`), so the timestamps below keep verifying.

## 23 November 2026: AI training reservation

robots.txt now disallows the crawlers that collect text for training AI models (`__usage_ai-training`, GPTBot, ClaudeBot, CCBot, Applebot-Extended, Meta-ExternalAgent, Bytespider). Search engines, answer engines and Google-Extended stay allowed. Text and data mining rights are reserved under Article 4(3) of EU Directive 2019/790. ai.txt and llms.txt say the same.

- **Commits:** `3d7698e9` published the reservation. The deploy workflow skipped `.txt` changes at the time, so it was deployed by hand at about 08:11 UTC. `61de8f9d` moved the training group to the top of robots.txt and fixed the workflow. Git tag: `ai-reservation-2026-11-23`.
- **Software Heritage save requests** for the repository: 2682339 (08:01 UTC, before the change) and 2682361 (08:15 UTC, after).

### Wayback Machine, before the change (08:01–08:07 UTC)

| Page             | Capture                                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------------------------- |
| robots.txt       | https://web.archive.org/web/20261123080135/https://salihkilic.net/robots.txt                             |
| llms.txt         | https://web.archive.org/web/20261123080154/https://salihkilic.net/llms.txt                               |
| ai.txt           | https://web.archive.org/web/20261123080213/https://salihkilic.net/.well-known/ai.txt                     |
| Home (EN)        | https://web.archive.org/web/20261123080239/https://salihkilic.net/                                       |
| Home (TR)        | https://web.archive.org/web/20261123080311/https://salihkilic.net/tr-tur/                                |
| CV (EN)          | https://web.archive.org/web/20261123080342/https://salihkilic.net/cv/                                    |
| CV (TR)          | https://web.archive.org/web/20261123080413/https://salihkilic.net/tr-tur/cv/                             |
| MinIO post (EN)  | https://web.archive.org/web/20261123080511/https://salihkilic.net/blog/2026/replacing-minio/             |
| MinIO post (TR)  | https://web.archive.org/web/20261123080546/https://salihkilic.net/tr-tur/blog/2026/replacing-minio/      |
| Jekyll post (EN) | https://web.archive.org/web/20261123080616/https://salihkilic.net/blog/2026/neden-jekyll-tasidim/        |
| Jekyll post (TR) | https://web.archive.org/web/20261123080714/https://salihkilic.net/tr-tur/blog/2026/neden-jekyll-tasidim/ |

### Wayback Machine, after the change (08:15–08:16 UTC)

The plain addresses had just been captured, so the Wayback Machine returned the earlier captures. These were saved with a query string to force a new capture; the content is the same file.

| Page       | Capture                                                                                                     |
| ---------- | ----------------------------------------------------------------------------------------------------------- |
| robots.txt | https://web.archive.org/web/20261123081553/https://salihkilic.net/robots.txt?reservation=2026-11-23         |
| llms.txt   | https://web.archive.org/web/20261123081612/https://salihkilic.net/llms.txt?reservation=2026-11-23           |
| ai.txt     | https://web.archive.org/web/20261123081631/https://salihkilic.net/.well-known/ai.txt?reservation=2026-11-23 |

### Copies as served, with OpenTimestamps proofs

Each file was fetched from the live site at 08:16 UTC and its SHA-256 sent to the alice and bob OpenTimestamps calendars at 08:17–08:18 UTC. The proofs are pending until the calendars anchor them in a Bitcoin block (a few hours); after that, run `ots upgrade` on the `.ots` files and commit the result, then anyone can check them with `ots verify`.

| File                     | SHA-256                                                            |
| ------------------------ | ------------------------------------------------------------------ |
| `2026-11-23-robots.txt`  | `e6c7b073df5d5d39918ebfcd4dea0d372d21311d9b72838a95b194bf9a6ade08` |
| `2026-11-23-llms.txt`    | `cddec258fb747c760e64a63737b846ab0e329072a2dbcdc1da9b12667dc98b8e` |
| `2026-11-23-ai.txt`      | `bdc8a11785afe7c8da0c6b6cca5fb8aac73e8650c44795d0ff0fca30637edd3b` |
| `2026-11-23-commits.txt` | `2f4283f339e72e132f435fbdfa691a1d6cc2a83e0b4feb3d5129f0f34573009f` |
