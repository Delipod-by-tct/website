/* Live : vignette légère, lecteur YouTube chargé seulement au clic (titre et liens masqués avant lecture) */
document.addEventListener('click', function (e) {
  var b = e.target.closest && e.target.closest('.yt[data-yt]');
  if (!b || b.querySelector('iframe')) return;
  var f = document.createElement('iframe');
  f.src = 'https://www.youtube-nocookie.com/embed/' + b.getAttribute('data-yt') + '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
  f.title = b.getAttribute('aria-label') || 'Vidéo';
  f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  f.allowFullscreen = true;
  b.innerHTML = ''; b.style.backgroundImage = 'none'; b.appendChild(f);
});
