import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./draft.css";

// Utility function to group drafts by time distance
function groupByTimeDistance(items) {
  const now = new Date();
  const groups = {};

  items.forEach((item) => {
    const created = new Date(Date.now());

    const diffMs = now - created;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    let label = "";
    if (diffDays === 0) label = "Today";
    else if (diffDays === 1) label = "Yesterday";
    else if (diffDays < 7) label = `${diffDays} days ago`;
    else if (diffDays < 14) label = "1 week ago";
    else if (diffDays < 21) label = "2 weeks ago";
    else if (diffDays < 30) label = "4 weeks ago";
    else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      label = `${months} month${months > 1 ? "s" : ""} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      label = `${years} year${years > 1 ? "s" : ""} ago`;
    }

    if (!groups[label]) groups[label] = [];
    groups[label].push(item);
  });

  return groups;
}

export default function Draft() {
  const [groupedDrafts, setGroupedDrafts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5001/drafts")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        const grouped = groupByTimeDistance(sorted);
        setGroupedDrafts(grouped);
      })
      .catch((err) => console.error("Failed to fetch drafts:", err));
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5001/drafts/${id}`, { method: "DELETE" });
      setGroupedDrafts((prevGroups) => {
        const updatedGroups = {};
        for (let key in prevGroups) {
          const filtered = prevGroups[key].filter((d) => d.id !== id);
          if (filtered.length > 0) {
            updatedGroups[key] = filtered;
          }
        }
        return updatedGroups;
      });      
    } catch (err) {
      console.error("Failed to delete draft:", err);
    }
  };

  const handleEdit = (draft) => {
    navigate("/Invoice", {
      state: { draftData: draft.data, draftId: draft.id },
    });
  };

  return (
    <div className="draft-container">
      <div className="draft-history">
        {Object.keys(groupedDrafts).length === 0 ? (
          <p className="no-draft">No drafts found!</p>
        ) : (
          Object.entries(groupedDrafts).map(([dateLabel, drafts]) => (
            <div key={dateLabel}>
              <p className="draft-date-label">
                -------- {dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1).toLowerCase()} --------
              </p>
              {drafts.map((draft) => (
                <div className="draft-box" key={draft.id}>
                  <div className="draft-info">
                    <p>
                      <strong>Invoice:</strong>{" "}
                      {draft.data.invoiceNumber || "Untitled"}
                    </p>
                    <p>
                      <strong>Project:</strong>{" "}
                      {draft.data.projectName || "Unnamed"}
                    </p>
                    <p>
                      <strong>Created:</strong>{" "}
                      {new Date(draft.createdAt)
                        .toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                        .replace("am", "AM")
                        .replace("pm", "PM")}
                    </p>
                    {draft.updatedAt && (
                      <p className="modified-time">
                        <strong>Modified:</strong>{" "}
                        {new Date(draft.updatedAt)
                          .toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                          .replace("am", "AM")
                          .replace("pm", "PM")}
                      </p>
                    )}
                  </div>
                  <div className="draft-actions">
                    <button
                      onClick={() => handleEdit(draft)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(draft.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
