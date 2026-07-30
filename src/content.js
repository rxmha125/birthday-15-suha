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
  final: {
    title: 'For your new year of life, Suha.',
    lines: [
      'May you live long, laugh often, and never forget how much light you carry.',
      'May we keep finding small reasons to choose each other, and make the time we share feel like the most valuable thing.',
      'Here is to more days with you.',
    ],
    signoff: 'Always, with love.',
  },
}
