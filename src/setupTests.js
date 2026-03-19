import '@testing-library/jest-dom';

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: () => ({
    setTransform: () => {},
    clearRect: () => {},
    createRadialGradient: () => ({
      addColorStop: () => {},
    }),
    beginPath: () => {},
    arc: () => {},
    fill: () => {},
    fillRect: () => {},
    moveTo: () => {},
    lineTo: () => {},
    stroke: () => {},
  }),
});
