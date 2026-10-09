// Recognises a YouTube or Vimeo URL and returns a privacy-friendly embed descriptor, or null
// if the URL isn't a known video-host link (callers then treat it as a direct file path, same
// as before this existed). Lets Projects/Achievements admin fields accept either a local
// upload or a plain pasted YouTube/Vimeo link.
export function embedUrl(url, { startTime, loop = false, muted = true, autoPlay = true } = {}) {
  if (!url) return null;

  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) {
    const id = yt[1];
    const params = new URLSearchParams({
      rel: '0',
      modestbranding: '1',
      playsinline: '1'
    });
    if (autoPlay) params.set('autoplay', '1');
    if (muted) params.set('mute', '1');
    if (startTime) params.set('start', String(Math.floor(startTime)));
    if (loop) {
      params.set('loop', '1');
      params.set('playlist', id);
    }
    return { type: 'iframe', provider: 'youtube', src: `https://www.youtube-nocookie.com/embed/${id}?${params}` };
  }

  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) {
    const params = new URLSearchParams({ title: '0', byline: '0', portrait: '0' });
    if (autoPlay) params.set('autoplay', '1');
    if (muted) params.set('muted', '1');
    if (loop) params.set('loop', '1');
    return { type: 'iframe', provider: 'vimeo', src: `https://player.vimeo.com/video/${vm[1]}?${params}` };
  }

  return null;
}
