export function createParticles(container: HTMLElement): void {
  container.className = 'particles';

  const colors = ['var(--purple)', 'var(--cyan)', 'var(--pink)', 'var(--purple-bright)'];

  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = `${Math.random() * 100}%`;
    p.style.animationDuration = `${10 + Math.random() * 15}s`;
    p.style.animationDelay = `${Math.random() * 12}s`;
    const size = 1 + Math.random() * 2;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    container.appendChild(p);
  }
}
