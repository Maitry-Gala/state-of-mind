import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Card } from "../components/ui/Card";
import api from "../libs/axios";

interface Content {
  _id: string;
  title: string;
  link: string;
  type: "image" | "video" | "article" | "audio";
}

export function SharedBrain() {
  const { shareLink } = useParams();
  const [contents, setContents] = useState<Content[]>([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get(`/user/brain/${shareLink}`)
      .then((res) => {
        setContents(res.data.content);
        setUsername(res.data.username);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [shareLink]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
        <p className="text-sm text-gray-400">Loading brain...</p>
      </div>
    </div>
  );

  if (notFound) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-3 text-center px-4">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-400 text-xl">
          🔒
        </div>
        <h2 className="text-sm font-semibold text-gray-700">Brain not found</h2>
        <p className="text-xs text-gray-400 max-w-xs">
          This brain is private or the link is invalid.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-900">
                {username}'s Second Brain
              </h1>
              <p className="text-xs text-gray-400">{contents.length} items saved</p>
            </div>
          </div>
          <span className="text-xs text-gray-300 hidden sm:block">Read only</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {contents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <p className="text-sm">Nothing saved here yet.</p>
          </div>
        ) : (
          <div className="flex gap-4 flex-wrap items-start">
            {contents.map((card) => (
              <Card
                key={card._id}
                id={card._id}
                title={card.title}
                url={card.link}
                type={card.type}
                readonly
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}