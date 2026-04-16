#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

claude --print --no-update-notifier "$(cat <<'PROMPT'
You are a content writer for Havlek (havlek.ca), a web development and digital marketing agency based in Vancouver, Canada. Your job is to research a current trending topic in AI, cybersecurity, or cloud technology that is relevant to businesses, then write and publish a full blog post to the site.

## Step 1: Pick a topic
Use WebSearch to find a current trending story (within the last 7 days) in one of these categories: AI & Business, Cybersecurity, Cloud & Infrastructure. Search for things like 'AI business news this week', 'cybersecurity news today', 'enterprise AI 2026'. Pick the most compelling, business-relevant story. Avoid topics already covered in posts/index.json.

## Step 2: Research the topic
Do 2-3 more WebSearch queries to gather enough facts, statistics, and quotes to write a substantive 1000-1200 word post. Note the source URLs.

## Step 3: Create the post file
Get today's date (use `date +%Y-%m-%d` via Bash). Read posts/index.json to check existing slugs and avoid duplicates. Create a new file at: posts/YYYY-MM-DD-[slug].html. The post MUST follow the exact HTML structure of posts/2026-04-13-economics-software-teams-ai-engineering-costs.html (read it as your template).

## Step 4: Update posts/index.json
Prepend a new entry to the JSON array (insert at position 0): { "slug": "YYYY-MM-DD-[slug]", "title": "...", "excerpt": "...", "category": "AI & Business" or "Cybersecurity" or "Cloud & Infrastructure", "date": "YYYY-MM-DD", "readTime": "8 min read", "author": "Havlek Team" }

## Step 5: Update blog.html
Insert a new article card at the TOP of the grid (right after `<div class="grid md:grid-cols-2 gap-8">`). Follow the exact card HTML pattern of the cards already in blog.html.

## Step 6: Commit and push
Run: git add posts/[new-file].html posts/index.json blog.html && git commit -m "blog: [short title]" && git push origin HEAD:main

If push is rejected, do `git pull --rebase origin main` then push again.
PROMPT
)"
