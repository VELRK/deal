/**
 * Pure 60fps HTML5 Canvas particle confetti system with heart & festive shapes.
 * Zero external dependencies. Safe and non-blocking.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  alpha: number;
  decay: number;
  shape: "heart" | "circle" | "rect" | "star";
}

const COLORS = [
  "#3ec1bc", // Theme teal
  "#e53935", // Vibrant red
  "#ff4081", // Heart pink
  "#ffb300", // Gold
  "#ab47bc", // Purple
  "#ffffff", // White
];

export function fireWishlistConfetti(originX?: number, originY?: number) {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = width;
  canvas.height = height;
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "999999";
  document.body.appendChild(canvas);

  const startX = originX && originX > 0 ? originX : width / 2;
  const startY = originY && originY > 0 ? originY : height / 3;

  const particles: Particle[] = [];
  const count = 55;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 9 + 4;
    const shapes: ("heart" | "circle" | "rect" | "star")[] = [
      "heart",
      "heart",
      "circle",
      "rect",
      "star",
    ];

    particles.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 3,
      vy: Math.sin(angle) * speed - Math.random() * 6 - 2, // Slight upward bias
      size: Math.random() * 8 + 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.2,
      alpha: 1,
      decay: Math.random() * 0.015 + 0.012,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    });
  }

  let animationFrameId: number;

  function drawHeart(c: CanvasRenderingContext2D, size: number) {
    c.beginPath();
    const topCurveHeight = size * 0.3;
    c.moveTo(0, topCurveHeight);
    c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
    c.bezierCurveTo(
      -size / 2,
      (size + topCurveHeight) / 2,
      0,
      (size + topCurveHeight) / 2,
      0,
      size
    );
    c.bezierCurveTo(
      0,
      (size + topCurveHeight) / 2,
      size / 2,
      (size + topCurveHeight) / 2,
      size / 2,
      topCurveHeight
    );
    c.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
    c.closePath();
    c.fill();
  }

  function drawStar(c: CanvasRenderingContext2D, r: number) {
    c.beginPath();
    for (let i = 0; i < 5; i++) {
      c.lineTo(
        Math.cos(((18 + i * 72) * Math.PI) / 180) * r,
        -Math.sin(((18 + i * 72) * Math.PI) / 180) * r
      );
      c.lineTo(
        Math.cos(((54 + i * 72) * Math.PI) / 180) * (r / 2),
        -Math.sin(((54 + i * 72) * Math.PI) / 180) * (r / 2)
      );
    }
    c.closePath();
    c.fill();
  }

  function render() {
    ctx!.clearRect(0, 0, width, height);

    let activeCount = 0;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.alpha <= 0) continue;

      activeCount++;

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.28; // gravity
      p.vx *= 0.98; // air resistance
      p.rotation += p.vRot;
      p.alpha -= p.decay;

      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate(p.rotation);
      ctx!.globalAlpha = Math.max(0, p.alpha);
      ctx!.fillStyle = p.color;

      if (p.shape === "heart") {
        drawHeart(ctx!, p.size);
      } else if (p.shape === "star") {
        drawStar(ctx!, p.size / 2);
      } else if (p.shape === "circle") {
        ctx!.beginPath();
        ctx!.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx!.fill();
      } else {
        ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      }

      ctx!.restore();
    }

    if (activeCount > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrameId);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  }

  render();
}
