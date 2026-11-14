#!/usr/bin/env python3
"""Build ATS-friendly CV PDFs from the site's JSON Resume files.

One source per language (assets/json/resume_<lang>.json) gives two files per language:

    assets/pdf/<lang>/resume.pdf         the full CV
    assets/pdf/<lang>/resume-short.pdf   the one-page CV

"ATS-friendly" here means one column, real text (no images, icons or tables), standard
section headings, one date format and a tagged PDF, so that applicant tracking systems can
read the file in order.

The one-page CV uses meta.short in the JSON file (its own summary and the list of projects
to show) and the "short" sentence of each of those projects.

Requires:  pip install playwright pypdf  &&  playwright install chromium

Usage:
    python bin/build_cv_pdf.py                                   # both languages, both variants
    python bin/build_cv_pdf.py --lang tr-tur --variant short
    python bin/build_cv_pdf.py --phone "+90 5xx xxx xx xx" --out-dir ../cv-private
        # a private copy with a phone number; the public files never carry one
"""

from __future__ import annotations

import argparse
import html
import io
import json
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent

LABELS = {
    "en-us": {
        "html_lang": "en",
        "cv": "CV",
        "summary": "Summary",
        "skills": "Skills",
        "experience": "Experience",
        "projects": "Projects",
        "selected_projects": "Selected Projects",
        "education": "Education",
        "certificates": "Certifications",
        "languages": "Languages",
        "present": "Present",
        "technologies": "Technologies",
        "country": "Türkiye",
    },
    "tr-tur": {
        "html_lang": "tr",
        "cv": "Özgeçmiş",
        "summary": "Özet",
        "skills": "Yetkinlikler",
        "experience": "Deneyim",
        "projects": "Projeler",
        "selected_projects": "Seçilmiş Projeler",
        "education": "Eğitim",
        "certificates": "Sertifikalar",
        "languages": "Diller",
        "present": "Devam ediyor",
        "technologies": "Teknolojiler",
        "country": "Türkiye",
    },
}

CSS = """
@page { size: A4; margin: %(margin)s; }
* { box-sizing: border-box; }
html { font-size: %(base)spt; }
body { font-family: Arial, Helvetica, sans-serif; line-height: %(leading)s; color: #111; margin: 0; }
h1 { font-size: 1.95rem; line-height: 1.15; margin: 0 0 0.15rem; }
.headline { font-size: 1.12rem; font-weight: bold; margin: 0 0 0.25rem; }
.contact { font-size: 0.94rem; margin: 0; }
h2 { font-size: 1.12rem; margin: %(h2_top)srem 0 0.35rem; padding-bottom: 0.15rem; border-bottom: 0.8pt solid #444; }
h3 { font-size: 1.02rem; margin: 0.6rem 0 0.05rem; }
/* Page breaks: a heading stays with what follows it, and a bullet or paragraph is never split. */
h2, h3, .meta { break-after: avoid; page-break-after: avoid; }
li, p { break-inside: avoid; page-break-inside: avoid; }
p { margin: 0 0 0.3rem; }
.meta { margin: 0 0 0.2rem; }
ul { margin: 0.15rem 0 0.35rem; padding-left: 1.35rem; }
li { margin: 0 0 0.12rem; }
a { color: inherit; text-decoration: none; }
"""

# "base" is the starting type size in points. When the result has more pages than "max_pages",
# the type shrinks in steps of 0.2 pt down to "min_base".
VARIANTS = {
    "long": {"file": "resume.pdf", "base": 10.2, "min_base": 9.2, "max_pages": 3, "leading": 1.36, "margin": "14mm 15mm", "h2_top": 0.95},
    "short": {"file": "resume-short.pdf", "base": 9.4, "min_base": 8.0, "max_pages": 1, "leading": 1.3, "margin": "11mm 13mm", "h2_top": 0.7},
}


def esc(value: object) -> str:
    return html.escape(str(value), quote=True)


def month(date: str | None) -> str:
    """'2026-08-01' -> '08/2026'."""
    if not date:
        return ""
    parts = date.split("-")
    return f"{parts[1]}/{parts[0]}" if len(parts) >= 2 else parts[0]


