import React, { useState, useRef, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Logo from "../assets/logo.png";
import { v4 as uuidv4 } from "uuid";
import Countries from "./countries";
import "./invoice.css";
import Send from "./send.jsx";
import getCurrencyCode from "./countrytocurrency.jsx";
import getSymbolFromCurrency from "currency-symbol-map";
import domtoimage from "dom-to-image-more";

function Invoice() {
  const [SendShow, setSendShow] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [removeActive, setRemoveActive] = useState(false);
  const location = useLocation();
  const draftData = location.state?.draftData || null;
  const draftId = location.state?.draftId || null;
  const [history, setHistory] = useState([]);
  const [Currency, setCurrency] = useState();
  const [formData, setFormData] = useState(
    () =>
      draftData || {
        senderCompanyAddress: "",
        invoiceNumber: "",
        companyCode: "",
        projectName: "",
        issueDate: "",
        dueDate: "",
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        pinCode: "",
        contact: "",
        paymentMode: "",
        country: "",
        notes: "",
        items: [
          {
            id: uuidv4(),
            description: "",
            Qty: "",
            Unit_price: "",
            Total_price: "",
          },
        ],
        subTotal: "",
        tax: "",
        tax_percentage: 0,
        discount: "",
        discount_percentage: 0,
        total: "",
      }
  );
  const InvoiceRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (draftData) {
      setFormData(draftData);
    }
  }, [draftData]);

  const handleItemField = (event, id, field) => {
    const val = event.target.value;
    const updatedItems = [...formData.items];

    const itemIndex = updatedItems.findIndex((item) => item.id === id);
    if (itemIndex === -1) return;

    if (field === "Qty" && val > 100) return;

    updatedItems[itemIndex][field] = val;

    if (field === "Qty" || field === "Unit_price") {
      const Qty = Number(updatedItems[itemIndex].Qty) || 0;
      const Unit_price = Number(updatedItems[itemIndex].Unit_price) || 0;
      updatedItems[itemIndex].Total_price = (Unit_price * Qty).toFixed(2);
    }

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const handleaddnewItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: Date.now(),
          description: "",
          Qty: "",
          Unit_price: "",
          Total_price: "",
        },
      ],
    }));
  };

  const subTotal = useMemo(() => {
    return formData.items
      .reduce((acc, item) => acc + Number(item.Total_price || 0), 0)
      .toFixed(2);
  }, [formData.items]);

  const discount = useMemo(() => {
    return ((subTotal * formData.discount_percentage) / 100).toFixed(2);
  }, [subTotal, formData.discount_percentage]);

  const tax = useMemo(() => {
    return (((subTotal - discount) * formData.tax_percentage) / 100).toFixed(2);
  }, [subTotal, discount, formData.tax_percentage]);

  const total = useMemo(() => {
    return (parseFloat(subTotal - discount) + parseFloat(tax)).toFixed(2);
  }, [subTotal, tax, discount]);

  const handleSendButton = () => {
    if (!SendShow) {
      // Trying to open modal: validate first
      const updatedData = {
        ...formData,
        subTotal,
        discount,
        tax,
        total,
      };

      if (
        !updatedData.invoiceNumber ||
        !updatedData.companyCode ||
        !updatedData.projectName ||
        !updatedData.issueDate
      ) {
        alert(
          "Required fields such as Invoice Number, Company Code, Project Name and Issue Date are missing for Send!"
        );
        return;
      }

      setFormData(updatedData); 
      setSendShow(true); 
    } else {
      setSendShow(false);
    }
  };  

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest("#items-container")) {
        setSelectedIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setRemoveActive(selectedIndex !== null);
  }, [selectedIndex]);

  const handleRemoveItem = (id) => {
    if (!id) return;
    const updatedItems = formData.items.filter((item) => item.id !== id);
    setFormData({ ...formData, items: updatedItems });
    setSelectedIndex(null);
  };

  useEffect(() => {
    const textarea = document.getElementById("Sub-box1_p");
    const notes = document.getElementById("Sub-box2_Notes-input");
    const Address = document.getElementById("box2-Sub-box1_Address");
    textarea.addEventListener("input", function () {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    });
    notes.addEventListener("input", function () {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    });
    Address.addEventListener("input", function () {
      this.style.height = "auto";
      this.style.height = this.scrollHeight + "px";
    });
  });

  const handleSaveToDraft = async () => {
    try {
      const payload = {
        id: draftId || null,
        data: formData,
      };

      const response = await fetch("http://localhost:5001/drafts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Draft saved successfully!");
      } else {
        alert("Failed to save draft.");
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Error saving draft.");
    }
  };

  useEffect(() => {
    fetch("http://localhost:5002/history.json")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setHistory(data))
      .catch((err) => console.error("Failed to fetch history:", err));
  }, []);

  const handleApply = async (formData, refTarget) => {
    const updatedFormData = {
      ...formData,
      subTotal,
      tax,
      discount,
      total,
    };

    // await new Promise((resolve) => setTimeout(resolve, 0));

    if (
      !updatedFormData.invoiceNumber ||
      !updatedFormData.companyCode ||
      !updatedFormData.projectName ||
      !updatedFormData.issueDate ||
      !updatedFormData.dueDate ||
      !updatedFormData.firstName ||
      !updatedFormData.lastName ||
      !updatedFormData.email ||
      !updatedFormData.address ||
      !updatedFormData.pinCode ||
      !updatedFormData.contact ||
      !updatedFormData.paymentMode ||
      !updatedFormData.country ||
      !updatedFormData.notes ||
      !updatedFormData.subTotal ||
      !updatedFormData.tax ||
      !updatedFormData.discount ||
      !updatedFormData.total ||
      updatedFormData.items.length === 0
    ) {
      alert("Please fill in all required fields before applying.");
      return;
    } else {
      if (!refTarget?.current) {
        alert("Invoice preview not ready.");
        return;
      }

      const node = refTarget.current;
      const scaleFactor = 4;
      let payload = {};
      const originalStates = [];

      try {
        const fields = node.querySelectorAll("input, textarea");
        fields.forEach((el) => {
          originalStates.push({
            el,
            value: el.value,
            placeholder: el.placeholder,
          });
          if (!el.value) el.placeholder = "";
        });

        const dataUrl = await domtoimage.toPng(node, {
          quality: 1,
          bgcolor: "whitesmoke",
          style: {
            transform: `scale(${scaleFactor})`,
            transformOrigin: "top left",
            width: `${node.scrollWidth}px`,
            height: `${node.scrollHeight}px`,
          },
          width: node.scrollWidth * scaleFactor,
          height: node.scrollHeight * scaleFactor,
        });

        const imageName = `invoice-${
          updatedFormData.invoiceNumber
        }-${Date.now()}.png`;

        payload = {
          invoiceNumber: updatedFormData.invoiceNumber || "null",
          projectName: updatedFormData.projectName || "Unnamed",
          issueDate: updatedFormData.issueDate || new Date().toISOString(),
          imageName,
          imageData: dataUrl,
        };

        const res = await fetch("http://localhost:5002/upload-invoice-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await res.json();

        if (!res.ok) {
          console.error("Fetch error response:", result);
          throw new Error(result.error || "Unknown error occurred");
        }

        setFormData(updatedFormData);
        alert("Saved to history!");

        if (draftId) {
          await fetch(`http://localhost:5001/drafts/${draftId}`, {
            method: "DELETE",
          });
        }
      } catch (err) {
        console.error("Error sending to history:", err?.message || err);
        alert("Error saving invoice to history.");
      } finally {
        originalStates.forEach(({ el, value, placeholder }) => {
          el.placeholder = placeholder;
          el.value = value;
        });
      }
    }
  };

  useEffect(() => {
    const code = getCurrencyCode(formData.country);
    const symbol = getSymbolFromCurrency(code);
    setCurrency(symbol);
  }, [formData.country]);

  return (
    <>
      <div className="container" ref={InvoiceRef}>
        <div className="box1">
          <div className="Sub-box1">
            <div>
              <img src={Logo} alt="logo" className="img" />
            </div>
            <div id="Sub-box1_title">Invoice</div>
            <p>
              <textarea
                type="text"
                placeholder="Your Company Address..."
                id="Sub-box1_p"
                rows={2}
                name="senderCompanyAddress"
                value={formData.senderCompanyAddress}
                onChange={handleChange}
                title="Click to write"
              />
            </p>
          </div>
          <div className="Sub-box2">
            <p id="Sub-box2_title">Invoice Details</p>
            <div id="Sub-box2_container1">
              <div>
                <p>
                  <strong>Invoice Number</strong>
                </p>
                <input
                  type="number"
                  name="invoiceNumber"
                  placeholder="1009300"
                  value={formData.invoiceNumber}
                  onChange={handleChange}
                />
              </div>
              <div>
                <p>
                  <strong>Company Code</strong>
                </p>
                <input
                  type="number"
                  name="companyCode"
                  placeholder="0001"
                  value={formData.companyCode}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="Sub-box2_Container2">
              <p>
                <strong>Project Descriptions</strong>
              </p>
              <input
                id="Sub-box2_Container2_ProjectName"
                type="text"
                placeholder="Project Name"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
              />
            </div>
            <div id="Sub-box2_container2">
              <div>
                <p>
                  <strong>Issue Date & Time</strong>
                </p>
                <input
                  type="datetime-local"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <p>
                  <strong>Due Date & Time</strong>
                </p>
                <input
                  type="datetime-local"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div style={{ borderBottom: "1px solid grey", width: "1000px" }}>
              <p>
                <strong>Items</strong>
              </p>
            </div>
            <div>
              <div id="Sub-box2_Item-title">
                <span id="Item_description_title">Item Description</span>
                <span id="Qty_title">Qty</span>
                <span id="unit_price_title">Unit Price</span>
                <span id="total_price_title">Total Price</span>
              </div>
              <div id="items-container">
                {formData.items.map((item) => (
                  <div
                    key={item.id}
                    id="Sub-box2_Item-details"
                    onClick={() => setSelectedIndex(item.id)}
                    style={{
                      backgroundColor:
                        selectedIndex === item.id ? "#d3d3d3" : "transparent",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Item"
                      id="item_description"
                      value={item.description}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        handleItemField(e, item.id, "description");
                      }}
                    />
                    <input
                      type="number"
                      max={100}
                      id="Qty"
                      value={item.Qty}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        handleItemField(e, item.id, "Qty");
                      }}
                      title="Maximum limit is 100."
                    />
                    <input
                      type="number"
                      id="unit_price"
                      value={item.Unit_price}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        handleItemField(e, item.id, "Unit_price");
                      }}
                    />
                    <input
                      type="number"
                      id="total_price"
                      value={item.Total_price}
                      readOnly
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                ))}
                <div id="Sub-box2_estimate-panel">
                  <div>
                    <span
                      onClick={handleaddnewItem}
                      id="Sub-box2_estimate-panel_button"
                    >
                      ⊕ Add Item
                    </span>
                    <span
                      id="Sub-box2_estimate-panel_button"
                      onClick={() => {
                        if (removeActive) handleRemoveItem(selectedIndex);
                      }}
                      style={{
                        color: removeActive ? "#002FFF" : "#d3d3d3",
                        cursor: removeActive ? "pointer" : "default",
                      }}
                      title={removeActive ? "" : "Select item"}
                    >
                      ⊖ Remove Item
                    </span>
                  </div>
                  <div>
                    <span id="Sub-box2_estimate-panel_subtotal">
                      Subtotal:{" "}
                    </span>
                    <span id="Sub-box2_estimate-panel_rupees">
                      {Currency} {subTotal}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p id="Sub-box2_Notes">Notes</p>
              <textarea
                type="text"
                placeholder="Write a note & Service descriptions."
                id="Sub-box2_Notes-input"
                rows={3}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className="box2">
          <div className="box2-Sub-box1">
            <div>
              <p id="box2-Sub-box1_heading">First Name</p>
              <input
                type="text"
                placeholder="First Name"
                id="box2-Sub-box1_FirstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div>
              <p id="box2-Sub-box1_heading">Last Name</p>
              <input
                type="text"
                placeholder="Last Name"
                id="box2-Sub-box1_LastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <p id="box2-Sub-box1_heading">Mail Address</p>
            <input
              type="email"
              placeholder="example@gmail.com"
              id="box2-Sub-box1_mail"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <p id="box2-Sub-box1_heading">Address</p>
            <textarea
              type="text"
              placeholder="Street and Landmark"
              id="box2-Sub-box1_Address"
              name="address"
              rows={2}
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="box2-Sub-box5">
            <div>
              <p id="box2-Sub-box1_heading">State/Country</p>
              <Countries
                onCountryChange={(country) =>
                  setFormData((prev) => ({ ...prev, country }))
                }
              />
            </div>
            <div>
              <p id="box2-Sub-box1_heading">Pin/Postal Code</p>
              <input
                type="number"
                placeholder="012345"
                id="box2-Sub-box5_PinCode"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="box2-Sub-box6">
            <div>
              <p id="box2-Sub-box6_heading">Contact</p>
              <input
                type="number"
                placeholder="+01 1240-34892-23892"
                id="box2-Sub-box1_PhNo"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
              />
            </div>
            <div>
              <p id="box2-Sub-box6_heading">Payment Mode</p>
              <select
                id="box2-Sub-dropdown"
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
              >
                <option style={{ backgroundColor: "grey" }}>
                  Select Option
                </option>
                <option value="Online Transaction">Online Transaction</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>
          <div className="box2-Sub-box7">
            <div id="box2-Sub-box7_section1">
              <p>
                <strong>Subtotal:</strong>
              </p>
              <p>
                <strong>
                  {Currency} {subTotal}
                </strong>
              </p>
            </div>
            <div id="box2-Sub-box7_section3">
              <p>
                <strong>
                  Discount (
                  <input
                    type="number"
                    max={100}
                    value={formData.discount_percentage}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value <= 100) {
                        setFormData({
                          ...formData,
                          discount_percentage: value,
                        });
                      }
                    }}
                    id="box2-Sub-box7_section2_TaxAndDiscount"
                  />
                  %):
                </strong>
              </p>
              <p>
                <strong>
                  {Currency} {discount}
                </strong>
              </p>
            </div>
            <div id="box2-Sub-box7_section2">
              <p>
                <strong>
                  Tax (
                  <input
                    type="number"
                    max={1000}
                    value={formData.tax_percentage}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value <= 1000) {
                        setFormData({
                          ...formData,
                          tax_percentage: value,
                        });
                      }
                    }}
                    id="box2-Sub-box7_section2_TaxAndDiscount"
                  />
                  %):
                </strong>
              </p>
              <p>
                <strong>
                  {Currency} {tax}
                </strong>
              </p>
            </div>
          </div>
          <div className="box2-Sub-box8">
            <div id="box2-Sub-box8_section1">
              <p>
                <strong>Total Amount:</strong>
              </p>
              <p>
                <strong>
                  {Currency} {total}
                </strong>
              </p>
            </div>
          </div>
          <div className="box2-Sub-box9">
            <button onClick={handleSaveToDraft} id="box2-Sub-box9_button">
              Save to draft
            </button>
            <button onClick={handleSendButton} id="box2-Sub-box9_button">
              Send Invoice
            </button>
            <button
              onClick={() => {
                handleApply(formData, InvoiceRef);
              }}
              id="box2-Sub-box9_button_Apply"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
      {SendShow && (
        <div className="modal-overlay">
          <div className="modal-content">
            <Send refTarget={InvoiceRef} data={formData} />
            <button className="close-modal-button" onClick={handleSendButton}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Invoice;
