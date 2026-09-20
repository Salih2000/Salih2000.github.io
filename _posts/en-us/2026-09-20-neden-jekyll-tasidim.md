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
DRAFT — review it and add your own final touches in your own voice.
Once the post is finished, remove (or set to true) the "published: false" line above, then we'll publish it.
-->

Around the time I was about to graduate from university, I started thinking that having a personal website could be valuable — a place to bring my technical and hobby content together, and something I needed for building a personal brand. In short, I was looking for a blog.

## Why I started with a clone project instead of building from scratch

Since my expertise in this area was still limited, I got the idea of adapting a clone project to my own preferences and needs. Building something from scratch is a great way to learn and gain experience, but back in 2024, when I built the site, I hadn't yet entered the workforce, and I could already see that frontend/web development was becoming saturated with a lot of competition. So I didn't want to spend too much time in an area that wouldn't directly benefit my career, and decided to start with a clone project instead.

## My inspiration: JavaScript Mastery

There's a YouTube channel I've followed for a long time called [JavaScript Mastery](https://www.youtube.com/@javascriptmastery). Back before the AI hype, it was a channel with how-to style tutorials touching many areas of software development — sharing content about the consistent technologies we actually need for school and personal projects. They still put out great content; I'd strongly recommend checking out their videos, especially if you're still a student. I've always recommended that someone who knows nothing about a topic but wants to specialize in it should build a complete, working clone project end to end — it's an experience that really helps you understand what developers actually do, and gives you a much better sense of what you do and don't want to do yourself.

During this research, I came across a video called "Build and Deploy an Amazing 3D Web Developer Portfolio in React JS | Beginner Three.js Tutorial" ([link](https://www.youtube.com/watch?v=0fYi8SGA20k)). I figured a static site wouldn't be a bad starting point, and that it would be relatively simple to customize later on my own, so I used this video to get my project off the ground.

## First version: the domain search and the React.js portfolio

Back then I was searching Google Domains for domains matching my name; it was disappointing to find all the domains I wanted already taken, but I eventually bought `salihkilic.net`. I built my project by following the YouTube video.

If you'd like, you can check out the source code in [this repo](https://github.com/Salih2000/mypersonelwebsiteportfolio-main). The site is still hosted on Firebase, so here's the live version too: [personel-website-53a82.web.app](https://personel-website-53a82.web.app/)

{% include figure.liquid loading="eager" path="assets/img/2026-09-20-old-react-portfolio.png" class="img-fluid rounded z-depth-1" %}
<div class="caption">
    The homepage of my old React.js/Three.js portfolio
</div>

## The problem: 3D scenes and the inevitable cost of heavy rendering

After getting my personal site up and running, I noticed that the heavy use of 3D scenes, while visually nice, was causing serious problems with performance, indexing, and SEO.

## The new search: moving to a content/blog-focused technology

Once I noticed that many developers who had made a name for themselves in the industry had blog- and content-focused websites, I got the idea of moving to a technology where I could actually produce a blog. I also looked into classic WordPress and similar tools, but they didn't quite give me the open-source flexibility I wanted. A friend recommended Jekyll as ideal for this kind of work, so I started researching ready-made blog themes on GitHub.

That's when I came across [al-folio](https://github.com/alshedivat/al-folio) — exactly the kind of clean, content-focused theme I wanted, built on Jekyll, actively maintained by its community, and something I could host for free on GitHub Pages while connecting it to my own domain. The setup took a bit of time, but I got it live by following the documentation.

Some time had passed since I'd set my domain up with the old React version; around then an email had come in about Google Domains being shut down by Google, but I hadn't really kept up with it ([killedbygoogle.com](https://killedbygoogle.com/)). I then set up the DNS redirects through Squarespace and got my website running again.

{% include figure.liquid loading="eager" path="assets/img/2026-09-20-killed-by-google.png" class="img-fluid rounded z-depth-1" %}
<div class="caption">
    Google Domains' entry on killedbygoogle.com
</div>

## Why I've settled on this setup for now

As it stands, I've realized this covers all of my needs for now as a working developer who wants a space for a blog. A few things that have particularly worked well for me:

- **Multi-language support** — Turkish and English content on the same site, so I can speak to both a local and an international audience.
- **Writing content in Markdown** — I can publish a new post with a plain text file, no coding required.
- **Completely free hosting on GitHub Pages**, along with the ability to connect my own domain.
- **CV generation from a single data file** — my resume information is updated from one source, shown both as a web page and as a downloadable PDF.
- **Ready-made analytics integrations** — I can wire up tools like Google Analytics, Search Console, and Microsoft Clarity with just a few config lines.
- **Fast load times and an SEO-friendly structure since it's a static site** — the opposite of the 3D scene overhead on my old site.
- **Automatic deployment via GitHub Actions** — the site updates itself whenever I push a change.

Honestly, this post was originally going to be a "here's how you can do this too" style guide; in the end, though, I decided a "why I chose this" post made more sense. Because these days, thanks to AI, setting up a site like this will honestly help you a lot more than any guide I could write here — the content I want to build on my blog going forward will probably lean more toward "why I chose this" and my own feedback on it, rather than "here's how," since Agentic AI now handles this kind of setup/manual process in a much more understandable and operable way.

At the end of the day, I don't yet have content on here that I'd call substantial or high-quality, and I need to figure out how I'll make time for that. But I'm planning to start filling up my blog soon — it'll probably be a mix of my professional experience and expertise, my hobbies, and things from everyday life.
