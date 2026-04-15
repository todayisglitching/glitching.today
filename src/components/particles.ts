export function createParticles(container: HTMLElement): void {
  container.innerHTML = ''; // Чистим контейнер
  const colors = ['var(--accent)', 'var(--purple-bright)', 'var(--text-dim)'];

  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    
    // БЕЗ ЭТОЙ СТРОКИ АНИМАЦИЯ НЕ ЗАПУСТИТСЯ:
    p.style.animationName = 'float-particle'; 
    
    p.style.left = `${Math.random() * 100}%`;
    p.style.animationDuration = `${10 + Math.random() * 15}s`;
    p.style.animationDelay = `${Math.random() * 10}s`;
    
    const size = 1 + Math.random() * 2;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    
    // Проверь, чтобы эти цвета были в :root CSS!
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    container.appendChild(p);
  }
}