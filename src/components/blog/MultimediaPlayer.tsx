import { useState, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Headphones,
  RotateCcw,
  Video,
} from 'lucide-react';
import { useCms } from '@/lib/cms-store';

interface VideoPlayerProps {
  url: string;
  title?: string;
  caption?: string;
  postSlug?: string;
}

export function VideoPlayer({ url, title, caption, postSlug }: VideoPlayerProps) {
  const { recordMediaPlay } = useCms();
  const [hasRecorded, setHasRecorded] = useState(false);

  const handlePlayEvent = () => {
    if (!hasRecorded && postSlug) {
      recordMediaPlay(postSlug, 'video', title || 'Video Walkthrough');
      setHasRecorded(true);
    }
  };

  // Check if it's a YouTube link
  const getEmbedUrl = (rawUrl: string) => {
    if (!rawUrl) return '';
    if (rawUrl.includes('youtube.com/watch?v=')) {
      const id = rawUrl.split('watch?v=')[1]?.split('&')[0];
      return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
    }
    if (rawUrl.includes('youtu.be/')) {
      const id = rawUrl.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
    }
    if (rawUrl.includes('vimeo.com/')) {
      const id = rawUrl.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${id}`;
    }
    return rawUrl;
  };

  const embedSrc = getEmbedUrl(url);
  const isDirectVideo = embedSrc.endsWith('.mp4') || embedSrc.endsWith('.webm') || embedSrc.endsWith('.ogg');

  return (
    <figure className="my-8 rounded-3xl overflow-hidden bg-[var(--surface-elevated)] border border-[var(--border)] shadow-xl">
      {title && (
        <div className="px-5 py-3 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-gold)] font-bold">
            <Video size={15} />
            <span>{title}</span>
          </div>
          <span className="text-[10px] font-mono text-[var(--muted)] uppercase">Executive Walkthrough</span>
        </div>
      )}

      <div className="relative aspect-video w-full bg-black/90 flex items-center justify-center overflow-hidden">
        {isDirectVideo ? (
          <video
            controls
            src={embedSrc}
            onPlay={handlePlayEvent}
            className="w-full h-full object-contain"
          />
        ) : (
          <iframe
            src={embedSrc}
            title={title || 'Executive Video Analysis'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handlePlayEvent}
            className="w-full h-full border-0"
          />
        )}
      </div>

      {caption && (
        <figcaption className="px-5 py-3 text-xs text-[var(--muted)] italic bg-[var(--surface)] border-t border-[var(--border)] text-center font-mono">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

interface AudioPlayerProps {
  url: string;
  title: string;
  duration?: string;
  author?: string;
  postSlug?: string;
}

export function AudioPlayer({ url, title, duration, author, postSlug }: AudioPlayerProps) {
  const { recordMediaPlay } = useCms();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      if (!hasRecorded && postSlug) {
        recordMediaPlay(postSlug, 'audio', title);
        setHasRecorded(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setTotalDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const restartAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="my-6 p-5 sm:p-6 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-md">
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-gold)]/15 border border-[var(--accent-gold)]/30 text-[var(--accent-gold)] flex items-center justify-center shrink-0">
            <Headphones size={20} />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent-gold)] font-bold">
              AUDIO BRIEFING & COMMENTARY
            </div>
            <h4 className="text-sm font-bold text-[var(--foreground)] line-clamp-1">
              {title}
            </h4>
            {author && (
              <span className="text-[11px] text-[var(--muted)]">Narrated by {author}</span>
            )}
          </div>
        </div>

        {duration && (
          <span className="text-xs font-mono text-[var(--muted)] bg-[var(--surface)] px-2.5 py-1 rounded-lg border border-[var(--border)]">
            {duration}
          </span>
        )}
      </div>

      {/* Scrubber & Controls */}
      <div className="space-y-3">
        <input
          type="range"
          min={0}
          max={totalDuration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-[var(--surface)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-gold)]"
        />

        <div className="flex items-center justify-between text-xs font-mono text-[var(--muted)]">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(totalDuration || 0)}</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={restartAudio}
              className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              title="Restart"
            >
              <RotateCcw size={15} />
            </button>
            <button
              onClick={togglePlay}
              className="px-4 py-2 rounded-xl bg-[var(--accent-gold)] text-black font-bold text-xs flex items-center gap-2 hover:brightness-110 transition-all shadow cursor-pointer"
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} />}
              <span>{isPlaying ? 'Pause Briefing' : 'Listen Now'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.muted = !isMuted;
                  setIsMuted(!isMuted);
                }
              }}
              className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
