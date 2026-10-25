// Web Audio API pure synthesizer for ambient soundscapes

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private rainGain: GainNode | null = null;
  private fireGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isPlayingRain: boolean = false;
  private isPlayingFire: boolean = false;
  private rainNode: AudioNode | null = null;
  private fireInterval: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleRain(volume: number = 0.3): boolean {
    this.initContext();
    if (!this.ctx || !this.masterGain) return false;

    if (this.isPlayingRain) {
      this.stopRain();
      return false;
    } else {
      this.startRain(volume);
      return true;
    }
  }

  public toggleFire(volume: number = 0.3): boolean {
    this.initContext();
    if (!this.ctx || !this.masterGain) return false;

    if (this.isPlayingFire) {
      this.stopFire();
      return false;
    } else {
      this.startFire(volume);
      return true;
    }
  }

  private startRain(volume: number) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.11;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.setValueAtTime(volume * 0.4, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.rainGain);
    this.rainGain.connect(this.masterGain);

    whiteNoise.start();
    this.rainNode = whiteNoise;
    this.isPlayingRain = true;
  }

  private stopRain() {
    if (this.rainNode) {
      try {
        (this.rainNode as AudioScheduledSourceNode).stop();
      } catch {
        // ignore
      }
      this.rainNode = null;
    }
    this.isPlayingRain = false;
  }

  private startFire(volume: number) {
    if (!this.ctx || !this.masterGain) return;
    this.fireGain = this.ctx.createGain();
    this.fireGain.gain.setValueAtTime(volume * 0.5, this.ctx.currentTime);
    this.fireGain.connect(this.masterGain);
    this.isPlayingFire = true;

    // Simulate crackles
    const makeCrackle = () => {
      if (!this.isPlayingFire || !this.ctx || !this.fireGain) return;
      const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.05, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.01));
      }
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800 + Math.random() * 2400, this.ctx.currentTime);
      filter.Q.setValueAtTime(3 + Math.random() * 5, this.ctx.currentTime);

      source.connect(filter);
      filter.connect(this.fireGain);
      source.start();

      const nextDelay = 80 + Math.random() * 250;
      this.fireInterval = window.setTimeout(makeCrackle, nextDelay);
    };

    makeCrackle();
  }

  private stopFire() {
    if (this.fireInterval) {
      clearTimeout(this.fireInterval);
      this.fireInterval = null;
    }
    this.isPlayingFire = false;
  }

  public setMasterVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }

  public getStatus() {
    return {
      rain: this.isPlayingRain,
      fire: this.isPlayingFire
    };
  }

  public stopAll() {
    this.stopRain();
    this.stopFire();
  }
}

export const ambientAudio = new AmbientAudioEngine();
