export const msToFrame = (ms: number, fps: number) => {
  return Math.floor((ms / 1000) * fps);
};

export const FPS = 30;
