import { memo } from "react";
import { DeleteIcon } from "../icons/DeleteIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { Tweet } from "react-tweet";
import Youtube from "react-youtube";
import { Component, type ReactNode } from "react";

class CardErrorBoundary extends Component<
  { children: ReactNode },
  { crashed: boolean }
> {
  state = { crashed: false };
  componentDidCatch() {
    this.setState({ crashed: true });
  }
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

type ContentType = "image" | "video" | "article" | "audio";

const extractYoutubeId = (url: string) =>
  url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1];
const extractTweetId = (url: string) => url.match(/status\/(\d+)/)?.[1];

function ContentEmbed({ url, type }: { url: string; type: ContentType }) {
  if (type === "video") {
    const id = extractYoutubeId(url);
    return id ? (
      <Youtube
        videoId={id}
        className="w-full max-h-48 overflow-hidden rounded-md"
        iframeClassName="w-full max-h-48 overflow-hidden aspect-video rounded-md"
      />
    ) : (
      <p className="text-red-400 text-sm">Invalid YouTube URL</p>
    );
  }

  if (type === "article") {
    const id = extractTweetId(url);
    return id ? (
      <div className="[&_.react-tweet-theme]:!my-0">
        <Tweet id={id} />
      </div>
    ) : (
      <p className="text-red-400 text-sm">Invalid Tweet URL</p>
    );
  }
  if (type === "image") {
    return (
      <img
        src={url}
        alt="content"
        className="w-full max-h-48 object-cover rounded-md"
      />
    );
  }

  if (type === "audio") {
    return <audio controls src={url} className="w-full mt-2 rounded-md" />;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 hover:underline text-sm break-all"
    >
      {url}
    </a>
  );
}

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
            <button
              aria-label="Share"
              className="hover:text-gray-600 transition-colors"
            >
              <ShareIcon />
            </button>
            <button
              aria-label="Delete"
              className="hover:text-red-500 transition-colors"
            >
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