def period(entry: dict, labels: dict) -> str:
    start = month(entry.get("startDate"))
    if not start:
        return ""
    end = month(entry.get("endDate")) or labels["present"]
    return f"{start} – {end}"


def bullets(items: list[str]) -> str:
    if not items:
        return ""
    return "<ul>" + "".join(f"<li>{esc(item)}</li>" for item in items) + "</ul>"


def bare(url: str) -> str:
    return re.sub(r"^https?://(www\.)?", "", url).rstrip("/")


def header(cv: dict, labels: dict, phone: str | None) -> str:
    basics = cv["basics"]
    contact: list[str] = []
    location = basics.get("location") or {}
    if location.get("city"):
        contact.append(f"{location['city']}, {labels['country']}")
    if phone:
        contact.append(phone)
    if basics.get("email"):
        contact.append(f'<a href="mailto:{esc(basics["email"])}">{esc(basics["email"])}</a>')
    if basics.get("url"):
        contact.append(f'<a href="{esc(basics["url"])}">{esc(bare(basics["url"]))}</a>')
    for profile in basics.get("profiles") or []:
        if profile.get("url"):
            contact.append(f'<a href="{esc(profile["url"])}">{esc(bare(profile["url"]))}</a>')
    return (
        f"<h1>{esc(basics['name'])}</h1>"
        f'<p class="headline">{esc(basics.get("label", ""))}</p>'
        f'<p class="contact">{" | ".join(contact)}</p>'
    )


def skills_block(cv: dict, labels: dict) -> str:
    rows = "".join(f"<p><b>{esc(group['name'])}:</b> {esc(', '.join(group.get('keywords') or []))}</p>" for group in cv.get("skills") or [])
    return f"<h2>{esc(labels['skills'])}</h2>{rows}"


def work_entry(job: dict, labels: dict, with_details: bool) -> str:
    place = ", ".join(x for x in (job.get("name"), job.get("location")) if x)
    out = [f'<div class="entry"><h3>{esc(job.get("position", ""))}</h3>', f'<p class="meta">{esc(place)} | {esc(period(job, labels))}</p>']
    if with_details:
        if job.get("summary"):
            out.append(f"<p>{esc(job['summary'])}</p>")
        out.append(bullets(job.get("highlights") or []))
    out.append("</div>")
    return "".join(out)


def tail_sections(cv: dict, labels: dict, compact: bool) -> str:
    out: list[str] = []
    education = cv.get("education") or []
    if education:
        out.append(f"<h2>{esc(labels['education'])}</h2>")
        for school in education:
            degree = ", ".join(x for x in (school.get("studyType"), school.get("area")) if x)
            extra = "; ".join(school.get("courses") or [])
            line = f"{esc(school.get('institution', ''))} | {esc(period(school, labels))}"
            out.append(f'<div class="entry"><h3>{esc(degree)}</h3><p class="meta">{line}{" | " + esc(extra) if extra else ""}</p></div>')
    certificates = cv.get("certificates") or []
    if certificates:
        out.append(f"<h2>{esc(labels['certificates'])}</h2>")
        names = [f"{c.get('name', '')} ({c.get('issuer', '')})" if c.get("issuer") else c.get("name", "") for c in certificates]
        out.append(f"<p>{esc('; '.join(names))}</p>" if compact else bullets(names))
    languages = cv.get("languages") or []
    if languages:
        out.append(f"<h2>{esc(labels['languages'])}</h2>")
        out.append("<p>" + esc("; ".join(f"{x.get('language', '')}: {x.get('fluency', '')}" for x in languages)) + "</p>")
    return "".join(out)


def body_long(cv: dict, labels: dict, phone: str | None) -> str:
    out = [header(cv, labels, phone)]
    out.append(f"<h2>{esc(labels['summary'])}</h2><p>{esc(cv['basics'].get('summary', ''))}</p>")
    out.append(skills_block(cv, labels))
    out.append(f"<h2>{esc(labels['experience'])}</h2>")
    out.extend(work_entry(job, labels, with_details=True) for job in cv.get("work") or [])
    out.append(f"<h2>{esc(labels['projects'])}</h2>")
    for project in cv.get("projects") or []:
        block = [f'<div class="entry"><h3>{esc(project["name"])}</h3>']
        dates = period(project, labels)
        if dates:
            block.append(f'<p class="meta">{esc(dates)}</p>')
        if project.get("summary"):
            block.append(f"<p>{esc(project['summary'])}</p>")
        block.append(bullets(project.get("highlights") or []))
        if project.get("keywords"):
            block.append(f"<p><b>{esc(labels['technologies'])}:</b> {esc(', '.join(project['keywords']))}</p>")
        block.append("</div>")
        out.append("".join(block))
    out.append(tail_sections(cv, labels, compact=False))
    return "".join(out)


