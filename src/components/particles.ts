export function createParticles(container: HTMLElement): void {
  container.innerHTML = ''; // Очищаем контейнер
  const colors = ['var(--accent)', 'var(--purple-bright)', 'var(--cyan)', 'var(--blue)'];

  for (let i = 0; i < 50; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    
    // ОБЯЗАТЕЛЬНО: без этой строки анимация не запустится
    p.style.animationName = 'float-particle'; 
    
    p.style.left = `${Math.random() * 100}%`;
    p.style.animationDuration = `${12 + Math.random() * 18}s`;
    p.style.animationDelay = `${Math.random() * 12}s`;
    
    const size = 0.8 + Math.random() * 2.5;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    
    // Используем случайные цвета из CSS переменных
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    // Добавляем прозрачность для более естественного вида
    p.style.opacity = String(0.3 + Math.random() * 0.7);
    
    container.appendChild(p);
  }
}