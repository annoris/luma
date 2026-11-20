/* LUMA original procedural soundtrack. All voices are synthesized locally;
   no recordings, samples, third-party compositions or audio requests. */
(() => {
  'use strict';
  window.createLumaSoundtrack = () => {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return null;
    const context = new Audio();
    const master = context.createGain();
    master.gain.value = 0;
    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -20;
    compressor.knee.value = 15;
    compressor.ratio.value = 3;
    compressor.attack.value = .012;
    compressor.release.value = .25;
    master.connect(compressor);
    compressor.connect(context.destination);
    const beat = 60 / 106;
    const progression = [
      { bass: 45, notes: [57, 60, 64, 67] },
      { bass: 41, notes: [57, 60, 64, 69] },
      { bass: 48, notes: [55, 59, 62, 64] },
      { bass: 43, notes: [55, 59, 62, 69] }
    ];
    const frequency = midi => 440 * Math.pow(2, (midi - 69) / 12);
    const noise = context.createBuffer(1, context.sampleRate * .22, context.sampleRate);
    const data = noise.getChannelData(0);
    let seed = 4157;
    for (let i = 0; i < data.length; i++) {
      seed = (seed * 16807) % 2147483647;
      data[i] = (seed / 2147483647 * 2 - 1) * (1 - i / data.length);
    }
    const envelope = (level, time, attack, duration) => {
      const gain = context.createGain();
      gain.gain.setValueAtTime(.0001, time);
      gain.gain.exponentialRampToValueAtTime(level, time + attack);
      gain.gain.exponentialRampToValueAtTime(.0001, time + duration);
      gain.connect(master);
      return gain;
    };
    const tone = (midi, time, duration, level, type = 'sine') => {
      const source = context.createOscillator();
      source.type = type;
      source.frequency.value = frequency(midi);
      const filter = context.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(type === 'triangle' ? 1350 : 2600, time);
      const gain = envelope(level, time, .018, duration);
      source.connect(filter);
      filter.connect(gain);
      source.start(time);
      source.stop(time + duration + .025);
      source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
    };
    const shaker = (time, accent) => {
      const source = context.createBufferSource();
      source.buffer = noise;
      const filter = context.createBiquadFilter();
      filter.type = 'highpass'; filter.frequency.value = 6500;
      const gain = envelope(accent ? .052 : .024, time, .003, .065);
      source.connect(filter); filter.connect(gain);
      source.start(time); source.stop(time + .075);
      source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
    };
    const kick = time => {
      const source = context.createOscillator();
      source.frequency.setValueAtTime(105, time);
      source.frequency.exponentialRampToValueAtTime(43, time + .13);
      const gain = envelope(.28, time, .006, .22);
      source.connect(gain); source.start(time); source.stop(time + .24);
      source.onended = () => { source.disconnect(); gain.disconnect(); };
    };
    let timer, nextTime = 0, step = 0, active = false, revision = 0;
    const schedule = () => {
      if (!active) return;
      while (nextTime < context.currentTime + .18) {
        const bar = Math.floor(step / 16);
        const withinBar = step % 16;
        const chord = progression[Math.floor(bar / 2) % progression.length];
        if (withinBar === 0) {
          chord.notes.forEach((note, i) => tone(note, nextTime + i * .025, beat * 3.7, .043, 'triangle'));
          kick(nextTime);
        }
        if (withinBar === 8) kick(nextTime);
        if ([0, 6, 10].includes(withinBar)) tone(chord.bass, nextTime, beat * .72, .18);
        if (withinBar % 2 === 0) shaker(nextTime, withinBar % 4 === 2);
        // An original syncopated eight-bar motif, voiced from each chord.
        if ([3, 7, 10, 14].includes(withinBar)) {
          const pattern = [2, 1, 3, 0];
          const index = pattern[[3, 7, 10, 14].indexOf(withinBar)];
          tone(chord.notes[(index + (bar % 2)) % 4] + 12, nextTime, beat * .68, .065);
        }
        nextTime += beat / 4;
        step = (step + 1) % 128;
      }
    };
    return {
      async start() {
        const request = ++revision;
        await context.resume();
        if (request !== revision) return;
        if (!active) {
          active = true; nextTime = context.currentTime + .045;
          schedule(); timer = window.setInterval(schedule, 45);
        }
        master.gain.cancelScheduledValues(context.currentTime);
        master.gain.setValueAtTime(master.gain.value || .0001, context.currentTime);
        master.gain.linearRampToValueAtTime(.32, context.currentTime + .65);
      },
      async stop() {
        const request = ++revision;
        active = false; window.clearInterval(timer);
        master.gain.cancelScheduledValues(context.currentTime);
        master.gain.setValueAtTime(master.gain.value, context.currentTime);
        master.gain.linearRampToValueAtTime(0, context.currentTime + .4);
        await new Promise(resolve => window.setTimeout(resolve, 450));
        if (request === revision) await context.suspend();
      }
    };
  };
})();
