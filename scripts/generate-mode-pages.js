/**
 * Builds the per-mode detail pages under photo-to-video/<slug>/.
 *
 * These pages exist to be the best available answer to one specific question,
 * for both search snippets and AI answer engines. Hence the shape: the H1 is the
 * question, the first paragraph answers it without needing the heading for
 * context, steps are an ordered list, and capabilities are a table. HowTo,
 * BreadcrumbList and FAQPage JSON-LD are generated from the same data as the
 * visible markup so the two can never disagree.
 *
 * Every capability figure below was read off mode_model_configs on PROD. Do not
 * edit them by hand — re-check the catalog first.
 */
const fs = require("fs");
const path = require("path");

const OUT = path.join(process.cwd(), "photo-to-video");
const APP_STORE = "https://apps.apple.com/app/id6788599776";

const APPLE_SVG =
  '<svg viewBox="0 0 384 512" aria-hidden="true"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>';

const MODES = [
  {
    // Slug is not "photo-to-video": that would give the repetitive URL
    // /photo-to-video/photo-to-video/. "animate-photo" also matches how
    // people actually phrase the query.
    slug: "animate-photo",
    rail: "Photo to Video mode",
    docTitle: "How to Turn a Photo Into a Video With AI | Photo to Video",
    metaDesc:
      "Pick a photo, and AI animates it into a short video. Which of the ten models to use, how long clips can be, and what it costs on iPhone.",
    h1: "How to turn a photo into a video with AI",
    ogTitle: "How to turn a photo into a video with AI",
    image: "m-extend.jpg",
    imageAlt: "A frame from an AI-generated video made from a single still photo of a woman by the sea",
    caption: "Generated from one still image. No timeline, no keyframes.",
    answer:
      "Pick a photo in the Photo to Video app for iPhone and the AI generates a short video of it moving — a portrait that turns and blinks, a landscape whose water and clouds drift. A written prompt is <strong>optional</strong>: with no prompt the model infers plausible motion from the image itself, and with one you direct what moves. Ten models are available, clips run 1 to 20 seconds, and the highest resolution is 4K.",
    steps: [
      ["Open the app", "Photo to Video opens on this mode — it is the home screen."],
      ["Pick a photo", "Choose any image from your camera roll."],
      ["Optionally describe the motion", "Leave it blank to let the model decide, or write what should move."],
      ["Choose a model, length and resolution", "Ten models support this mode; see the table below."],
      ["Generate and save", "Save the finished clip to your camera roll."],
    ],
    spec: [
      ["Input", "One image"],
      ["Output", "Video, 480p to 4K depending on model"],
      ["Length", "1–20 seconds depending on model"],
      ["Models", "Seedance 1.0 Pro (default), Seedance 2.0, Sora 2, Veo 3.1, Kling 3, Wan 2.7, Vidu Q3, Hailuo-02, Grok Imagine, Happy Horse"],
      ["Prompt", "Optional"],
      ["Platform", "iPhone (iOS). No Android or web version."],
      ["Pricing", "Credits per second of output, by model. No subscription."],
    ],
    modelGuidance:
      "<strong>Seedance 1.0 Pro</strong> is the default and the cheapest per second — the right first try for any photo. <strong>Veo 3.1</strong> is the one to pick when you need 4K or synchronised audio. <strong>Sora 2</strong> and <strong>Seedance 2.0</strong> handle complex scenes and camera movement most convincingly, at a higher cost per second. <strong>Hailuo-02</strong> and <strong>Grok Imagine</strong> are quick, cheaper options for simple subject motion.",
    tips: [
      "A clear single subject animates far better than a busy scene. Crop before you generate.",
      "Describe movement, not appearance. “Her hair lifts in the wind” gives the model something to do; “beautiful photo” does not.",
      "Start at 4–5 seconds. It costs a fraction of a 20-second clip and tells you whether the prompt works.",
      "If one model refuses an image, try another — each has its own content rules and switching is free.",
    ],
    faq: [
      ["Can AI animate a still photo?", "Yes. Given one image it generates frames of that scene in motion, rather than panning or zooming across the original."],
      ["Do you need to write a prompt?", "No. For this mode the prompt is optional — without one the model infers motion from the image. A prompt gives you control over what moves."],
      ["How long can the video be?", "From 1 to 20 seconds depending on the model. Sora 2 and Seedance 2.0 allow the longest clips; Veo 3.1 is fixed at 4, 6 or 8 seconds."],
      ["Can it produce 4K?", "Yes, with Veo 3.1. The other models top out at 1080p."],
      ["Is it free?", "The app is free to install and there is no subscription. Generating uses credits, which you buy in one-time packs and which never expire."],
    ],
  },
  {
    slug: "transition",
    rail: "Transition mode",
    docTitle: "How to Morph One Photo Into Another on iPhone | Photo to Video",
    metaDesc:
      "Give an AI a start frame and an end frame and it generates the motion between them. How Transition mode works, which models support it, and what it costs.",
    h1: "How to morph one photo into another on iPhone",
    ogTitle: "How to morph one photo into another on iPhone",
    image: "m-transition.jpg",
    imageAlt: "A frame from an AI-generated transition clip: a woman walking through an urban plaza",
    caption: "A frame from a generated transition. The start and end images were two separate photos.",
    answer:
      "Give the app a start frame and an end frame, describe what should happen between them, and AI generates the motion that connects the two — not a cross-fade, but frames that did not exist before. In the Photo to Video app for iPhone this is <strong>Transition</strong> mode, and it takes about a minute.",
    steps: [
      ["Open Transition mode", "In Photo to Video, go to Modes and choose Transition."],
      ["Add two frames", "Pick the photo the clip should begin on, then the one it should end on."],
      ["Describe the change", "For example, \u201cshe turns to face the camera as the season shifts to winter.\u201d The prompt is what separates a morph from a movement."],
      ["Pick a model, length and resolution", "Seven models support this mode; see the table below."],
      ["Generate and save", "Save the finished clip to your camera roll."],
    ],
    spec: [
      ["Input", "Two images \u2014 a first and a last frame"],
      ["Output", "Video, 480p to 4K depending on model"],
      ["Length", "2\u201316 seconds depending on model"],
      ["Models", "Seedance 1.0 Pro (default), Seedance 2.0, Kling 3, Veo 3.1, Wan 2.7, Vidu Q3, Hailuo-02"],
      ["Prompt", "Required \u2014 it describes the change between the frames"],
      ["Platform", "iPhone (iOS). No Android or web version."],
      ["Pricing", "Credits per second of output, by model. No subscription."],
    ],
    modelGuidance:
      "<strong>Seedance 1.0 Pro</strong> is the default and the cheapest per second, with 2\u201312 second clips up to 1080p \u2014 the right starting point for most transitions. <strong>Veo 3.1</strong> is the only model here that outputs 4K, at fixed 4, 6 or 8 seconds. <strong>Vidu Q3</strong> allows the longest clips, up to 16 seconds. <strong>Kling 3</strong> is 1080p-only and costs roughly twice the default per second, but handles human motion distinctively well.",
    tips: [
      "Keep the two frames close in framing and lighting. The further apart they are, the more the result reads as a stylised morph instead of real movement.",
      "Describe motion, not appearance. \u201cTurns her head and smiles\u201d gives the model something to animate; \u201cbeautiful portrait\u201d does not.",
      "Start short. A 4-second clip costs a fraction of a 12-second one and tells you whether the prompt is working.",
      "If a model refuses the images, try another \u2014 each has its own content rules, and switching costs nothing.",
    ],
    faq: [
      ["Can AI create the frames between two photos?", "Yes. Transition mode generates the motion connecting a start and end frame, rather than cross-fading between the two images."],
      ["How long can a transition clip be?", "It depends on the model: Seedance 1.0 Pro covers 2\u201312 seconds, Wan 2.7 up to 15, and Vidu Q3 up to 16. Hailuo-02 offers fixed 6 or 10 second clips."],
      ["Do the two photos have to be similar?", "No, but the closer they are in subject, framing and lighting, the more believable the motion. Two unrelated images produce a stylised morph."],
      ["Can it output 4K?", "Yes, with Veo 3.1, at 4, 6 or 8 seconds. The other models top out at 1080p."],
      ["What does a transition cost?", "Credits are charged per second and vary by model, so a short clip on the default model costs the least. There is no subscription \u2014 credit packs are bought only when you generate."],
    ],
  },
  {
    slug: "text-to-video",
    rail: "Text to Video mode",
    docTitle: "How to Make a Video From a Text Prompt on iPhone | Photo to Video",
    metaDesc:
      "Describe a scene and AI generates the video — no footage or photo needed. Nine models, up to 4K, on iPhone. How it works and what it costs.",
    h1: "How to make a video from a text prompt",
    ogTitle: "How to make a video from just a text prompt",
    image: "m-text.jpg",
    imageAlt: "A frame from a video generated entirely from a written description",
    caption: "No photo was used. This was generated from a sentence.",
    answer:
      "Write a description of the scene you want and the AI generates the video from nothing else — no photo, no footage. In the Photo to Video app for iPhone this is <strong>Text to Video</strong> mode. Nine models are available, clips run 1 to 16 seconds, and Veo 3.1 can render 4K with sound.",
    steps: [
      ["Open Text to Video", "In the app, go to Modes and choose Text to Video."],
      ["Describe the scene", "Say what is in frame, what moves, and how the camera behaves."],
      ["Choose a model, length and resolution", "Nine models support this mode; see the table below."],
      ["Generate", "The clip is built from the prompt alone."],
      ["Save it", "Save the result to your camera roll."],
    ],
    spec: [
      ["Input", "A text prompt only"],
      ["Output", "Video, 480p to 4K depending on model"],
      ["Length", "1–16 seconds depending on model"],
      ["Models", "Seedance 1.0 Pro (default), Seedance 2.0, Veo 3.1, Kling 3, Wan 2.7, Vidu Q3, Hailuo-02, Grok Imagine, Happy Horse"],
      ["Prompt", "Required"],
      ["Platform", "iPhone (iOS). No Android or web version."],
      ["Pricing", "Credits per second of output, by model. No subscription."],
    ],
    modelGuidance:
      "<strong>Seedance 1.0 Pro</strong> is the default and cheapest per second. <strong>Veo 3.1</strong> is the choice for 4K and for generated audio. <strong>Seedance 2.0</strong> holds up best on prompts with several things happening at once. <strong>Kling 3</strong> is strong on human figures. For quick drafts of an idea, <strong>Hailuo-02</strong> costs the least per attempt.",
    tips: [
      "Write the shot, not the story. Subject, action, setting, camera — “low-angle shot of a red kite rising over wet sand, camera tilts up” beats a paragraph of narrative.",
      "One action per clip. Prompts asking for a sequence of events tend to produce neither.",
      "Name the look explicitly — “shot on 35mm, shallow depth of field”, “stop-motion”, “drone footage”.",
      "Iterate short. Generate at 4 seconds until the prompt is right, then re-run it longer.",
    ],
    faq: [
      ["Can AI make a video from just text?", "Yes. Text to Video generates the footage from a written description alone, with no photo or video input."],
      ["How long can a text-to-video clip be?", "1 to 16 seconds depending on the model. Veo 3.1 is fixed at 4, 6 or 8 seconds."],
      ["Can the video have sound?", "Yes, with Veo 3.1, which generates synchronised audio. Any clip can also have a soundtrack added afterwards with Add Audio."],
      ["Which model is best for text to video?", "Seedance 1.0 Pro for cost, Veo 3.1 for 4K and audio, Seedance 2.0 for complex scenes. You can switch per generation at no extra cost."],
      ["Does it work on Android?", "No. The app is iPhone-only."],
    ],
  },
  {
    slug: "motion-control",
    rail: "Motion Control mode",
    docTitle: "How to Make a Character Copy Movement From Another Video | Photo to Video",
    metaDesc:
      "Upload a character image and a reference video, and AI transfers the movement onto your character. How Motion Control works on iPhone, and its limits.",
    h1: "How to make a character copy movement from another video",
    ogTitle: "How to transfer movement from one video onto your character",
    image: "m-motion.jpg",
    imageAlt: "A frame from an AI-generated video of a dancer, whose movement came from a separate reference clip",
    caption: "The character is from a still image. The movement came from a reference video.",
    answer:
      "Give the app a picture of your character and a video of the movement you want, and the AI generates your character performing that movement. In the Photo to Video app for iPhone this is <strong>Motion Control</strong> mode. It runs on Kling 3 at 720p, and it allows the longest clips of any mode here — up to 30 seconds.",
    steps: [
      ["Open Motion Control", "In the app, go to Modes and choose Motion Control."],
      ["Add your character", "Pick an image of the person or character to animate."],
      ["Add a reference video", "Pick the clip whose movement should be copied."],
      ["Choose a length", "Anything from 2 up to 30 seconds."],
      ["Generate and save", "The character performs the reference movement."],
    ],
    spec: [
      ["Input", "One character image plus one reference video"],
      ["Output", "Video, 720p"],
      ["Length", "2–30 seconds — the longest of any mode"],
      ["Models", "Kling 3 (the only model for this mode)"],
      ["Prompt", "Optional"],
      ["Platform", "iPhone (iOS). No Android or web version."],
      ["Pricing", "Credits per second of output. No subscription."],
    ],
    modelGuidance:
      "This mode runs on <strong>Kling 3</strong> only, so there is no model choice to make — Kling's handling of human bodies is what makes the transfer hold together. Resolution is fixed at 720p. The variable worth spending attention on is the reference clip, not the model.",
    tips: [
      "Pick a reference clip with one clearly visible person, framed head to foot. Crowds and tight crops confuse the transfer.",
      "Match the framing of your character image to the reference. A close-up portrait driven by a full-body dance rarely works.",
      "Simple, large movements transfer best. Fast footwork and hand detail are where it breaks down.",
      "Because clips can run to 30 seconds, cost adds up quickly — prove the pairing at a few seconds first.",
    ],
    faq: [
      ["Can AI make a photo copy a dance from a video?", "Yes. Motion Control takes a character image and a reference video and generates your character performing the same movement."],
      ["What is the maximum length?", "30 seconds, which is longer than any other mode in the app."],
      ["Which model does Motion Control use?", "Kling 3, the only model that supports this mode. Output is 720p."],
      ["Does the character have to be a real person?", "No. Illustrated and rendered characters work, though results are most stable when the body is fully visible and roughly human in proportion."],
      ["Can I use any video as the reference?", "Any video you own or have the right to use. Clips with a single, fully visible subject give the best transfer."],
    ],
  },
  {
    slug: "fusion",
    rail: "Fusion mode",
    docTitle: "How to Combine Several Photos Into One AI Video | Photo to Video",
    metaDesc:
      "Select up to seven subjects, backgrounds or style references and describe how they interact. How Fusion mode works on iPhone, and which model to use.",
    h1: "How to combine several photos into one AI video",
    ogTitle: "How to combine several photos into one AI video",
    image: "m-fusion.jpg",
    imageAlt: "A frame from an AI-generated video that combined several separate reference images into one scene",
    caption: "Several reference images, one generated scene.",
    answer:
      "Select up to <strong>seven</strong> reference images — people, objects, backgrounds or style references — describe how they should relate, and the AI generates one scene containing them. In the Photo to Video app for iPhone this is <strong>Fusion</strong> mode. Four models support it and clips run 1 to 16 seconds.",
    steps: [
      ["Open Fusion", "In the app, go to Modes and choose Fusion."],
      ["Add 1 to 7 references", "Subjects, backgrounds, or images that carry the style you want."],
      ["Describe the interaction", "Say how the references relate — who is where, doing what, in which setting."],
      ["Choose a model, length and resolution", "Four models support this mode; see the table below."],
      ["Generate and save", "Save the composed clip to your camera roll."],
    ],
    spec: [
      ["Input", "1–7 reference images"],
      ["Output", "Video, 360p to 1080p depending on model"],
      ["Length", "1–16 seconds depending on model"],
      ["Models", "Seedance 2.0 (default), Kling 3, Vidu Q3, Happy Horse"],
      ["Prompt", "Required — it describes how the references interact"],
      ["Platform", "iPhone (iOS). No Android or web version."],
      ["Pricing", "Credits per second of output, by model. No subscription."],
    ],
    modelGuidance:
      "<strong>Seedance 2.0</strong> is the default and the most reliable at keeping several subjects recognisable at once. <strong>Vidu Q3</strong> allows the longest clips. <strong>Kling 3</strong> is the pick when the references are people and the result needs believable bodies. <strong>Happy Horse</strong> is the cheapest per attempt, useful while you are still working out the prompt.",
    tips: [
      "Fewer references usually beats more. Two or three well-chosen images hold together better than seven competing ones.",
      "Say explicitly what each reference is for — “the woman from the first image, the beach from the second”. Left implicit, the model guesses.",
      "Use a clean cut-out or plain background for a subject you need kept intact.",
      "Reference images that disagree on lighting produce a composite that looks like one. Match them roughly.",
    ],
    faq: [
      ["How many photos can Fusion combine?", "Up to seven reference images in one generation."],
      ["Can it put two different people in the same video?", "Yes. Supply each as a reference and describe how they interact. Keeping both recognisable is easiest on the default model, Seedance 2.0."],
      ["Can I use a photo just for its style?", "Yes. A reference can be a subject, a background, or an image supplying the look, as long as your prompt says which role it plays."],
      ["How long can a Fusion clip be?", "1 to 16 seconds depending on model; Vidu Q3 allows the longest."],
      ["Is a prompt required?", "Yes. Fusion needs a prompt because it describes how the references combine."],
    ],
  },
  {
    slug: "edit-image",
    rail: "Edit Image mode",
    docTitle: "How to Edit a Photo by Describing the Change | Photo to Video",
    metaDesc:
      "Say what to change and AI re-renders the photo — swap a background, restyle a scene, keep the face intact. How Edit Image works on iPhone.",
    h1: "How to edit a photo by describing the change",
    ogTitle: "How to edit a photo just by describing the change",
    image: "m-imageedit.jpg",
    imageAlt: "An AI-edited photograph where the scene was changed from a written instruction",
    caption: "Edited from a written instruction. Facial structure, lighting and colour were preserved.",
    answer:
      "Upload a photo, write what should change, and the AI re-renders the image with that change applied — swap a background, alter clothing, restyle the scene — while keeping facial structure, lighting and colour consistent. In the Photo to Video app for iPhone this is <strong>Edit Image</strong> mode. It accepts up to four reference images and outputs a 1024-pixel image.",
    steps: [
      ["Open Edit Image", "In the app, go to Modes and choose Edit Image."],
      ["Add the photo to edit", "Plus up to three more references to guide the result."],
      ["Describe the change", "Be specific about what should change — and, if it matters, what should not."],
      ["Choose a model", "GPT Image 2 by default, or Flux Pro."],
      ["Generate and save", "The result is an image, not a video."],
    ],
    spec: [
      ["Input", "1–4 images"],
      ["Output", "Image, 1024 pixels"],
      ["Models", "GPT Image 2 (default), Flux Pro"],
      ["Prompt", "Required — it is the edit instruction"],
      ["Aspect ratios", "1:1, 9:16, 16:9, 4:3, 3:4, 3:2, 2:3, 21:9, 9:21"],
      ["Platform", "iPhone (iOS). No Android or web version."],
      ["Pricing", "Credits per image, by model. No subscription."],
    ],
    modelGuidance:
      "<strong>GPT Image 2</strong> is the default: it follows written instructions most literally, which is what you want when the edit is specific. <strong>Flux Pro</strong> costs less than half as much per image and is quicker, making it the better choice for stylistic changes and for iterating on wording before committing.",
    tips: [
      "State what must stay as well as what changes — “keep her face and pose exactly, replace the background with a snowy street”.",
      "One change at a time. Several instructions in one prompt tend to be applied partially.",
      "Add a reference image for a look you cannot describe well in words.",
      "Iterate on the cheaper model, then re-run the wording that worked on GPT Image 2.",
    ],
    faq: [
      ["Can AI edit a photo from a text instruction?", "Yes. Edit Image re-renders the photo with your described change applied, preserving facial structure, lighting and colour tone."],
      ["Does it output a video?", "No. This mode produces an image at 1024 pixels. The video modes are separate."],
      ["How many reference images can I use?", "Up to four, including the photo being edited."],
      ["Which model edits photos best?", "GPT Image 2, the default, follows instructions most literally. Flux Pro is cheaper and faster, better for style changes and for testing prompts."],
      ["Will it change the person's face?", "It is designed not to — facial structure is preserved unless your prompt asks otherwise."],
    ],
  },
];

