import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Plus } from "../components/icons/Plus";
import { ShareIcon } from "../components/icons/ShareIcon";
import { CreateContentModal } from "../components/model/CreateContentModel";
import { Sidebar } from "../components/asidebar/Slidebar";
import { ContentProvider, useContent } from "../context/ContentContext";
import api from "../libs/axios";
import { CardSkeleton } from "../components/ui/CardSkeleton";

function DashboardInner() {
  const [modalOpen, setModalOpen] = useState(false);
  const { cards, filter, loading, search, setSearch } = useContent();

  const filtered =
    filter === "all" ? cards : cards.filter((c) => c.type === filter);

  async function handleShareBrain() {
    try {
      const res = await api.post("/user/brain/share", { share: true });
      const hash = res.data.hash;
      if (!hash) {
        toast.error("Could not generate share link");
        return;
      }
      const link = `${window.location.origin}/brain/${hash}`;
      await navigator.clipboard.writeText(link);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to share brain");
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 ml-64 p-6">
        <CreateContentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />

        {/* Topbar */}
        <div className="flex justify-end gap-3 mb-6">
          <div className="flex flex-1 max-w-sm">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search in your brain.."
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all"
            />
          </div>

          <Button
            variant="primary"
            text="Share Brain"
            startIcon={<ShareIcon />}
            onClick={handleShareBrain}
            disabled={false}
          />
          <Button
            variant="secondary"
            text="Add Content"
            startIcon={<Plus />}
            onClick={() => setModalOpen(true)}
            disabled={false}
          />
        </div>

        {/* Cards */}
        {loading ? (
          <div className="flex gap-4 flex-wrap items-start">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <p className="text-sm">No content yet. Add something!</p>
          </div>
        ) : (
          <div className="flex gap-4 flex-wrap items-start">
            {filtered.map((card) => (
              <Card
                key={card._id}
                id={card._id}
                title={card.title}
                url={card.link}
                type={card.type}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function Dashboard() {
  return (
    <ContentProvider>
      <DashboardInner />
    </ContentProvider>
  );
}
