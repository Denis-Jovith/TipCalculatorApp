import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

// Plays a highlight clip of a video (startTime → endTime, in seconds) without trimming the
// underlying file — the rest of the video is still there, just not part of the default
// playback range. Always seeks back to `startTime` on load and whenever the clip ends, so
// replaying (or looping) never drifts to 0:00 of the original file or wherever it was left.
export default function VideoShowreel({
  src,
  poster,
  startTime = 0,
  endTime = null,
  defaultMuted = true,
  autoPlay = true,
  loopClip = true,
  showControls = false
}) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(defaultMuted);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return undefined;

    const seekToStart = () => {
      v.currentTime = startTime || 0;
    };

    const onLoadedMetadata = () => seekToStart();

    const onEnded = () => {
      seekToStart();
      if (loopClip) v.play().catch(() => {});
    };

    const onTimeUpdate = () => {
      if (!endTime) return;
      if (v.currentTime >= endTime) {
        if (loopClip) {
          seekToStart();
        } else {
          v.pause();
          seekToStart();
        }
      }
    };

    v.addEventListener('loadedmetadata', onLoadedMetadata);
    v.addEventListener('ended', onEnded);
    v.addEventListener('timeupdate', onTimeUpdate);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) v.pause();

    return () => {
      v.removeEventListener('loadedmetadata', onLoadedMetadata);
      v.removeEventListener('ended', onEnded);
      v.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [src, startTime, endTime, loopClip]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  const toggleMute = () => setMuted((m) => !m);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-glow">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={defaultMuted}
        playsInline
        controls={showControls}
        preload="metadata"
        aria-label="Video"
        className="w-full max-h-[480px] object-cover bg-black"
      >
        <track kind="captions" />
      </video>
      {!showControls && (
        <button
          onClick={toggleMute}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label={muted ? 'Unmute video' : 'Mute video'}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}
    </div>
  );
}