def body_short(cv: dict, labels: dict, phone: str | None) -> str:
    short = (cv.get("meta") or {}).get("short") or {}
    by_name = {project["name"]: project for project in cv.get("projects") or []}
    chosen = [by_name[name] for name in short.get("projects") or [] if name in by_name]
    out = [header(cv, labels, phone)]
    out.append(f"<h2>{esc(labels['summary'])}</h2><p>{esc(short.get('summary') or cv['basics'].get('summary', ''))}</p>")
    out.append(skills_block(cv, labels))
    out.append(f"<h2>{esc(labels['experience'])}</h2>")
    out.extend(work_entry(job, labels, with_details=False) for job in cv.get("work") or [])
    out.append(f"<h2>{esc(labels['selected_projects'])}</h2><ul>")
    for project in chosen:
        dates = period(project, labels)
        title = f"{project['name']} ({dates})" if dates else project["name"]
        out.append(f"<li><b>{esc(title)}.</b> {esc(project.get('short') or project.get('summary', ''))}</li>")
    out.append("</ul>")
    out.append(tail_sections(cv, labels, compact=True))
    return "".join(out)


def document(cv: dict, labels: dict, variant: str, phone: str | None, base: float) -> str:
    style = VARIANTS[variant]
    css = CSS % {"margin": style["margin"], "base": base, "leading": style["leading"], "h2_top": style["h2_top"]}
    body = body_long(cv, labels, phone) if variant == "long" else body_short(cv, labels, phone)
    title = f"{cv['basics']['name']} - {cv['basics'].get('label', '')} - {labels['cv']}"
    return (
        f'<!doctype html><html lang="{labels["html_lang"]}"><head><meta charset="utf-8">'
        f"<title>{esc(title)}</title><style>{css}</style></head><body>{body}</body></html>"
    )


def page_count(pdf: bytes) -> int:
    try:
        from pypdf import PdfReader

        return len(PdfReader(io.BytesIO(pdf)).pages)
    except ImportError:
        return len(re.findall(rb"/Type\s*/Page[^s]", pdf))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--lang", choices=[*LABELS, "all"], default="all")
    parser.add_argument("--variant", choices=[*VARIANTS, "all"], default="all")
    parser.add_argument("--json-dir", type=Path, default=REPO / "assets" / "json")
    parser.add_argument("--out-dir", type=Path, default=REPO / "assets" / "pdf")
    parser.add_argument("--phone", default=None, help="phone number for a private copy; never use it for the public files")
    args = parser.parse_args()

    from playwright.sync_api import sync_playwright

    languages = list(LABELS) if args.lang == "all" else [args.lang]
    variants = list(VARIANTS) if args.variant == "all" else [args.variant]
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page()
        for lang in languages:
            cv = json.loads((args.json_dir / f"resume_{lang}.json").read_text(encoding="utf-8"))
            for variant in variants:
                style = VARIANTS[variant]
                base = style["base"]
                while True:
                    page.set_content(document(cv, LABELS[lang], variant, args.phone, base), wait_until="load")
                    pdf = page.pdf(format="A4", prefer_css_page_size=True, print_background=False, tagged=True, outline=False)
                    pages = page_count(pdf)
                    # Keep each variant within its page budget: shrink the type a little until it fits.
                    if pages <= style["max_pages"] or base <= style["min_base"]:
                        break
                    base = round(base - 0.2, 1)
                target = args.out_dir / lang / VARIANTS[variant]["file"]
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(pdf)
                print(f"{target.relative_to(args.out_dir.parent) if args.out_dir.parent in target.parents else target}: {pages} page(s), {base} pt, {len(pdf) // 1024} KB")
        browser.close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
