---
layout: post
title: "Replacing MinIO: open source is a license, not a promise"
date: 2026-11-18 01:00:00+0300
description: MinIO's community edition was wound down step by step and its Docker images are gone. How I replaced it in a product that shipped with it, the MinIO alternatives I looked at, and what it taught me about open source.
tags: minio minio-alternatives s3 object-storage open-source agpl self-hosting dependencies
categories: engineering
related_posts: true
giscus_comments: true
og_image: https://salihkilic.net/assets/img/2026-11-14-minio-og-en-v2.png
toc:
  sidebar: left
---

In October, while planning the installation package of a product I work on, I wanted to check whether the container images the installer pulls could still be pulled from a machine that had never pulled them before. The other images came down fine, but for MinIO's two images the registry answered that no such image existed.

On my own computer everything had been working for months, because those two images were sitting in Docker's cache. Without my noticing, the product had become one that only ran on machines where it had already been installed.

These are the errors you get when you try to pull `minio/minio` from Docker Hub and `quay.io/minio/minio` from quay.io:

```text
Error response from daemon: pull access denied for minio, repository does not exist or may require authorization
unauthorized: access to the requested resource is not authorized
```

The first line is Docker Hub's error, taken from an issue in the [Milvus](https://github.com/milvus-io/milvus/issues/53430) project, and the second is quay.io's, taken from an issue in the [katta-compose](https://github.com/shift7-ch/katta-compose/issues/22) project.

If you have run into one of these errors too and want to see right away what you can do, you can jump straight to [What to do today if the MinIO image won't pull](#what-to-do-today-if-the-minio-image-wont-pull).

<!-- prettier-ignore-start -->
> ##### In short
>
> MinIO's community edition has been distributed as source code only since October 2025; it went into maintenance mode in December 2025, and its repository was archived in February 2026. In September 2026 the `minio/minio` images disappeared from Docker Hub, and the images on quay.io stopped serving anonymous pulls. The license is still AGPLv3, but the community edition no longer gets new releases, prebuilt images or security fixes. In the product I work on, I replaced MinIO with a small disk store behind the same five functions and kept S3 as an option. If you really do need an S3 server, further down I compare versitygw, Garage, SeaweedFS, RustFS, Ceph and the MinIO forks.
{: .block-tip }
<!-- prettier-ignore-end -->

## What the product used [MinIO](https://github.com/minio/minio) for

[MinIO](https://github.com/minio/minio) is an open-source object store that keeps files in containers called buckets instead of a folder tree and serves them over HTTP. Because it speaks the same interface as Amazon's cloud storage service S3, an application written for S3 could store its files in MinIO running on your own server without changing its code, and that is what made MinIO so widespread.

The product is an analytics application that organizations install on their own servers. When a user uploads a log file, the application keeps the original as it is, parses its content and writes the results to PostgreSQL. MinIO handled the first half of that job and held the original uploaded files.

A few years ago nobody would have questioned that choice. MinIO came up as a single container, it was free, and it appeared in almost every sample `docker-compose.yml` you could find. The application touched it through just five functions: upload, download, read as text, split into lines, and delete.

## What happened to MinIO, step by step

The source code is still on GitHub and its license is still AGPLv3, but maintenance, prebuilt binaries, container images, the admin console and security fixes disappeared one after another over a few years.

| Date             | What happened                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| :--------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| May 2021         | The server's license changed from Apache 2.0 to [AGPLv3](https://github.com/minio/minio/releases/tag/RELEASE.2021-05-11T23-27-41Z).                                                                                                                                                                                                                                                                                                                                                 |
| November 2024    | The company [announced AIStor](https://www.newswire.ca/news-releases/minio-releases-aistor-purpose-built-for-ai-and-data-workloads-862123650.html), its commercial product. The announcement presented it as a store built for AI and data workloads.                                                                                                                                                                                                                               |
| May 2025         | The administration functions were [removed](https://github.com/minio/minio/releases/tag/RELEASE.2025-05-24T17-08-30Z) from the community edition's web console; the release notes pointed to the commercial product for them.                                                                                                                                                                                                                                                       |
| October 2025     | The README said the community edition was now distributed [as source code only](https://github.com/minio/minio/commit/9e49d5e7a648f00e26f2246f4dc28e6b07f8c84a). The [security fix](https://github.com/minio/minio/releases/tag/RELEASE.2025-10-15T17-29-55Z) released the next day shipped without prebuilt binaries or an official image. It became the last community release.                                                                                                   |
| December 2025    | The README declared ["maintenance mode"](https://github.com/minio/minio/commit/27742d4694): no new features or contributions would be accepted.                                                                                                                                                                                                                                                                                                                                     |
| February 2026    | A notice that the repository was [no longer maintained](https://github.com/minio/minio/commit/7aac2a2c5b) was put at the top of the README, and the [repository](https://github.com/minio/minio) was archived the next day.                                                                                                                                                                                                                                                         |
| March–April 2026 | Seven [security advisories](https://github.com/minio/minio/security/advisories) affecting the community edition were published; none of them got a community release. The repository was briefly reopened in late April and archived again on 25 April, and GitHub now shows only that last date.                                                                                                                                                                                   |
| September 2026   | First the images [disappeared](https://github.com/milvus-io/milvus/issues/53430) from Docker Hub; the [last capture](https://web.archive.org/web/20260907043539/https://hub.docker.com/r/minio/minio) of the page, a few days before the removal, showed about 1.85 billion pulls. Then the images on quay.io [stopped](https://github.com/shift7-ch/katta-compose/issues/22) serving anonymous pulls. I could not find an announcement from MinIO about the removal of the images. |

{% include figure.liquid loading="lazy" path="assets/img/2026-11-14-minio-erosion-en.svg" class="img-fluid w-100" width="680" height="524" alt="A grid showing that the MinIO community edition's source code stayed in place while the admin console, new binaries and images, security fixes and the ability to pull old images were withdrawn one after another between 2025 and 2026" zoomable=true %}

<div class="caption">
    The source code stayed, while the parts that made it usable were withdrawn one after another between 2025 and 2026.
</div>

### Is "it went paid" accurate?

People who want to sum it up in one sentence say "MinIO went paid," but that sentence doesn't quite describe what happened. According to the company's [pricing page](https://www.min.io/pricing), the open-source edition has reached end of life and gets no more bug fixes or security patches. The page advises that edition's users to evaluate alternatives or to talk to the company about the commercial product.

That commercial product, [AIStor](https://www.min.io/product/aistor), also has a free tier, although that tier is not free in the free-software sense. Its [license agreement](https://www.min.io/legal/aistor-free-agreement) allows the software to run on a single node only, forbids distributing it to third parties, and the software does not run without a license file. There are paid tiers for those who want a distributed setup.

If you run the software by yourself on your own server, those terms may not bother you. In my case, however, the product carried MinIO to other organizations inside its installation package, and with a license that forbids redistribution I couldn't do that.

## What we missed on our side

My own part of the story is less flattering. Looking back through the repository history, I can see three separate warnings that we missed.

**The first:** MinIO was added to the product in April 2026. By then MinIO's repository had been archived for about two months, and its README said the repository was no longer maintained. Nobody looked, because the image pulled and everything worked.

**The second:** In mid-September, the `minio/minio:latest` image in the compose file could no longer be pulled. When I saw that the images were gone from Docker Hub, I pointed the reference to quay.io, pinned the version and even noted in the commit message that MinIO had moved its image distribution to quay.io. In other words, I had treated the symptom without ever asking why the image had disappeared.

**The third:** Eleven days later, the images on quay.io stopped serving anonymous pulls too. I didn't notice for a month, because thanks to my cache nothing broke.

<!-- prettier-ignore-start -->
> ##### TIP
>
> Add a small check that regularly tries to pull every image and package your installation needs from an environment with an empty cache. With such a check, I would have noticed this problem weeks earlier.
{: .block-tip }
<!-- prettier-ignore-end -->

Before I knew which solution I would choose, I exported the two cached images into a single archive file with `docker save`. From that moment, that 85 MB file was the most reliable way I had to reach the old data, because MinIO keeps files on disk in its own format. The program that can safely read them is MinIO itself, and that program could no longer be downloaded ready-made from its official locations.

## How I narrowed down the options

The rule I set for myself was simple. I would first look for an alternative that is free and genuinely open, and if nothing fit and the job wasn't large, I would build my own solution.

I judged the candidates on license and redistribution, on whether the image can be pulled without authentication, on maintenance, governance and the contributor agreement, on security advisories, on footprint, and on backup and migration. On the license, what mattered was whether I could hand the component to other organizations inside an installation package, because distributing an AGPL-licensed image brings an obligation to offer the source, and many organizations' open-source policies restrict AGPL.

I checked thirteen options one by one. The table below shows the main ones as they stood at the end of October 2026, and the conclusion I reached for my own need. If your need is different, your conclusion may be too.

| Option                                                                                                                                                                        | License                  | What I saw                                                                                                           | Outcome                   |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------- | :------------------------------------------------------------------------------------------------------------------- | :------------------------ |
| [AIStor Free](https://www.min.io/product/aistor)                                                                                                                              | Commercial (proprietary) | Every installation needs a license file, single node only, redistribution forbidden.                                 | Ruled out.                |
| MinIO forks ([PGSTY Silo](https://github.com/pgsty/silo), [Chainguard](https://www.chainguard.dev/unchained/fork-yeah-were-adding-ten-new-open-source-projects-to-emeritoss)) | AGPLv3                   | Security fixes continue; each depends on a single organization.                                                      | A temporary bridge only.  |
| [versitygw](https://github.com/versity/versitygw)                                                                                                                             | Apache 2.0               | A small S3 gateway that keeps objects as plain files on disk; it asks for no license assignment.                     | The best free server.     |
| [RustFS](https://github.com/rustfs/rustfs)                                                                                                                                    | Apache 2.0               | The new engine closest to MinIO; very young, and its contributor agreement lets the company relicense contributions. | Not chosen.               |
| [SeaweedFS](https://github.com/seaweedfs/seaweedfs)                                                                                                                           | Apache 2.0               | Very capable and made of many components; too wide a surface for a few GB of files.                                  | Not chosen.               |
| [Garage](https://garagehq.deuxfleurs.fr/)                                                                                                                                     | AGPLv3                   | Small and independent; its own documentation considers single-copy use fit for testing only.                         | Not chosen.               |
| [Ceph](https://ceph.io/en/)                                                                                                                                                   | LGPL                     | A cluster designed for real scale; too much for one server.                                                          | Out of scale.             |
| Keeping the files in PostgreSQL                                                                                                                                               | No new component         | One backup and transactional consistency; but every backup grows with the files.                                     | Not made the default.     |
| [My own disk store](#the-solution-removing-the-dependency-altogether)                                                                                                         | My own code              | A disk store of under 300 lines; no extra container, port or password.                                               | **This is what I chose.** |

## The solution: removing the dependency altogether

While comparing alternatives, I realized I had asked the real question late. Did I actually need an object store?

The product runs on a single server, as a single process; files are written once and never change, and the total size doesn't go beyond a few GB. Under those conditions the object store gave me nothing the file system doesn't already give, while it brought a separate container and a stream of security advisories to follow.

In the end, instead of replacing the dependency with another product, I removed it altogether. I did it in three steps by orchestrating AI agents:

- Behind the same five functions, I added a small store that keeps the files as plain files on a Docker volume. The disk store itself is under 300 lines, while the whole module, with the S3 backend, the cache and the error handling, is about a thousand.
- Instead of throwing away the existing S3 code, I reworked it into an optional second backend. An organization that has its own S3 store can have the files written there with a single setting.
- I didn't touch the layout of the file names or the pointer column in the database. That left nothing to migrate on the database side.

Underneath those five functions, the interface both stores implement looks roughly like this:

```python
class BlobStore(Protocol):
    def put(self, key: str, data: bytes) -> None: ...
    def get(self, key: str) -> bytes: ...
    def read_range(self, key: str, offset: int, length: int) -> bytes: ...
    def exists(self, key: str) -> bool: ...
    def delete(self, key: str) -> None: ...
```

{% include figure.liquid loading="lazy" path="assets/img/2026-11-14-minio-architecture-en.svg" class="img-fluid w-100" width="680" height="456" alt="Before: the application writes through a five-function S3 client to a MinIO container and its volume. After: the application writes through the same five-function store interface to a disk store by default, and optionally to the organization's own S3 store" zoomable=true %}

<div class="caption">
    The application uses the same five functions before and after the change.
</div>

"Writing to a plain file" sounds simple, but a few details the object store used to handle for you are now left to you:

- **Atomic writes:** I first write the file under a temporary name in the same folder, make sure it has reached the disk (`fsync`), then move it to its real name in one step. If the power goes out halfway, no half-written file is left behind.
- **Path safety:** The store accepts only keys in the form it generates itself, and it doesn't follow symbolic links. So no key can escape the store's folder.
- **Clear errors:** A missing file returns 404, a full disk 507, an unreachable S3 store 503. All of these used to be a meaningless 500.

The two defects that came up when the design was reviewed were just as instructive as those details:

1. **The delete order.** The old code deleted the file first and the database row afterwards, so if an error got in between, you were left with a record that had no file. I reversed the order, so the row's deletion is committed first and only then is the file removed. If an error gets in between now, the worst that can happen is an orphaned file on disk, which is far less harmful than a record without its file.
2. **Testing against a real S3 server.** Not every "S3-compatible" server behaves the same. For example, there is no guarantee that every server accepts the checksums the client library adds by default. So the S3 backend is tested against a real S3 server in CI on every change, and that behavior is configurable.

## The migration: keeping the way back open

With the new store written, I had one principle for moving the existing files, which was to take no step I couldn't come back from.

- The migration is a separate command that you run by hand. The application migrates nothing on its own at startup, and if it sees missing files, it only warns and names the command to run.
- The command starts with a dry run that shows how many files there are, how many bytes will be copied and whether there is enough room on the target.
- In the real run, every file is copied, read back from the target, and its sha256 digest is compared with the source's. The results go into a manifest file, and a separate verify command checks that manifest again.
- The command deletes nothing and never overwrites an existing file. Run a second time, it copies nothing.
- I rehearsed all of it on a throwaway copy of the installation first, and then ran it on my own.

The old MinIO volume, the image archive and the rollback steps are all still there, and they will stay for at least one release.

## What I gained, and what I took on

What I gained:

- The installation now pulls only images that anyone can pull.
- One service and one init job are gone; two ports and a pair of credentials went with them.
- The installation package shrank by 85 MB, and the containers' total memory limit dropped by 512 MB.
- The package no longer contains an AGPL-licensed component or a known vulnerability that security scans flag.
- A backup is one database dump plus one `tar` file.

What I took on:

- Durability details such as atomic writes, a full disk and path safety are my responsibility now.
- There is no ready-made S3 endpoint for other tools on the same machine.
- Existing installations have to run a one-time migration.

If the application has to run on more than one server, if immutable retention (WORM) is required, or if the organization's policy demands object storage, this solution is wrong and the S3 backend is the one to use, which is why I kept the S3 option.

## What to do today if the MinIO image won't pull

If you have just hit one of the errors at the top of this post, start by protecting the copy you have. Don't run cleanup commands such as `docker image prune` or `docker system prune` for now, because the MinIO image in your cache may be the last copy you have. If it isn't on your machine, it may still be on another server, a CI runner or your organization's registry. You can export the copy you find with `docker save` and bring it to the machine that needs it with `docker load`.

If there is no copy anywhere, you can bring the old server up for a while with a fork. When I checked on 14 November 2026, the registries served Pigsty's `pgsty/silo` image and Chainguard's `cgr.dev/chainguard/minio:latest` image without a login. Silo says it keeps MinIO's on-disk format, and it runs as root. Chainguard's image runs as a non-root user, so you may need to change the owner of the data directory. As a last resort, you can build the image from source yourself with the steps in the [notes of the last community release](https://github.com/minio/minio/releases/tag/RELEASE.2025-10-15T17-29-55Z).

Before you move your data, back up the volume and run the old server on that copy, cut off from the outside. You can copy the files to their new place over S3 with `mc mirror` or `rclone copy`, although by default neither tool carries object versions or custom metadata. Don't delete anything until you have compared the copies with the source.

Don't treat the last community release as a lasting solution. Two [security advisories](https://github.com/minio/minio/security/advisories) published in April 2026 show that anyone who knows a valid access key, such as the default `minioadmin`, can write objects without the secret key. The community edition has no fix for them. If you use the `minio/mc` image to create buckets, that image no longer pulls either. Chainguard's `minio-client` image or the AWS CLI can do the same job.

## MinIO alternatives: if you really do need an S3 server

If you have more than one server, if your files run into terabytes, or if the tools you use expect an endpoint that speaks S3, then you do need an object store. In that case I think you should ask "which one will still be here on the same terms in five years" before you ask "which one is faster," and look for the answer less in feature lists than in the project's license, governance and revenue model.

Here are the candidates I looked at in late October 2026, and what I saw in them:

- **[versitygw](https://github.com/versity/versitygw)** (Apache 2.0): a small gateway that maps S3 calls onto a folder. Because your objects sit on disk as plain files, your files would still be in your hands even if versitygw went away tomorrow. If I needed an S3 endpoint on a single server, this is the first place I would look, and I already run my S3 backend's tests against it.
- **[Garage](https://garagehq.deuxfleurs.fr/)** (AGPLv3): developed by an association and funded by public grants. It is designed for small, geographically distributed setups of a few nodes. Its own documentation does not recommend a single-node setup for production.
- **[SeaweedFS](https://github.com/seaweedfs/seaweedfs)** (Apache 2.0): moving very fast, but in the last three months two thirds of the contributions came from one person, and the project also has a separate, proprietary enterprise edition. _Update (23 November 2026):_ after the post, SeaweedFS's official account [pointed out on X](https://x.com/SeaweedFS/status/2124599269965611144) that it has a mode that runs with a single command (`weed mini -dir=your_directory`). I looked into it after that feedback, and if you need S3 it is worth a try. In my project, though, plain disk is enough for now, and rather than add another dependency I wanted to write my own first.
- **[RustFS](https://github.com/rustfs/rustfs)** (Apache 2.0): the new engine that resembles MinIO most, and many projects put it in place of MinIO in their tests. But its first stable release came out in September 2026, and its [contributor agreement](https://github.com/rustfs/rustfs/blob/main/CLA.md) gives the company the right to distribute contributions under a different license.
- **[Ceph](https://ceph.io/en/)** (LGPL): developed under the Linux Foundation, with more than two hundred people contributing in the last three months. It is the right answer for real scale, although too heavy for a single server. At the same scale there is also [Apache Ozone](https://ozone.apache.org/), under the Apache Software Foundation.
- **MinIO forks** (AGPLv3): [PGSTY Silo](https://github.com/pgsty/silo) brought the admin console back and keeps the security fixes coming; [Chainguard](https://www.chainguard.dev/unchained/fork-yeah-were-adding-ten-new-open-source-projects-to-emeritoss) publishes a fork that receives security fixes only, with a free image.

Dozens of security advisories were published this year for both RustFS and SeaweedFS. That is no surprise for projects that grow fast and are examined closely, but whichever you choose, you will have a stream of advisories to follow.

{% include figure.liquid loading="lazy" path="assets/img/2026-11-14-minio-decision-en.svg" class="img-fluid w-100" width="680" height="525" alt="A three-question decision flow: plain files behind a narrow interface for one server and write-once files; the organization's own S3 store if there is one; otherwise versitygw, Garage or SeaweedFS depending on scale, and Ceph at large scale" zoomable=true %}

<div class="caption">
    The order I follow when I decide
</div>

I also looked at what other projects did, and saw that there is no single answer. [GitLab](https://gitlab.com/gitlab-org/charts/gitlab/-/work_items/6281) removed the bundled MinIO from its Helm chart and put nothing in its place, so you bring your own S3 store. [NixOS](https://github.com/NixOS/nixpkgs/pull/492794) moved its object-storage test to Garage. [Apache Iceberg](https://github.com/apache/iceberg/pull/18247) switched to RustFS in its tests, [Grafana Loki](https://github.com/grafana/loki/pull/25393) to Silo in its sample setups, and [Zalando Spilo](https://github.com/zalando/spilo/pull/1218) to SeaweedFS. [Incus](https://github.com/lxc/incus/pull/3258) took a path similar to mine and replaced the feature that relied on MinIO with its own built-in S3 endpoint. I saw the same spread when I looked at forty recently merged changes on GitHub whose titles say they replace MinIO. Twelve of them chose RustFS, eleven SeaweedFS, four Garage, four the plain disk and two versitygw, while Silo, LocalStack and S3Mock came up once each.

## How the AI era changed this picture

MinIO presents its commercial product, [AIStor](https://www.min.io/product/aistor), as a data store built for AI workloads, and in a [press release](https://www.newswire.ca/news-releases/minio-grows-arr-by-149-as-demand-for-ai-data-storage-skyrockets-860182236.html) of February 2025 it said that its annual recurring revenue had grown 149 percent in two years, that it was profitable, and that the growth came from demand for AI.

The company gave a reason of its own for only one step. When the admin console was reduced, its founders [said](https://www.futuriom.com/articles/news/minio-faces-fallout-for-stripping-features-from-web-gui/2025/06) that keeping up a second console for the community edition was substantial work and that unmaintained code is a security risk. For the later steps, the removal of the images included, I could find no reason beyond the company saying on its [pricing page](https://www.min.io/pricing) that its engineering focus is now on AIStor.

As I see it, the money flowed to AI, and infrastructure companies repositioned their products toward where the money flows. In the eyes of a company whose most valuable customers store training data at very large scale, a community edition used by small teams keeping a few GB of files becomes a burden that earns nothing. Since the company says it is profitable, it seems to have made this decision by choice rather than out of necessity. The link between AI and that choice is my reading of the timing; MinIO never said so, and the same picture can also be read as the ordinary commercialization steps of a venture-backed company.

I also see another possibility. There have always been companies that take open-source code, embed it in their own products and build large businesses on it without leaving anything to the people who wrote it, and MinIO had complained about this for a long time. In July 2022 it [announced](https://www.blocksandfiles.com/object/2022/07/19/minio-accuses-nutanix-of-violating-open-source-license/1617140) that it was revoking Nutanix's license, saying that Nutanix had used MinIO in its object storage product for years without disclosing it. On 28 July Nutanix [apologized](https://www.blocksandfiles.com/hci/2022/07/28/nutanix-apologizes-to-minio-for-apache-2-licence-infraction/1607943) for leaving out the attribution and notices that the Apache 2.0 license requires, and said it had used only Apache 2.0-licensed MinIO code. In March 2023 MinIO made a similar accusation against Weka and [said](https://www.blocksandfiles.com/file/2023/03/26/we-object-minio-says-no-more-open-license-for-weka/1612500) it was revoking its license too. Weka said it used only Apache 2.0-licensed code, that the accusations were baseless and that this license cannot be revoked. In a statement in the same article, Nutanix added that it had used MinIO code only for a few ancillary functions and that Objects 3.6, released on 2 November 2022, removed it completely.

So I think the companies that took the prebuilt images and binaries and shipped them inside their commercial products may also have played a part in the images being closed off. This is only my guess. MinIO never gave this as a reason. The source code is still public, so anyone can still build and use it. Without prebuilt images and binaries, though, doing so now takes effort and brings its own maintenance burden.

The same era changed the math on my side too, because writing a narrow component yourself no longer costs what it used to. My paper estimate for this job was four to five focused days, but working with AI agents, I had the code merged into the main branch and my own installation migrated the day after the decision. Still, I don't want to generalize, because while controlled studies show that the first version of a small, well-defined piece of work gets [written faster](https://arxiv.org/abs/2302.06590), one study found experienced developers [slowing down](https://arxiv.org/abs/2507.09089) in mature codebases.

AI assistants also carry the knowledge of the period they were trained in, and research shows that models keep suggesting [deprecated calls](https://arxiv.org/abs/2406.09834) of libraries and now and then invent [packages that do not exist](https://arxiv.org/abs/2406.10279). From what I have seen, if you ask an assistant where to keep your files, you are likely to get the answer that appeared most often in the sample files of a few years ago, and checking whether the suggested dependency is still standing today is still up to you.

## A similar story from ten years ago: the left-pad incident

A video on the [Tech Buddy](https://www.youtube.com/@TechBuddyTR) channel, published on 8 November with the title "11 Satırlık işi neden başkasına bıraktık" (roughly, "Why did we leave an 11-line job to someone else?"), influenced my writing this post. Tech Buddy shares useful Turkish videos on software development, and if you like stories like this one and understand Turkish, I recommend watching the [video](https://www.youtube.com/watch?v=R8W8KD3PdkU) and having a look at the channel.

<div class="youtube-video" data-youtube-id="R8W8KD3PdkU"><a href="https://www.youtube.com/watch?v=R8W8KD3PdkU"><img src="{{ '/assets/img/2026-11-14-video-tech-buddy.jpg' | relative_url }}" alt="Thumbnail of the Tech Buddy video 11 Satırlık işi neden başkasına bıraktık" class="img-fluid rounded z-depth-1" width="1280" height="720" loading="lazy"></a></div>
<div class="caption">
    Tech Buddy, "11 Satırlık işi neden başkasına bıraktık" (YouTube, in Turkish, 8 November 2026)
</div>

If you don't speak Turkish, the same story is told in English in the Half as Interesting channel's video ["The Man Who Broke The Internet By Deleting 11 Lines of Code"](https://www.youtube.com/watch?v=LmI4W8X7vU8).

<div class="youtube-video" data-youtube-id="LmI4W8X7vU8"><a href="https://www.youtube.com/watch?v=LmI4W8X7vU8"><img src="{{ '/assets/img/2026-11-14-video-half-as-interesting.jpg' | relative_url }}" alt="Thumbnail of the Half as Interesting video The Man Who Broke The Internet By Deleting 11 Lines of Code" class="img-fluid rounded z-depth-1" width="1280" height="720" loading="lazy"></a></div>
<div class="caption">
    Half as Interesting, "The Man Who Broke The Internet By Deleting 11 Lines of Code" (YouTube, in English, 12 April 2022)
</div>

The left-pad incident, as the software world calls it, was the episode in which a small package pulled from npm briefly broke the builds of many projects that relied on it. In March 2016 the messaging company Kik asked the developer [Azer Koçulu](https://azerkoculu.com/) for the name of his "kik" package on npm, citing its trademark. When Koçulu refused, npm transferred the package to the company, and on 22 March Koçulu removed all of his packages from npm. Among them was left-pad, an 11-line function that pads a string on the left. Thousands of projects that depended on it directly or indirectly, Babel and React among them, suddenly could not be built. About two hours later npm restored left-pad and afterwards changed its rules. You can read npm's own account of the incident on [its blog](https://blog.npmjs.org/post/141577284765/kik-left-pad-and-npm).

Koçulu's side of the story can be read in his own posts. In ["I've Just Liberated My Modules"](https://azerkoculu.com/posts/i-ve-just-liberated-my-modules), published right after he removed the packages, he explains that seeing the package name handed over without his permission made npm look to him like private land where corporations are more powerful than people. Eight years later, in ["left-pad"](https://azerkoculu.com/posts/left-pad), he writes that the decision was not made in anger.

Ten years separate that incident from MinIO's story, but in both the trouble started in the channel that delivers the code and in the decisions made about that channel. The question in the video's title, why we left an 11-line job to someone else, is close to the first question I ask myself at the end of this post.

## What I think about open source now

What happened isn't unique to MinIO either. In recent years we have seen similar decisions take two forms. The first was a license change; [HashiCorp](https://www.hashicorp.com/en/blog/hashicorp-adopts-business-source-license) changed its license in 2023, and [Redis](https://redis.io/blog/redis-adopts-dual-source-available-licensing/) in 2024. The second was withdrawing the distribution. In 2025 [Bitnami](https://github.com/bitnami/containers/issues/83267) moved its prebuilt images to a repository that gets no updates and put the current ones behind a subscription, and in 2026 [LocalStack](https://blog.localstack.cloud/the-road-ahead-for-localstack/) ended its community image and archived its repository. In this second form the license never changes, and MinIO falls into it.

What happens after the decision is what really makes the difference. Valkey, the fork of Redis, was set up within eight days [under the Linux Foundation](https://www.linuxfoundation.org/press/linux-foundation-launches-open-source-valkey-community) with large backers, and for OpenTofu, the fork of Terraform, it took about [six weeks](https://www.linuxfoundation.org/press/announcing-opentofu). Behind each of MinIO's forks there is only a single organization.

Some companies embrace open source for community-led growth, building a community around a product whose code they have opened and, through it, finding chances to work with enterprise customers. According to a [Cloudflare blog post](https://blog.cloudflare.com/vinext) from February 2026, a single engineer directing AI rebuilt Vercel's [Next.js](https://github.com/vercel/next.js) from scratch in under a week. The resulting alternative deploys to Cloudflare's own platform with a single command. Cloudflare praised the Next.js team, but I suspect other companies will take the same path, reverse-engineer software and release it under their own names without crediting where it came from. Should such examples multiply, I would not be surprised to see companies question the support they give to open source.

I took a few lessons from all of this for myself.

**A license covers only today's code.** An open-source license gives you the right to use, modify and distribute the code that exists. It makes no promise that a new release will come out tomorrow, that prebuilt binaries will be published, or that the image will stay at the same address.

**A license leaves you a way out.** MinIO's license stayed AGPL to the end, and the forks that keep the security fixes coming today exist because of that license. Had the same thing happened to a closed product, I wouldn't even have code to read.

**Nobody owes us anything.** For years MinIO gave away very good software for nothing, and I have no right to expect that something I got for free stays free forever. I was the one who chose the dependency, and I was the one who should have kept an eye on it.

**A dependency has four parts.** Besides the code, the distribution channel that gets that code to you, the maintenance that keeps it alive and the governance that decides who gets to decide all of that are part of the dependency too. In MinIO's case the code never changed, but the other three parts went away one by one.

**Who governs the project matters.** If a project's trademark, its repository and the rights to its contributions all sit with one company, the project changes the day that company's priorities change. In projects under a foundation or an association, that decision doesn't rest in a single hand. When the company behind [NATS](https://www.cncf.io/blog/2025/04/24/protecting-nats-and-the-integrity-of-open-source-cncfs-commitment-to-the-community/) wanted to change the license in 2025, it could not do so on its own, because the project sat under the foundation. Under a [May 2025 agreement](https://www.cncf.io/announcements/2025/05/01/cncf-and-synadia-align-on-securing-the-future-of-the-nats-io-project/), the company assigned the NATS trademarks to the Linux Foundation and the project stayed in the CNCF under Apache 2.0.

**A narrow interface makes the job much easier.** One of the main reasons I could make this change so quickly is that the application touched MinIO through five functions.

**Leaning on standards is safer.** Because S3 stopped being a product and became a protocol, there are half a dozen servers I could put in MinIO's place today, and the same goes for the file system.

## What I ask before adding a new dependency

Since this happened, I ask myself these questions before adding a dependency:

1. Can I cover this need myself with the standard library, or with a few hundred lines?
2. Who governs the project: a single company, or a foundation or an association?
3. Does the contributor agreement let the project's owner change the license on its own?
4. Where does the company make its money, and does the way I use the project stand in the way of that?
5. Who distributes the image or the package; if that address closes tomorrow, what am I left with?
6. Is my installation tried regularly on a machine with an empty cache?
7. From how many places in the code do I touch this dependency?
8. Can I take my data out of it and move it somewhere else?

If you have been through something similar, or chose a different path away from MinIO, I'd be glad if you wrote about it in the comments below. I'm curious which questions other people asked in this situation.
