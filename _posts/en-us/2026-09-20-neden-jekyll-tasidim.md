---
layout: post
title: Why I moved my site from React.js to Jekyll
date: 2026-09-20 12:00:00+0300
description: The story of why I moved my personal site, which started as a React.js project, to Jekyll/GitHub Pages.
tags: jekyll react personal-site
categories: personal
related_posts: false
giscus_comments: true
---

Around the time I was about to graduate from university, having a personal website started to seem like a good step for bringing together both my technical and hobby content and for building my personal brand. In short, I was looking for a blog.

## Why I started with a clone project instead of building from scratch

Since my experience with web technologies was still limited, the idea of adapting a ready-made clone project to my own needs seemed appealing. Building from scratch is undoubtedly a great way to learn; but back in 2024, when I built the site, I hadn't yet entered the workforce. I could see that frontend and web development was becoming increasingly saturated, with a lot of competition. Since I wanted to move forward in a more data-focused direction at the time, I didn't want to spend too much time in this area, and went with a clone project instead. Looking at where things stand even now in 2026, web technologies keep being a field that gets narrower and more brutally competitive by the day, so I think that prediction of mine has held up.

The [JavaScript Mastery](https://www.youtube.com/@javascriptmastery) channel, which I've followed on YouTube for a long time, was a big help during this process. Even before the AI era began, they were sharing great tutorials on consistent, end-to-end working technologies (and they still are). If you're a student, you should definitely check them out. If you know nothing about a topic and want to specialize in it, building an end-to-end working clone project was one of the best ways for me to realize what I wanted to do and, especially, what I didn't want to do.

Using the ["Build and Deploy an Amazing 3D Web Developer Portfolio in React JS \| Beginner Three.js Tutorial"](https://www.youtube.com/watch?v=0fYi8SGA20k) video I found during this research, I got my first project off the ground. I figured a static, flashy site wouldn't be a bad starting point.

## First version: the domain search and the React.js portfolio

Back then I was searching Google Domains for domains matching my name. Most of the addresses I wanted were already taken, but I eventually bought [salihkilic.net](https://salihkilic.net). I built the project by following the video.

If you'd like, you can check out the source code in [this repo](https://github.com/Salih2000/mypersonelwebsiteportfolio-main). The site is still hosted on Firebase, so you can also reach the live version [here](https://personel-website-53a82.web.app/).

{% include figure.liquid loading="eager" path="assets/img/2026-09-20-old-react-portfolio.png" class="img-fluid rounded z-depth-1" alt="Screenshot of my old React.js/Three.js portfolio homepage" %}
<div class="caption">
    The homepage of my old React.js/Three.js portfolio
</div>

## The problem: 3D scenes and the inevitable cost of heavy rendering

After getting my site up and running, I realized that heavy use of 3D scenes, no matter how stylish it looked visually, was causing serious problems with performance, indexing, and SEO.

## The new search: a content-focused technology

Once I noticed that many developers I admired in the industry had clean, content-focused websites, I decided I needed to move in that direction too. I looked into classic WordPress and similar tools, but couldn't find the open-source flexibility I was after. A friend recommended Jekyll as tailor-made for this kind of work, so I started looking through ready-made themes on GitHub.

That's when I came across [al-folio](https://github.com/alshedivat/al-folio) — exactly the clean, content-focused theme I was looking for, actively maintained by its community, and something I could host for free on GitHub Pages while connecting it to my own domain. The setup took a bit of time, but I got the system live by following the documentation.

Around this time I learned Google Domains had been shut down by Google ([killedbygoogle.com](https://killedbygoogle.com/)). I quickly set up the necessary DNS redirects through Squarespace and got my site back up and running without issue.

{% include figure.liquid loading="eager" path="assets/img/2026-09-20-killed-by-google.png" class="img-fluid rounded z-depth-1" alt="Screenshot of Google Domains' entry on killedbygoogle.com" %}
<div class="caption">
    Google Domains' entry on killedbygoogle.com
</div>

## Why I've settled on this setup for now

As a working developer, my current setup more than covers all of my basic needs:

- **Multi-language support:** I can keep Turkish and English content on the same site, speaking to both a local and an international audience.
- **Easy content creation:** I don't need to write any code for a new post; opening a plain markdown file is enough.
- **Zero cost, easy hosting:** it's hosted completely free on GitHub Pages and works with my own domain.
- **CV from a single source:** my resume is driven from a single data file; when I update the information once, both the web page and the downloadable PDF update automatically.
- **Easy integrations:** I wired up tools like Google Analytics, Search Console, and Microsoft Clarity with just a few lines of config, no extra integration hassle.
- **Speed and SEO:** being a static setup, it's both blazing fast and SEO-friendly — the exact opposite of the performance under the heavy 3D scenes on my old site.
- **Automatic deployment:** thanks to GitHub Actions, the site updates instantly the moment I push even a small change to the repo.

Honestly, the first draft of this post was going to be a "here's how you can set this up step by step" style guide. But I decided a "why I made this choice" post made more sense instead. Because these days, thanks to AI tools, doing this kind of technical setup has become much easier and more understandable than anything I could explain here. The content I'll probably produce on my blog from now on will likely be less "how-to" guides and more posts focused on "why I chose this," sharing my technical experience along the way.

For now I don't yet have a large body of content I'd call high-quality or substantial (not yet! :D), and I'm planning how I'll make time for that. But I'm thinking of bringing both my professional background and my everyday hobbies and experiences here soon.

If you'd like to set up this kind of stack yourself, I'd recommend going through the README documentation of the multi-language [al-folio](https://github.com/george-gca/multi-language-al-folio) repo I used, with the help of an AI tool. If you have even a bit of a technical background, it's not hard at all. And if you're one of my friends and allies, you can just reach out to me directly — I'm happy to point you in the right direction.
