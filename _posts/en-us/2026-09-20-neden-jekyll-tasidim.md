---
published: false
layout: post
title: Why I moved my site from React.js to Jekyll
date: 2026-09-20 12:00:00+0300
description: The story of why I moved my personal site, which started as a React.js project, to Jekyll/GitHub Pages.
tags: jekyll react personal-site
categories: data-engineering
related_posts: false
---

<!--
DRAFT — this is the edited version of the story you told, review it and add your own final touches in your own voice.
Once the post is finished, remove (or set to true) the "published: false" line above, then we'll publish it.
-->

Around the time I was about to graduate from university, I started thinking that having a personal website could be valuable — a place to bring my technical and hobby content together, and something I needed for building a personal brand. In short, I was looking for a blog.

## Why I started with a clone project instead of building from scratch

Since my expertise in this area was still limited, I got the idea of adapting a clone project to my own preferences and needs. Building something from scratch is a great way to learn and gain experience, but back in 2024, when I built the site, I hadn't yet entered the workforce, and I could already see that frontend/web development was becoming saturated with a lot of competition. So I didn't want to spend too much time in an area that wouldn't directly benefit my career, and decided to start with a clone project instead.

## My inspiration: JavaScript Mastery

There's a YouTube channel I've followed for a long time called [JavaScript Mastery](https://www.youtube.com/@javascriptmastery). Without chasing AI hype, they share content about the consistent technologies we actually need for school and personal projects. They still put out great content; I'd strongly recommend checking out their videos, especially if you're still a student. I've always recommended that someone who knows nothing about a topic but wants to specialize in it should build a complete, working clone project end to end.

During this research, I came across a video called "Build and Deploy an Amazing 3D Web Developer Portfolio in React JS | Beginner Three.js Tutorial" ([link](https://www.youtube.com/watch?v=0fYi8SGA20k)). I figured a static site wouldn't be a bad starting point, and that it would be relatively simple to customize later on my own, so I used this video to get my project off the ground.

## First version: the domain search and the React.js portfolio

Back then I was searching Google Domains for domains matching my name; it was disappointing to find all the domains I wanted already taken, but I eventually bought `salihkilic.net`. I built my project by following the YouTube video.

If you'd like, you can check out the source code in [this repo](https://github.com/Salih2000/mypersonelwebsiteportfolio-main). The site is still hosted on Firebase, so here's the live version too: [personel-website-53a82.web.app](https://personel-website-53a82.web.app/)

## The problem: the cost of 3D scenes

After getting my personal site up and running, I noticed that the heavy use of 3D scenes, while visually nice, was causing serious problems with performance, indexing, and SEO.

## The new search: moving to a content/blog-focused technology

Once I noticed that many developers who had made a name for themselves in the industry had blog- and content-focused websites, I got the idea of moving to a technology where I could actually produce a blog. A friend recommended Jekyll as ideal for this kind of work, so I started researching ready-made blog themes on GitHub.

That's when I came across [al-folio](https://github.com/alshedivat/al-folio) — exactly the kind of clean, content-focused theme I wanted, actively maintained by its community, and something I could host for free on GitHub Pages while connecting it to my own domain. The setup took a bit of time, but I got it live by following the documentation.

Unfortunately, right around that time, Google Domains was [killed by Google](https://killedbygoogle.com/). I set up the DNS redirects through Squarespace and got my website running again.

## Why I've settled on this setup for now

As it stands, I've realized this covers all of my needs for now as a working developer who wants a space for a blog. A few things that have particularly worked well for me:

- **Multi-language support** — Turkish and English content on the same site, so I can speak to both a local and an international audience.
- **Writing content in Markdown** — I can publish a new post with a plain text file, no coding required.
- **Completely free hosting on GitHub Pages**, along with the ability to connect my own domain.
- **CV generation from a single data file** — my resume information is updated from one source, shown both as a web page and as a downloadable PDF.
- **Ready-made analytics integrations** — I can wire up tools like Google Analytics, Search Console, and Microsoft Clarity with just a few config lines.
- **Fast load times and an SEO-friendly structure since it's a static site** — the opposite of the 3D scene overhead on my old site.
- **Automatic deployment via GitHub Actions** — the site updates itself whenever I push a change.

Honestly, this post was originally going to be a "here's how you can do this too" style guide. In the end, though, I decided a "why I chose this" post made more sense — because these days, thanks to AI, spinning up a site like this isn't really much of a task at all.

Let me briefly mention how I set it up, too: I based it on a [multi-language fork](https://github.com/george-gca/multi-language-al-folio) of al-folio, set up a local development environment with Docker to test changes before pushing them live, and use GitHub Actions so the site is automatically built and deployed to GitHub Pages on every push. I'll get into the details in another post, but that's the process in a nutshell.
