// THE UNFOLDING - edit all of the experience copy and date settings here.
// Set enabled: false to make the experience available immediately.

export const dateGate = {
  enabled: true,
  year: 2026,
  month: 7, // zero-indexed: 7 = August
  day: 14,
  hour: 0,
  minute: 0,
  timeZone: 'Asia/Dhaka',
}

// Preview access is intended for testing before the release date. Visit
// /admin/pass?birthday-preview to unlock this browser permanently.
// Change `password` before sharing the preview link.
export const previewAccess = {
  password: 'birthday-preview',
  storageKey: 'the-unfolding-preview-unlocked',
}

export const experience = {
  recipient: 'dear Suha',
  signature: 'with all my love',
  cards: [
    { line: 'A little pause, saved especially for you.', accent: 'orbit' },
    { line: 'For all the ways you make ordinary days feel softer.', accent: 'petals' },
    { line: 'For the laughter that always finds its way back.', accent: 'ripple' },
    { line: 'For your brave heart and its beautiful becoming.', accent: 'blob' },
    { line: 'For every quiet wish still gathering its light.', accent: 'constellation' },
    { line: 'And for one more year of your particular magic.', accent: 'sun' },
    { line: 'There is one last thing I wanted to tell you.', accent: 'fold' },
  ],
  letter: [
    'Suha, today, I hope you feel how deeply you are held.',
    'Not only in the big moments, but in the small ones too: the pauses, the beginnings, the days that ask you to keep going.',
    'May this next year meet you gently, surprise you kindly, and leave room for every version of joy.',
    'Happy birthday. I am so glad you are here.',
  ],
  // A final, small surprise revealed by the seal at the end of the letter.
  keepsake: 'For Suha, and for every beautiful day still waiting for us.',
  garden: {
    title: 'a little garden for Suha',
    prompt: 'touch the ground and leave a wish',
    complete: 'A garden made, just for you.',
    maxTrees: 22,
    wishes: [
      'May you always find your way back to wonder.',
      'May soft days find you often.',
      'May your laughter keep filling the room.',
      'May every brave choice lead somewhere beautiful.',
      'May you feel loved in all your quiet moments.',
      'May life surprise you gently.',
      'May this year feel like coming home.',
    ],
  },
  wish: {
    title: 'one small wish',
    prompt: 'hold the flame for a moment',
    complete: 'Your wish has somewhere to go.',
  },
  sketch: {
    closedEyebrow: 'after the wish, a quiet surprise',
    closedTitle: 'one page was still waiting',
    closedPrompt: 'tap the sketchbook to open it',
    openEyebrow: 'a tiny atlas of impossible light',
    openTitle: 'six pieces of the night',
    pages: [
      {
        kicker: 'page one · look closer',
        title: 'the dark was never empty',
        note: 'Even from impossibly far away, some kinds of light still find us.',
      },
      {
        kicker: 'page two · little infinities',
        title: 'the sky keeps making art',
        note: 'No two stars arrive in quite the same way. Neither do the beautiful things you make.',
      },
      {
        kicker: 'page three · for Suha',
        title: 'keep a universe of your own',
        note: 'May you always have new things to imagine, quiet places to create, and enough wonder left to look up.',
      },
    ],
    credit: 'imagery · NASA / Hubble',
    finishLabel: 'complete',
  },
  final: {
    title: 'For your new year of life, Suha.',
    lines: [
      'May you live long, laugh often, and never forget how much light you carry.',
      'May we keep finding small reasons to choose each other, and make the time we share feel like the most valuable thing.',
      'Here is to more days with you.',
    ],
    signoff: 'Always, with love.',
    jarLabel: 'one last gift',
  },
  jar: {
    storageKey: 'the-unfolding-love-jar-discovered',
    cooldownStorageKey: 'the-unfolding-love-jar-cooldown',
    indexesStorageKey: 'the-unfolding-love-jar-indexes',
    cooldownMs: 10 * 60 * 1000,
    shortcutLabel: 'Love Jar',
    eyebrow: 'a little something to keep',
    title: 'A jar for every kind of day.',
    prompt: 'Choose what your heart needs, and take one folded note.',
    jarLabel: 'for Suha',
    drawAgain: 'draw another',
    closeNote: 'fold it back',
    reopenNote: 'read your last note',
    cooldownLabel: 'Let this one stay with you for a little while.',
    readyLabel: 'The jar is ready again.',
    categories: [
      {
        id: 'anytime',
        label: 'open anytime',
        shortLabel: 'anytime',
        color: 'pink',
        notes: [
          'No big reason for this one. I just love you, and I wanted you to be reminded of that today.',
          'I hope you know how much better my normal days feel because you are part of them.',
          'You never have to be in a good mood or have everything figured out for me to love being with you.',
          'Drink some water, relax your shoulders, and take a proper breath. Yes, I am looking after you from inside a tiny paper note.',
          'Out of everyone in this huge world, somehow I found you. I still think that is pretty amazing.',
          'You crossed my mind again. To be fair, you spend a lot of time there.',
          'I love hearing the small details of your day, even the parts you think are boring. They never feel boring when they are yours.',
          'Just a reminder that you do not need to do anything impressive today. Being Suha is already enough for me.',
          'If I were beside you right now, I would probably look at you for too long and then pretend I was not staring.',
          'Thank you for being the person I can be soft with. That means more to me than I always know how to say.',
        ],
      },
      {
        id: 'happy',
        label: 'when you are happy',
        shortLabel: 'happy',
        color: 'blue',
        notes: [
          'I wish I could see your face right now. I know that happy smile, and I love it so much.',
          'Tell me what happened. Start from the beginning and do not skip the tiny details.',
          'You deserve this good moment. Please enjoy it without worrying about what comes next.',
          'Your happiness makes me happy too. It is honestly that simple.',
          'I hope today becomes one of those memories that randomly makes you smile months from now.',
          'Whatever went right today, I am proud of you. Even if it was mostly luck, I am still taking the chance to be proud.',
          'I love the way you sound when you are excited about something. I could listen to that version of you for hours.',
          'Save a little piece of this feeling for a harder day. You made it to a good moment, and there will be more of them.',
          'If we were together, this is where I would insist that we celebrate, even if the celebration was only snacks and a long call.',
          'Seeing you happy is one of my favorite things. Keep smiling for a bit longer, okay?',
        ],
      },
      {
        id: 'upset',
        label: 'when you are upset',
        shortLabel: 'upset',
        color: 'red',
        notes: [
          'You do not have to fix everything tonight. Let today end first. We can deal with the rest when your head feels quieter.',
          'If someone made you feel small, please do not help them by being cruel to yourself too.',
          'You are allowed to be angry. You do not have to make your feelings look pretty for me.',
          'Take a breath before you reply to anyone. I know you have a lot to say, but give yourself a minute first.',
          'A bad day does not make you difficult to love. I am still here, and I am not going anywhere because you feel upset.',
          'Please eat something if you have not. Half the time the world feels worse because you are tired and running on nothing.',
          'You can tell me the messy version. You do not need to organize your feelings before bringing them to me.',
          'Whatever happened, we will get through the part that feels impossible right now. One small step, then another.',
          'Do not force yourself to be okay quickly. Take the time you actually need, not the time other people expect.',
          'I wish I could sit next to you quietly until you felt ready to talk. For now, imagine me doing exactly that.',
        ],
      },
      {
        id: 'miss',
        label: 'when you miss me',
        shortLabel: 'miss me',
        color: 'dark',
        notes: [
          'I miss you too. I miss your voice, your face, and even the little things you do that you probably never notice.',
          'If I were there, I would pull you close and stay like that until one of us complained about getting uncomfortable.',
          'Distance is annoying, but it does not change what you mean to me. Not even a little.',
          'Send me whatever is on your mind, even if it is just one word. I always want to hear from you.',
          'I keep saving small stories to tell you because everything feels more complete once I have shared it with you.',
          'Look at the sky for a second. I know it is cheesy, but I like knowing we can both look at the same one.',
          'I wish this note could give you a real hug. It would be a long one, just so you know.',
          'Missing you is really just another way of noticing how much space you have made in my life.',
          'One day this waiting will be over and I will get to see you again. I am holding on to that thought with you.',
          'Until I can be there, keep this close: you are loved, you are missed, and you are never far from my mind.',
        ],
      },
    ],
  },
}
