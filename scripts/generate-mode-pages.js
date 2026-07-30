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
    useCases: [
      [
            "A family photo you have only ever seen as a still",
            "One image is all it needs, and the prompt is optional — leave it blank and the model infers breathing, blinking and small head movement on its own. Start on Seedance 1.0 Pro at 4 seconds; longer clips tend to drift on faces.",
            "she breathes and blinks, small natural head movement, camera holds still"
      ],
      [
            "A portrait for a profile or a post",
            "Subtle motion reads as intentional where a big movement reads as an effect. Keep it under 5 seconds and ask for one thing.",
            "hair lifts slightly in a breeze, she turns her eyes toward the camera"
      ],
      [
            "A landscape or travel shot",
            "Skies, water and foliage animate more convincingly than people, because small inaccuracies go unnoticed. This is where longer clips are worth the credits.",
            "clouds drift left, water ripples, grass moves in the wind, slow push in"
      ],
      [
            "A product shot for a listing",
            "Rotation and light movement sell an object without misrepresenting it. Veo 3.1 if the listing needs 4K.",
            "the bottle rotates slowly on its axis, highlight sweeps across the glass"
      ]
],
    limits: "Hands, teeth and any text in the image are where it breaks first. Fast or full-body movement from a single still is unreliable — that is what Motion Control is for. Group photos degrade faster than a single subject, because every face is another chance to go wrong.",
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
    useCases: [
      [
            "A before and after you want as one continuous shot",
            "Renovations, haircuts, fitness progress, a repaint. The two frames give the endpoints; the prompt decides whether it reads as a reveal or a morph.",
            "the room transforms as the camera holds still, old furniture dissolving into the new layout"
      ],
      [
            "The same place in two seasons or times of day",
            "Shoot from roughly the same spot and the result looks like a timelapse you never shot.",
            "the scene shifts from summer afternoon to winter dusk, snow gathering, lights coming on"
      ],
      [
            "Two outfits, two colourways, two product variants",
            "Useful in retail where a side-by-side would be flat. Keep the pose and framing identical between the two frames.",
            "the jacket changes from black to tan, she stays in the same pose"
      ],
      [
            "A character turning to face you",
            "First frame in profile, last frame to camera. Kling 3 handles this most convincingly.",
            "she turns her head toward the camera and smiles"
      ]
],
    limits: "Two images that disagree on framing, lighting or subject give a stylised morph rather than movement — occasionally interesting, rarely what you asked for. It cannot invent a middle it has no basis for: endpoints that imply a cut will look like a cut.",
    faq: [
      ["Can AI create the frames between two photos?", "Yes. Transition mode generates the motion connecting a start and end frame, rather than cross-fading between the two images."],
      ["How long can a transition clip be?", "It depends on the model: Seedance 1.0 Pro covers 2\u201312 seconds, Wan 2.7 up to 15, and Vidu Q3 up to 16. Hailuo-02 offers fixed 6 or 10 second clips."],
      ["Do the two photos have to be similar?", "No, but the closer they are in subject, framing and lighting, the more believable the motion. Two unrelated images produce a stylised morph."],
      ["Can it output 4K?", "Yes, with Veo 3.1, at 4, 6 or 8 seconds. The other models top out at 1080p."],
      ["What does a transition cost?", "Credits are charged per second and vary by model, so a short clip on the default model costs the least. There is no subscription \u2014 credit packs are bought only when you generate."],
    ],
  },
  {
    slug: "create-image",
    rail: "Create Image mode",
    docTitle: "How to Generate an Image From a Text Prompt on iPhone | Photo to Video",
    metaDesc:
      "Describe an image and AI generates it, square through ultra-wide. Which of the two models to use, what it costs, and how to then animate the result.",
    h1: "How to generate an image from a text prompt",
    ogTitle: "How to generate an image from a text prompt on iPhone",
    image: "m-createimage.jpg",
    imageAlt: "An image generated from a written prompt",
    caption: "Generated from a written prompt. Nothing was uploaded.",
    answer:
      "Describe what you want and the AI renders it as a still image at 1024 pixels, in any aspect ratio from square to 21:9. In the Photo to Video app for iPhone this is <strong>Create Image</strong> mode. You can also supply up to four reference images to steer the look \u2014 and because this app also animates stills, the result can go straight into a video.",
    steps: [
      ["Open Create Image", "In the app, go to Modes and choose Create Image."],
      ["Describe the image", "Say what is in it, and in what style."],
      ["Optionally add references", "Up to four images to guide subject or style."],
      ["Pick a model and aspect ratio", "GPT Image 2 or Flux; nine ratios from 1:1 to 21:9."],
      ["Generate, then animate it if you want", "The still can be fed into Photo to Video mode."],
    ],
    spec: [
      ["Input", "A prompt, plus 0\u20134 optional reference images"],
      ["Output", "Image, 1024 pixels"],
      ["Aspect ratios", "1:1, 9:16, 16:9, 4:3, 3:4, 3:2, 2:3, 21:9, 9:21"],
      ["Models", "GPT Image 2 (default), Flux \u2014 Dev and Pro tiers"],
      ["Prompt", "Required"],
      ["Platform", "iPhone (iOS). No Android or web version."],
      ["Pricing", "Credits per image: 17 on GPT Image 2, 2 on Flux. No subscription."],
    ],
    modelGuidance:
      "The cost gap here is unusually wide: <strong>GPT Image 2</strong> is 17 credits an image and follows a written description most literally, including text inside the image. <strong>Flux</strong> is <strong>2 credits</strong> \u2014 roughly an eighth \u2014 and is fast and strong on style, which makes it the sensible place to iterate on wording before spending on a final render.",
    tips: [
      "Draft on Flux, finish on GPT Image 2. At 2 credits versus 17, there is no reason to iterate on the expensive model.",
      "Pick the aspect ratio for where it will end up \u2014 9:16 for a phone-screen video, 16:9 for anything landscape.",
      "Name a medium and a light source: \u201coil painting, late afternoon side light\u201d does more work than a list of adjectives.",
      "If you plan to animate the result, leave some empty space around the subject \u2014 tightly cropped images have less room to move.",
    ],
    useCases: [
      [
            "A still you intend to animate",
            "Generating the frame first and animating it second gives you control over composition that one text-to-video pass does not. Leave space around the subject so there is room to move.",
            "a lone red umbrella on an empty beach, overcast light, wide composition, 16:9"
      ],
      [
            "Cover art or a thumbnail at a specific shape",
            "Nine aspect ratios, so you generate at the shape you need instead of cropping down to it.",
            "bold graphic portrait, high contrast, single light source, 9:16"
      ],
      [
            "Iterating on a concept before committing",
            "Flux at 2 credits against GPT Image 2 at 17 makes exploration nearly free. Settle the wording cheaply, render the final once.",
            "concept sketch of a folding electric scooter, three-quarter view, studio grey"
      ],
      [
            "An image containing readable text",
            "GPT Image 2 is the only model here that renders text with any reliability, and it earns its credits when the text is the point.",
            "a vintage enamel sign reading OPEN ALL NIGHT, chipped paint, warm light"
      ]
],
    limits: "Output is fixed at 1024 pixels — fine for screens, not for anything printed large. Flux is fast and cheap but follows instructions loosely; if the brief is precise, the cheap model will fight you. Neither model reliably reproduces a specific real person or brand.",
    faq: [
      ["Can this app generate images, not just video?", "Yes. Create Image produces a still image at 1024 pixels from a prompt, with no video involved."],
      ["Which image model is cheaper?", "Flux, at 2 credits per image versus 17 for GPT Image 2 \u2014 about an eighth of the cost."],
      ["Can I control the shape of the image?", "Yes, nine aspect ratios from 1:1 to 21:9 and 9:21."],
      ["Can I use a reference image?", "Yes, up to four, to guide the subject or the style."],
      ["Can a generated image then be animated?", "Yes. Feed it into Photo to Video mode and the app animates it like any other still."],
    ],
  },
  {
    slug: "edit-video",
    rail: "Edit Video mode",
    docTitle: "How to Edit a Video by Describing the Change | Photo to Video",
    metaDesc:
      "Upload a clip, say what should change, and AI re-renders it \u2014 restyle the whole scene or alter one element. How Edit Video works on iPhone.",
    h1: "How to edit a video by describing the change",
    ogTitle: "How to edit a video just by describing the change",
    image: "m-editvideo.jpg",
    imageAlt: "A frame from a video that was restyled by an AI from a written instruction",
    caption: "The clip was re-rendered from a written instruction.",
    answer:
      "Upload a clip, write what should change, and the AI re-renders the video with that change applied \u2014 restyle the whole scene, or alter one element in it while the rest holds. In the Photo to Video app for iPhone this is <strong>Edit Video</strong> mode. Clips run 3 to 15 seconds at 720p or 1080p, and you can add reference images to steer the result.",
    steps: [
      ["Open Edit Video", "In the app, go to Modes and choose Edit Video."],
      ["Add the clip to edit", "Pick a video from your camera roll."],
      ["Optionally add reference images", "Useful when the change is a look you can show but not easily describe."],
      ["Describe the change", "Be specific about what changes \u2014 and what must stay."],
      ["Generate and save", "The result is a new clip; the original is untouched."],
    ],
    spec: [
      ["Input", "One video, plus optional reference images"],
      ["Output", "Video, 720p or 1080p"],
      ["Length", "3\u201315 seconds"],
      ["Aspect ratio", "Follows the source clip"],
      ["Models", "Happy Horse"],
      ["Prompt", "Required \u2014 it is the edit instruction"],
      ["Platform", "iPhone (iOS). No Android or web version."],
      ["Pricing", "Credits per second, and this mode is the most expensive per second in the app \u2014 keep edits short."],
    ],
    modelGuidance:
      "This mode runs on <strong>Happy Horse</strong> only, so there is no model decision. What does need a decision is length: video-to-video editing bills for the clip going in as well as the clip coming out, which makes it the priciest mode per second here. Trim before you edit rather than after.",
    tips: [
      "Trim to the seconds you actually need first. Cost scales directly with length, and this mode is the most expensive per second in the app.",
      "State what must not change. \u201cKeep the subject and framing, change the season to winter\u201d holds together far better than \u201cmake it wintry\u201d.",
      "One change per pass. Stacked instructions get applied partially.",
      "Test the wording on a 3-second cut before committing to the full clip.",
    ],
    useCases: [
      [
            "Restyling footage to match a look",
            "The most reliable use of this mode: change the overall grade, era or medium of a clip rather than one element inside it.",
            "restyle this clip as 1970s 16mm film, warm grain, softer contrast"
      ],
      [
            "Changing the season or time of day",
            "A whole-scene change the model applies consistently across frames, which is where video-to-video beats editing stills one by one.",
            "change the scene to winter: bare trees, snow on the ground, overcast light; keep the subject and camera move"
      ],
      [
            "Replacing a background you cannot reshoot",
            "Say explicitly what holds still. Without that, the subject gets reinterpreted along with the background.",
            "keep the subject and their movement exactly; replace the background with a quiet city street at night"
      ],
      [
            "Fixing one distracting element",
            "Possible, but the least reliable use — the model works the whole frame, so a local change can pull the rest with it. Trim to the shortest cut containing the problem.",
            "remove the bright sign in the top right; keep everything else identical"
      ]
],
    limits: "This is the most expensive mode per second in the app, because video-to-video bills the clip going in as well as the one coming out — trim before you edit, not after. Localised changes are unreliable next to whole-scene ones, and the maximum length is 15 seconds.",
    faq: [
      ["Can AI edit an existing video from a text instruction?", "Yes. Edit Video re-renders your clip with the described change applied, and leaves the original untouched."],
      ["How long a clip can it edit?", "3 to 15 seconds, at 720p or 1080p."],
      ["Why is this mode more expensive?", "Video-to-video editing bills for the input clip as well as the output, so cost scales with length in both directions. Trim before editing."],
      ["Can I show it a style instead of describing one?", "Yes \u2014 add reference images alongside the clip."],
      ["Does it change the whole video or just part?", "Either. You can restyle the entire scene or ask for one element to change while the rest stays."],
    ],
  },
  {
    slug: "extend-video",
    rail: "Extend mode",
    docTitle: "How to Make a Video Longer With AI | Photo to Video",
    metaDesc:
      "Continue a clip by 5 or 8 seconds and AI generates what happens next, matching the existing style and motion. How Extend works on iPhone.",
    h1: "How to make a video longer with AI",
    ogTitle: "How to make a video longer with AI",
    image: "m-extend.jpg",
    imageAlt: "A frame from a clip that an AI continued beyond its original ending",
    caption: "The clip continues past where the original footage ended.",
    answer:
      "Pick a clip and the AI generates <strong>5 or 8 more seconds</strong> of it, continuing the motion and style rather than looping or freezing. In the Photo to Video app for iPhone this is <strong>Extend</strong> mode. It is one of the cheapest per second in the app, and it works on generated clips and camera-roll footage alike.",
    steps: [
      ["Open Extend", "In the app, go to Modes and choose Extend."],
      ["Pick the clip to continue", "Either something you generated or a video from your camera roll."],
      ["Choose 5 or 8 extra seconds", "Those are the two lengths available."],
      ["Choose a resolution", "360p through 1080p."],
      ["Generate and save", "The new clip carries on from where the original ended."],
    ],
    spec: [
      ["Input", "One video"],
      ["Output", "Video, 360p to 1080p"],
      ["Added length", "5 or 8 seconds"],
      ["Aspect ratio", "Follows the source clip"],
      ["Models", "PixVerse \u2014 Standard and Fast tiers"],
      ["Prompt", "Optional"],
      ["Platform", "iPhone (iOS). No Android or web version."],
      ["Pricing", "Credits per second \u2014 among the lowest rates in the app. No subscription."],
    ],
    modelGuidance:
      "This mode runs on <strong>PixVerse</strong>, with a Standard and a Fast tier. Fast costs less and returns sooner; Standard holds detail better on busy footage. At roughly a seventh of the per-second rate of Edit Video, extending is one of the cheaper things you can do here.",
    tips: [
      "Extend clips that end mid-movement. A clip that has already come to rest gives the model nothing to continue.",
      "Extend before you upscale, not after \u2014 otherwise you pay to sharpen frames you are about to add to.",
      "Chain extensions to go further than 8 seconds, checking each pass; drift accumulates.",
      "A short prompt helps when you want the continuation to go somewhere specific rather than simply carry on.",
    ],
    useCases: [
      [
            "A clip that is a beat too short for where it is going",
            "Platform minimums and music cuts are the usual reason. Five extra seconds is often all that is missing.",
            "prompt optional — leave it blank to simply carry on"
      ],
      [
            "Getting past a model's maximum length",
            "Generate at a model's ceiling, then extend. Chaining passes goes further than any single generation allows.",
            "check each pass; drift accumulates across chained extensions"
      ],
      [
            "Room for a voiceover or caption to land",
            "Cheaper than regenerating the whole clip longer, and it keeps the part you already approved.",
            "extend by 8 seconds, hold the same camera move"
      ],
      [
            "Continuing your own camera footage",
            "It works on camera-roll video, not only generated clips — useful when real footage stops just before the moment you wanted.",
            "the wave finishes breaking and washes up the sand"
      ]
],
    limits: "A clip that has already come to rest gives the model nothing to continue, so extensions of static endings look invented. Drift compounds when you chain passes — check each rather than stacking three and hoping. Only 5 or 8 seconds per pass.",
    faq: [
      ["Can AI make a short video longer?", "Yes. Extend generates 5 or 8 additional seconds that continue the existing motion and style, rather than looping or holding a frame."],
      ["How much longer can it make a clip?", "5 or 8 seconds per pass. You can run it again on the result to go further."],
      ["Does it work on my own footage?", "Yes \u2014 camera-roll video as well as clips generated in the app."],
      ["What is the difference between the Standard and Fast tiers?", "Fast is cheaper and quicker; Standard holds detail better on detailed or fast-moving footage."],
      ["Should I extend or upscale first?", "Extend first. Upscaling before extending means paying to sharpen frames you then add to."],
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
    useCases: [
      [
            "A shot you need but have no footage for",
            "An establishing shot, a texture, a mood insert. Faster than sourcing stock and specific to your brief.",
            "low-angle shot of a red kite rising over wet sand at dusk, camera tilts up, 35mm"
      ],
      [
            "B-roll to cut between talking-head footage",
            "Generate several 4-second variations and keep the two that cut cleanly. This is where the cheaper models earn their place.",
            "hands close a laptop on a wooden desk, warm window light, shallow depth of field"
      ],
      [
            "Testing an ad idea before committing to a shoot",
            "A rough generated version answers whether the concept reads at all, for a fraction of a day's production.",
            "a runner crosses an empty bridge at sunrise, camera tracks alongside, breath visible"
      ],
      [
            "A clip that needs its own sound",
            "Veo 3.1 generates synchronised audio in the same pass, which no other model here does.",
            "rain on a tin roof at night, a single lamp swinging, distant thunder"
      ]
],
    limits: "Text inside the frame comes out wrong more often than right. Prompts asking for a sequence of events tend to deliver neither half. Anything needing a specific real person, logo or place will be an approximation, not that thing.",
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
    useCases: [
      [
            "Making a character perform a dance or routine",
            "The reference clip supplies timing and body mechanics, which is why this works where a prompt alone would not. Frame your character head to foot to match.",
            "no prompt needed — the reference video carries the movement"
      ],
      [
            "Reusing one performance across several characters",
            "Pick the movement once, then run it against each character image. The motion stays consistent in a way separate generations never would.",
            "same reference clip, a different character image each run"
      ],
      [
            "Giving an illustrated character believable body movement",
            "Drawn and rendered characters work, provided the proportions are roughly human — the transfer maps a skeleton it needs to recognise.",
            "keep the character fully visible, no tight crop"
      ],
      [
            "A longer sequence than other modes allow",
            "This mode reaches 30 seconds, the longest in the app, making it the only route to a full routine in one clip.",
            "prove the pairing at a few seconds before paying for thirty"
      ]
],
    limits: "Fast footwork, hand detail and limbs crossing the body are where the transfer visibly fails. Crowded reference clips confuse it — one clearly visible person only. Output is fixed at 720p, so this is not the mode for something that must look sharp full screen.",
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
    useCases: [
      [
            "Two people who were never photographed together",
            "Supply each as a reference and say which is which. Seedance 2.0, the default, is the most reliable at keeping both recognisable.",
            "the woman from the first image and the man from the second walk side by side along the shore"
      ],
      [
            "A product in a setting you do not have access to",
            "One reference for the product, one for the location. Cheaper than a location shoot, and repeatable.",
            "the sneaker from the first image sits on the wet rocks from the second, waves behind"
      ],
      [
            "Borrowing a look you cannot put into words",
            "Use a reference purely for style and say so — otherwise the model treats it as a subject to include.",
            "the subject from the first image, in the colour palette and grain of the second"
      ],
      [
            "Building a scene from parts",
            "Subject, background and a prop as three references. Two or three beat seven — more references compete rather than combine.",
            "the dog from the first image runs through the field in the second, ball from the third in its mouth"
      ]
],
    limits: "Recognisability drops as you add references — seven is the ceiling, not the target. References that disagree on lighting produce a composite that looks composited. For a face that must stay exact, edit an image instead.",
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
    useCases: [
      [
            "Changing a background without reshooting",
            "State that the subject must stay exactly as it is, or the model reinterprets them along with the background.",
            "keep her face, pose and clothing exactly as they are; replace the background with a snowy street at dusk"
      ],
      [
            "Colour and material variants of a product",
            "One photo becomes a range. Flux is cheap enough to generate every variant and keep what works.",
            "change the chair upholstery to olive green linen, keep the frame, lighting and shadows identical"
      ],
      [
            "Removing something you cannot crop out",
            "A sign, a bystander, a cable. Say what should be there instead, not only what to remove.",
            "remove the parked car; continue the brick wall and pavement behind it"
      ],
      [
            "Getting a still ready to animate",
            "Fix the frame first, then send it to Photo to Video. Cleaning up a still is far cheaper than regenerating a video that inherited the problem.",
            "remove the date stamp in the corner, keep everything else untouched"
      ]
],
    limits: "Several instructions in one prompt get applied partially — one change per pass. Output is 1024 pixels, so this is not a retouching tool for print. Text in the image is as unreliable here as anywhere else.",
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
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-DZ68DBPDFV"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-DZ68DBPDFV');
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

    <h2>What people use it for</h2>
${m.useCases.map(([sit, why, prompt]) => `    <h3>${esc(sit)}</h3>
    <p>${esc(why)}</p>
    <p class="pex"><span>Prompt</span> ${esc(prompt)}</p>`).join("\n")}

    <h2>Where it struggles</h2>
    <p>${esc(m.limits)}</p>

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
