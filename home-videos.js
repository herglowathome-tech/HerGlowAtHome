(() => {
  const root = document.querySelector('.film-strip');
  const track = root.querySelector('.film-track');
  const videos = [...root.querySelectorAll('video')];
  const play = document.querySelector('#film-play');
  const sound = document.querySelector('#film-sound');
  let index = 0, paused = matchMedia('(prefers-reduced-motion: reduce)').matches, muted = true, visible = true;
  function resume() {
    play.textContent = paused ? 'Play' : 'Pause';
    if (!paused && visible && !document.hidden) videos[index].play().catch(() => { paused = true; play.textContent = 'Play'; });
  }
  function show(next) {
    videos[index].pause();
    index = (next + videos.length) % videos.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    videos.forEach((video, i) => { video.parentElement.setAttribute('aria-hidden', String(i !== index)); });
    videos[index].muted = muted;
    videos[index].currentTime = 0;
    document.querySelector('#film-count').textContent = `${index + 1} / ${videos.length}`;
    resume();
  }
  videos.forEach((v, i) => v.addEventListener('ended', () => { if (i === index && !paused) show(index + 1); }));
  document.querySelector('#film-prev').onclick = () => show(index - 1);
  document.querySelector('#film-next').onclick = () => show(index + 1);
  play.onclick = () => { paused = !paused; if (paused) videos[index].pause(); resume(); };
  sound.onclick = () => { muted = !muted; videos.forEach(v => { v.muted = muted; }); sound.textContent = muted ? 'Sound on' : 'Sound off'; };
  let startX = 0, startY = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; startY = e.touches[0].clientY; }, { passive: true });
  track.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - startX, dy = e.changedTouches[0].clientY - startY; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1)); }, { passive: true });
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible) videos[index].pause(); else resume(); }, { threshold: 0.1 }).observe(root);
  document.addEventListener('visibilitychange', () => { if (document.hidden) videos[index].pause(); else resume(); });
  if (paused) videos[0].pause();
  show(0);
})();
