(() => {
  const root = document.querySelector('.film-strip');
  if (!root) return;
  const track = root.querySelector('.film-track');
  const videos = [...root.querySelectorAll('video')];
  if (!track || !videos.length) return;
  root.querySelector('.film-controls')?.remove();
  let index = 0, visible = true;
  videos.forEach(video => {
    video.muted = true;
    video.defaultMuted = true;
    video.controls = false;
    video.playsInline = true;
  });
  function resume() {
    if (visible && !document.hidden) {
      videos[index].muted = true;
      videos[index].play().catch(() => {});
    }
  }
  function show(next) {
    videos[index].pause();
    index = (next + videos.length) % videos.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    videos.forEach((video, i) => {
      video.parentElement.setAttribute('aria-hidden', String(i !== index));
    });
    videos[index].currentTime = 0;
    resume();
  }
  videos.forEach((video, i) => video.addEventListener('ended', () => {
    if (i === index) show(index + 1);
  }));
  let startX = 0, startY = 0;
  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1));
    else resume();
  }, { passive: true });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) videos[index].pause();
    else resume();
  }, { threshold: 0.1 }).observe(root);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) videos[index].pause();
    else resume();
  });
  show(0);
})();
