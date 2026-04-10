import { useRef, useState, useCallback } from 'react';
import * as Tone from 'tone';
import { AudioType } from '../types';

export const useAudio = () => {
  const synth = useRef<Tone.PolySynth | null>(null);
  const membrane = useRef<Tone.MembraneSynth | null>(null);
  const [isOn, setIsOn] = useState(false);

  const init = useCallback(async () => {
    if (isOn) return;
    try {
      await Tone.start();
      synth.current = new Tone.PolySynth(Tone.Synth).toDestination();
      membrane.current = new Tone.MembraneSynth().toDestination();
      
      // Initial volume
      Tone.getDestination().volume.value = Tone.gainToDb(0.5);
      
      setIsOn(true);
    } catch (e) {
      console.error("Audio init failed", e);
    }
  }, [isOn]);

  const setVolume = useCallback((volume: number) => {
    if (!isOn) return;
    // Map 0-1 to dB (-Infinity to 0)
    const db = volume === 0 ? -100 : Tone.gainToDb(volume);
    Tone.getDestination().volume.rampTo(db, 0.1);
  }, [isOn]);

  const play = useCallback((type: AudioType, note?: string | string[]) => {
    if (!isOn) return;
    try {
      switch (type) {
        case 'click':
          membrane.current?.triggerAttackRelease("C2", "32n");
          break;
        case 'pop':
          membrane.current?.triggerAttackRelease("E3", "32n");
          break;
        case 'correct':
          synth.current?.triggerAttackRelease(["C5", "E5"], "16n");
          break;
        case 'incorrect':
          membrane.current?.triggerAttackRelease("A1", "8n");
          break;
        case 'note':
          if (note) synth.current?.triggerAttackRelease(note, "8n");
          break;
        case 'win':
          const now = Tone.now();
          synth.current?.triggerAttackRelease(["C4", "E4", "G4"], "8n", now);
          synth.current?.triggerAttackRelease(["E4", "G4", "B4"], "8n", now + 0.15);
          synth.current?.triggerAttackRelease(["C5", "E5", "G5"], "4n", now + 0.3);
          break;
      }
    } catch (e) {
      console.warn('Audio error', e);
    }
  }, [isOn]);

  const toggle = useCallback(async () => {
    if (isOn) {
      setIsOn(false);
      return;
    }

    await init();
  }, [init, isOn]);

  return { init, play, isOn, toggle, setVolume };
};