const esc = (s) => String(s).replace(/&(?!#?\w+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const strip = (s) => String(s).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

function page(m) {
  const url = `https://havlek.ca/photo-to-video/${m.slug}/`;
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: m.h1,
    description: strip(m.answer),
    tool: [{ "@type": "HowToTool", name: "Photo to Video (iOS app)" }],
    step: m.steps.map(([name, text], i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name,
      text: strip(text),
    })),
  };
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://havlek.ca/" },
      { "@type": "ListItem", position: 2, name: "Photo to Video", item: "https://havlek.ca/photo-to-video/" },
      { "@type": "ListItem", position: 3, name: m.rail.replace(" mode", ""), item: url },
    ],
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: m.faq.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: strip(a) },
    })),
  };
  const ld = (o) => `  <script type="application/ld+json">\n  ${JSON.stringify(o, null, 2).replace(/\n/g, "\n  ")}\n  </script>`;

  return `<!DOCTYPE html>
<html lang="en" data-root="../..">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(m.docTitle)}</title>
  <meta name="description" content="${esc(m.metaDesc)}" />
  <link rel="canonical" href="${url}" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <meta name="theme-color" content="#fafafa" />
  <meta property="og:type"        content="article" />
  <meta property="og:url"         content="${url}" />
  <meta property="og:site_name"   content="Havlek" />
  <meta property="og:title"       content="${esc(m.ogTitle)}" />
  <meta property="og:description" content="${esc(strip(m.answer).slice(0, 155))}" />
  <meta property="og:image"       content="https://havlek.ca/photo-to-video/${m.image}" />
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="${esc(m.ogTitle)}" />
  <meta name="twitter:image"       content="https://havlek.ca/photo-to-video/${m.image}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Albert+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../../style.css" />
  <link rel="stylesheet" href="../product.css" />
${ld(howTo)}
${ld(crumbs)}
${ld(faqLd)}
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-D0NJSVQWWE"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-D0NJSVQWWE');
  </script>
</head>
<body data-page="photo-to-video">
<div class="shell">
<div class="side-rail left"  aria-hidden="true"><span class="rail-text">Havlek · Photo to Video</span></div>
<div class="side-rail right" aria-hidden="true"><span class="rail-text">${esc(m.rail)}</span></div>
<div id="site-nav"></div>

<main class="ap">
<section class="light">
  <div class="doc">
    <p class="crumb"><a href="../../index.html">Home</a> › <a href="../">Photo to Video</a> › ${esc(m.rail.replace(" mode", ""))}</p>

    <h1>${esc(m.h1)}</h1>

    <p class="answer">${m.answer}</p>

    <figure>
      <img src="../${m.image}" alt="${esc(m.imageAlt)}" loading="lazy" />
      <figcaption>${esc(m.caption)}</figcaption>
    </figure>

    <h2>Steps</h2>
    <ol>
${m.steps.map(([n, t]) => `      <li><strong>${esc(n)}.</strong> ${esc(t)}</li>`).join("\n")}
    </ol>

    <h2>What it supports</h2>
    <table class="spec">
${m.spec.map(([k, v]) => `      <tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join("\n")}
    </table>

    <h2>Which model to use</h2>
    <p>${m.modelGuidance}</p>

    <h2>Getting a better result</h2>
    <ul>
${m.tips.map((t) => `      <li>${esc(t)}</li>`).join("\n")}
    </ul>

    <h2>Questions</h2>
    <div class="faq">
${m.faq
  .map(
    ([q, a]) => `      <div class="qa">
        <h3>${esc(q)}</h3>
        <p>${esc(a)}</p>
      </div>`
  )
  .join("\n")}
    </div>

    <div class="cta" style="justify-content:flex-start;">
      <a href="${APP_STORE}" class="btn-ap">
        ${APPLE_SVG}
        Download on the App Store
      </a>
      <a href="../" class="link">All eleven modes ›</a>
    </div>
  </div>
</section>
</main>
<div id="site-footer"></div>
</div><!-- /.shell -->
<script src="../../components.js"></script>
</body>
</html>
`;
}

function main() {
  for (const m of MODES) {
    const dir = path.join(OUT, m.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), page(m));
    console.log(`wrote photo-to-video/${m.slug}/index.html`);
  }
  console.log(`\n${MODES.length} pages generated.`);
}

main();
module.exports = { MODES };
