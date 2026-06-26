import { memo, useState, useEffect, Component, type ReactNode } from "react";
import { DeleteIcon } from "../icons/DeleteIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { Tweet } from "react-tweet";
import Youtube from "react-youtube";
import { boolean } from "zod";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const extractYoutubeId = (url: string) =>
  url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1];

const extractTweetId = (url: string) =>
  url.match(/status\/(\d+)/)?.[1];

// ─── Link Preview ─────────────────────────────────────────────────────────────

interface OGData {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}

function LinkPreview({ url }: { url: string }) {
  const [og, setOg] = useState<OGData | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "success") {
          setOg({
            title: data.data?.title,
            description: data.data?.description,
            image: data.data?.image?.url,
            siteName: data.data?.publisher,
          });
        } else {
          setFailed(true);
        }
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, [url]);

  if (loading) return (
    <div className="w-full h-24 rounded-md bg-gray-100 animate-pulse" />
  );

  if (failed) return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 hover:underline text-sm break-all"
    >
      {url}
    </a>
  );

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-md border border-gray-100 overflow-hidden hover:border-gray-300 transition-colors"
    >
      {og?.image && (
        <img src={og.image} alt="" className="w-full h-32 object-cover" />
      )}
      <div className="p-2">
        <p className="text-xs font-medium text-gray-800 truncate">
          {og?.title ?? url}
        </p>
        {og?.description && (
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
            {og.description}
          </p>
        )}
        {og?.siteName && (
          <p className="text-xs text-purple-400 mt-1">{og.siteName}</p>
        )}
      </div>
    </a>
  );
}

// ─── Tweet Embed (with own error boundary) ────────────────────────────────────

class TweetEmbed extends Component<
  { id: string; fallback: ReactNode },
  { crashed: boolean }
> {
  state = { crashed: false };
  componentDidCatch() { this.setState({ crashed: true }); }
  render() {
    if (this.state.crashed) return this.props.fallback;
    return (
      <div className="[&_.react-tweet-theme]:!my-0">
        <Tweet id={this.props.id} />
      </div>
    );
  }
}

// ─── Error Boundary ───────────────────────────────────────────────────────────

class CardErrorBoundary extends Component<
  { children: ReactNode },
  { crashed: boolean }
> {
  state = { crashed: false };
  componentDidCatch() { this.setState({ crashed: true }); }
  render() {
    return this.state.crashed ? (
      <div className="p-4 w-72 bg-white rounded-md border border-red-200 text-red-400 text-sm">
        Failed to load content.
      </div>
    ) : (
      this.props.children
    );
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

type ContentType = "image" | "video" | "article" | "audio";

// ─── Content Embed ────────────────────────────────────────────────────────────

function ContentEmbed({ url, type }: { url: string; type: ContentType }) {
  if (type === "video") {
    const ytId = extractYoutubeId(url);
    return ytId
      ? <Youtube videoId={ytId} className="w-full max-h-48 overflow-hidden rounded-md" iframeClassName="w-full max-h-48 overflow-hidden aspect-video rounded-md" />
      : <LinkPreview url={url} />;
  }

  if (type === "article") {
    const tweetId = extractTweetId(url);
    return tweetId
      ? <TweetEmbed id={tweetId} fallback={<LinkPreview url={url} />} />
      : <LinkPreview url={url} />;
  }

  // image, audio → OG preview
  return <LinkPreview url={url} />;
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps {
  title: string;
  url: string;
  type: ContentType;
}

export const Card = memo(function Card({ title, url, type }: CardProps) {
  return (
    <CardErrorBoundary>
      <div className="p-4 w-72 bg-white rounded-md border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 truncate">
            <DocumentIcon />
            <span className="truncate">{title}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2 text-gray-400">
            <button aria-label="Share" className="hover:text-gray-600 transition-colors">
              <ShareIcon />
            </button>
            <button aria-label="Delete" className="hover:text-red-500 transition-colors">
              <DeleteIcon />
            </button>
          </div>
        </div>
        <div className="mt-4">
          <ContentEmbed url={url} type={type} />
        </div>
      </div>
    </CardErrorBoundary>
  );
});

