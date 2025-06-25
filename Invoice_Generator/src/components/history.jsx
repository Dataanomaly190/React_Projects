import React, { useState, useEffect } from "react";
import "./history.css";
import ResetHistory from "./reset_history.jsx";

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

export default function History() {
  const [groupedInvoices, setGroupedInvoices] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  // Refactored out so it can be reused if needed elsewhere
  const saveToHistoryViaScreenshot = async () => {
    const pageUrl = window.location.href;
    const payload = {
      invoiceNumber: data.invoiceNumber,
      projectName: data.projectName,
      issueDate: data.issueDate,
      pageUrl,
    };

    try {
      const res = await fetch("http://localhost:5002/capture-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) alert("Invoice saved to history successfully.");
      else alert("Failed to save invoice.");
    } catch (err) {
      console.error("Save history error:", err);
      alert("Error saving history");
    }
  };

  const handleView = (invoice) => {
    if (invoice.image) {
      const imageUrl = `http://localhost:5002/uploads/${
        invoice.image
      }?t=${Date.now()}`;
      setSelectedImage(imageUrl);
    } else {
      alert("No image available for this invoice.");
    }
  };

  const handleCloseModal = () => setSelectedImage(null);

  const handleResetHistory = async () => {
    if (!window.confirm("Are you sure you want to delete all invoice history?"))
      return;

    try {
      const res = await fetch("http://localhost:5002/reset-history", {
        method: "DELETE",
      });

      if (Object.keys(groupedInvoices).length === 0) {
        alert("No history found!");
      } else {
        if (res.ok) {
          alert("History has been cleared.");
          setGroupedInvoices({}); // Reset state
        } else {
          alert("Failed to clear history.");
        }
      }
    } catch (err) {
      console.error("Error clearing history:", err);
      alert("An error occurred while clearing history.");
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:5002/history.json");
        const data = await res.json();
        const sorted = data.sort(
          (a, b) => new Date(b.issueDate) - new Date(a.issueDate)
        );
        const grouped = groupByTimeDistance(sorted);
        setGroupedInvoices(grouped);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="history-container">
      <div className="history-and-container-layout">
        <div className="history-controls">
          <ResetHistory onReset={handleResetHistory} />
        </div>
        <div className="history-panel">
          {Object.keys(groupedInvoices).length === 0 ? (
            <p className="no-history">No finalized invoices found!</p>
          ) : (
            Object.entries(groupedInvoices).map(([label, group]) => (
              <div key={label}>
                <p className="history-date-label">
                  -------- {label.charAt(0).toUpperCase() + label.slice(1).toLowerCase()} --------
                </p>
                {group.map((inv, index) =>
                  inv && inv.invoiceNumber ? (
                    <div className="history-box" key={index}>
                      <div className="history-info">
                        <p>
                          <strong>Invoice:</strong> {inv.invoiceNumber}
                        </p>
                        <p>
                          <strong>Project:</strong>{" "}
                          {inv.projectName || "Unnamed"}
                        </p>
                        <p>
                          <strong>Date:</strong>{" "}
                          {new Date(inv.issueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="history-actions">
                        <button
                          className="view-button"
                          onClick={() => handleView(inv)}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            ))
          )}
        </div>
      </div>
      {selectedImage && (
        <div className="history-modal-overlay" onClick={handleCloseModal}>
          <div
            className="history-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Invoice Preview"
              className="history-modal-image"
            />
          </div>
          <div className="history-close-modal">
            <button onClick={handleCloseModal} className="close-modal-button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
