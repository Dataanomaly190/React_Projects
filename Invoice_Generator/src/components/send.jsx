import React, { useState, useEffect } from "react";
import "./send.css";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image-more";
import getCurrencyCode from "./countrytocurrency.jsx";
import getSymbolFromCurrency from "currency-symbol-map";
import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
} from "docx";
import DownloadIcon from "../assets/Download_Icon.png";
import WhatsappIcon from "../assets/Social_Media_Icons/whatsapp_Icon.png";
import FacebookIcon from "../assets/Social_Media_Icons/facebook_Icon.png";
import GmailIcon from "../assets/Social_Media_Icons/gmail_Icon.png";
import SMSIcon from "../assets/Social_Media_Icons/SMS_Icon.png";
import DiscordIcon from "../assets/Social_Media_Icons/discord_Icon.png";
import LinkedinIcon from "../assets/Social_Media_Icons/linkedin_Icon.png";
import MailIcon from "../assets/Social_Media_Icons/mail_Icon.png";
import MessengerIcon from "../assets/Social_Media_Icons/messenger_Icon.png";
import SnapchatIcon from "../assets/Social_Media_Icons/Snapchat_Icon.png";
import PinterestIcon from "../assets/Social_Media_Icons/pinterest_Icon.png";
import InstagramIcon from "../assets/Social_Media_Icons/instagram_Icon.png";
import RedditIcon from "../assets/Social_Media_Icons/reddit_Icon.png";
import TelegramIcon from "../assets/Social_Media_Icons/telegram_Icon.png";
import TumblrIcon from "../assets/Social_Media_Icons/tumblr_Icon.png";
import XIcon from "../assets/Social_Media_Icons/X_Icon.png";

export default function Send({ data, refTarget }) {
  const fileName = `invoice-${data.invoiceNumber || "null"}`;
  const [PDFClicked, setPDFClicked] = useState(false);
  const [DOCXClicked, setDOCXClicked] = useState(false);
  const [PNGClicked, setPNGClicked] = useState(false);
  const [format, setFormat] = useState("");
  const [Currency, setCurrency] = useState();
  // const [invoiceURL, setInvoiceURL] = useState("");

  useEffect(() => {
    const code = getCurrencyCode(data.country);
    const symbol = getSymbolFromCurrency(code);
    setCurrency(symbol);
  }, [data.country]);

  // For PDF Share and Download
  const exportPDF = async () => {
    const node = refTarget.current;
    if (!node) return;

    const scaleFactor = 4;
    const originalStates = [];

    try {
      // 🔹 Clear empty placeholders
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

      const img = new Image();
      img.src = dataUrl;

      img.onload = () => {
        const imgWidth = 297;
        const imgHeight = (img.height * imgWidth) / img.width;
        const pageHeight = 210;
        let position = 0;
        let heightLeft = imgHeight;

        const pdf = new jsPDF("landscape", "mm", "a4");
        pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`invoice-${data.invoiceNumber || "null"}.pdf`);
      };
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Failed to export PDF.");
    } finally {
      // 🔹 Restore original input/textarea values
      originalStates.forEach(({ el, value, placeholder }) => {
        el.placeholder = placeholder;
        el.value = value;
      });
    }
  };

  // For DOCX Share and Download
  const exportDOCX = () => {
    if (!data || !data.items || !Array.isArray(data.items)) {
      console.error("Invalid data or missing items data.");
      return;
    }
    console.log(data);

    // Header row for items
    const tableRows = [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 10, type: WidthType.PERCENTAGE },
            children: [new Paragraph("Item")],
          }),
          new TableCell({ children: [new Paragraph("Qty")] }),
          new TableCell({ children: [new Paragraph("Unit Price")] }),
          new TableCell({ children: [new Paragraph("Total Price")] }),
        ],
      }),
    ];

    // Add item rows
    data.items.forEach((item) => {
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph(item.description || "-")],
            }),
            new TableCell({
              children: [new Paragraph(String(item.Qty || 0))],
            }),
            new TableCell({
              children: [new Paragraph(`${Currency}${item.Unit_price || 0}`)],
            }),
            new TableCell({
              children: [new Paragraph(`${Currency}${item.Total_price || 0}`)],
            }),
          ],
        })
      );
    });

    const itemsTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: tableRows,
    });

    // Document content
    const docContent = [
      new Paragraph({
        text: "INVOICE",
        heading: "Heading1",
        alignment: AlignmentType.CENTER,
        bold: true,
        size: 28,
      }),

      new Paragraph({
        text: `${data.senderCompanyAddress || "__________"}`,
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        font: { size: 16 },
      }),

      new Paragraph({
        text: `Invoice Number: ${data.invoiceNumber || "__________"}`,
        alignment: AlignmentType.LEFT,
        font: { size: 14 },
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: `Company Code: ${data.companyCode || "__________"}`,
        alignment: AlignmentType.LEFT,
        font: { size: 14 },
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: `Project Name: ${data.projectName || "__________"}`,
        alignment: AlignmentType.LEFT,
        font: { size: 14 },
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: `Issue Date: ${data.issueDate || "__________"}`,
        alignment: AlignmentType.LEFT,
        font: { size: 14 },
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: `Due Date: ${data.dueDate || "__________"}`,
        alignment: AlignmentType.LEFT,
        font: { size: 14 },
        spacing: { after: 240 },
      }),

      new Paragraph({
        text: "Items:",
        heading: "Heading3",
        bold: true,
        font: { size: 18 },
        alignment: AlignmentType.LEFT,
        spacing: { after: 120 },
      }),

      itemsTable,

      new Paragraph({
        text: `Subtotal: ${Currency}${data.subTotal}`,
        alignment: AlignmentType.RIGHT,
        font: { size: 14 },
        spacing: { after: 80 },
      }),
      new Paragraph({
        text: `Discount (${data.discount_percentage}%): ${Currency}${data.discount}`,
        alignment: AlignmentType.RIGHT,
        font: { size: 14 },
        spacing: { after: 80 },
      }),
      new Paragraph({
        text: `Tax (${data.tax_percentage}%): ${Currency}${data.tax}`,
        alignment: AlignmentType.RIGHT,
        font: { size: 14 },
        spacing: { after: 80 },
      }),
      new Paragraph({
        text: `Total Amount: ${Currency}${data.total}`,
        alignment: AlignmentType.RIGHT,
        font: { size: 14 },
        bold: true,
        spacing: { after: 240 },
      }),

      new Paragraph({
        text: "Client Details:",
        heading: "Heading3",
        bold: true,
        font: { size: 18 },
        alignment: AlignmentType.LEFT,
        spacing: { after: 120 },
      }),

      new Paragraph({
        text: `First Name: ${data.firstName || "__________"}`,
        alignment: AlignmentType.LEFT,
        font: { size: 14 },
        spacing: { after: 60 },
      }),
      new Paragraph({
        text: `Last Name: ${data.lastName || "__________"}`,
        alignment: AlignmentType.LEFT,
        font: { size: 14 },
        spacing: { after: 60 },
      }),
      new Paragraph({
        text: `Email: ${data.email || "__________"}`,
        alignment: AlignmentType.LEFT,
        font: { size: 14 },
        spacing: { after: 60 },
      }),
      new Paragraph({
        text: `Address: ${data.address || "__________"}`,
        alignment: AlignmentType.LEFT,
        font: { size: 14 },
        spacing: { after: 60 },
      }),
      new Paragraph({
        text: `State/Country: ${data.country || "__________"}`,
        alignment: AlignmentType.LEFT,
        font: { size: 14 },
        spacing: { after: 60 },
      }),
      new Paragraph({
        text: `Pin Code: ${data.pinCode || "__________"}`,
        alignment: AlignmentType.LEFT,
        font: { size: 14 },
        spacing: { after: 60 },
      }),
      new Paragraph({
        text: `Contact: ${data.contact || "__________"}`,
        alignment: AlignmentType.LEFT,
        font: { size: 14 },
        spacing: { after: 60 },
      }),
      new Paragraph({
        text: `Payment Mode: ${data.paymentMode || "__________"}`,
        alignment: AlignmentType.LEFT,
        font: { size: 14 },
        spacing: { after: 60 },
      }),

      new Paragraph({
        text: `Notes: ${data.notes || "__________"}`,
        alignment: AlignmentType.LEFT,
        font: { size: 14 },
        spacing: { after: 120 },
      }),
    ];

    const doc = new Document({
      creator: "Invoice App",
      title: "Invoice Document",
      description: "Exported Invoice",
      sections: [
        {
          properties: {},
          children: docContent,
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, getDownloadFileName());
    });
  };

  // For PNG Share and Download
  const exportPNG = async () => {
    const node = refTarget.current;
    if (!node) return;

    const scaleFactor = 4;
    const originalStates = [];

    try {
      // 🔹 Clear empty placeholders
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

      const blob = await (await fetch(dataUrl)).blob();
      saveAs(blob, `invoice-${data.invoiceNumber || "null"}.png`);
    } catch (err) {
      console.error("Error exporting PNG:", err);
      alert("Failed to export PNG.");
    } finally {
      // 🔹 Restore original input/textarea values
      originalStates.forEach(({ el, value, placeholder }) => {
        el.placeholder = placeholder;
        el.value = value;
      });
    }
  };  

  const handleState = (val) => {
    setFormat(val);
    if (val === "pdf") {
      setPDFClicked(true);
      setDOCXClicked(false);
      setPNGClicked(false);
    } else if (val === "docx") {
      setPDFClicked(false);
      setDOCXClicked(true);
      setPNGClicked(false);
    } else if (val === "png") {
      setPDFClicked(false);
      setDOCXClicked(false);
      setPNGClicked(true);
    }
  };

  const generateBlobByFormat = async () => {
    const input = refTarget.current;
    if (!input || !format) return null;

    if (format === "pdf") {
      const canvas = await html2canvas(input);
      const pdf = new jsPDF("landscape", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        297,
        (canvas.height * 297) / canvas.width
      );
      return pdf.output("blob");
    }

    if (format === "png") {
      const canvas = await html2canvas(input);
      return new Promise((resolve) => canvas.toBlob(resolve));
    }

    if (format === "docx") {
      const doc = new Document({
        sections: [{ children: [new Paragraph("...")] }],
      });
      return await Packer.toBlob(doc);
    }

    return null;
  };

  const handleSocialShare = async (platform) => {
    const blob = await generateBlobByFormat();
    if (!blob) return alert("Please select a format first.");

    const fileURL = await uploadFile(blob, getDownloadFileName());
    console.log("Invoice URL: ", fileURL);
    if (!fileURL) return alert("File upload failed.");

    const encodedURL = encodeURIComponent(fileURL);
    let shareLink = "";

    switch (platform) {
      case "whatsapp":
        shareLink = `https://wa.me/?text=${encodeURIComponent(
          "Here is your invoice: " + fileURL
        )}`;
        break;
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`;
        break;
      case "gmail":
        shareLink = `mailto:?subject=Invoice from YourCompany&body=Please find your invoice at ${fileURL}`;
        break;
      case "sms":
        shareLink = `sms:?body=${encodeURIComponent(
          "Here’s your invoice: " + fileURL
        )}`;
        break;
      case "discord":
        shareLink = `https://discord.com/channels/@me`; // Manual paste required
        break;
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedURL}`;
        break;
      case "mail":
        shareLink = `mailto:?subject=Invoice from YourCompany&body=Please find your invoice at ${fileURL}`;
        break;
      case "messenger":
        shareLink = `https://www.messenger.com/t`; // Manual paste required
        break;
      case "snapchat":
        shareLink = `https://www.snapchat.com/`; // Manual paste required
        break;
      case "pinterest":
        shareLink = `https://pinterest.com/pin/create/button/?url=${encodedURL}&description=${encodeURIComponent(
          "Check out this invoice!"
        )}`;
        break;
      case "instagram":
        shareLink = `https://www.instagram.com/sharer/sharer.php?u=${encodedURL}`;
        break;
      case "reddit":
        shareLink = `https://www.reddit.com/submit?url=${encodedURL}&title=${encodeURIComponent(
          "Invoice from YourCompany"
        )}`;
        break;
      case "telegram":
        shareLink = `https://t.me/share/url?url=${encodedURL}&text=${encodeURIComponent(
          "Here’s your invoice"
        )}`;
        break;
      case "tumblr":
        shareLink = `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encodedURL}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          "Here is your invoice"
        )}&url=${encodedURL}`;
        break;
      default:
        alert("Unsupported platform.");
        return;
    }

    window.open(shareLink, "_blank");
  };

  const getDownloadFileName = () => {
    return `invoice-${data.invoiceNumber || "null"}.${format || "file"}`;
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append(
      "file",
      new File([file], getDownloadFileName(), { type: file.type })
    );
    formData.append("invoiceNumber", "null");

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      return data.fileUrl; // Assuming this is where the URL comes from
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };


  return (
    <>
      <div className="Send_container">
        <div className="box-One">
          <div className="box-One_subbox1">
            <div>
              <img
                src={DownloadIcon}
                alt="Download_Icon"
                onClick={() => {
                  if (format === "docx") exportDOCX();
                  else if (format === "pdf") exportPDF();
                  else if (format === "png") exportPNG();
                  else alert("Please select a format first.");
                }}
              />
              <p id="para1">Download</p>
            </div>
            <p id="para2">
              Easily download invoices in PDFs, DOCX and PNG format or share
              them via as PDFs, DOCX and PNG through various social platforms,
              ensuring quick and professional communication with clients.
            </p>
          </div>
        </div>
        <div className="Buttons">
          <span
            className="pdf"
            onClick={() => handleState("pdf")}
            style={{
              backgroundColor: PDFClicked
                ? "rgb(228, 58, 92)"
                : "rgb(53, 51, 51)",
            }}
          >
            PDF
          </span>
          <span
            className="docx"
            onClick={() => handleState("docx")}
            style={{
              backgroundColor: DOCXClicked
                ? "rgb(228, 58, 92)"
                : "rgb(53, 51, 51)",
            }}
          >
            DOCX
          </span>
          <span
            className="png"
            onClick={() => handleState("png")}
            style={{
              backgroundColor: PNGClicked
                ? "rgb(228, 58, 92)"
                : "rgb(53, 51, 51)",
            }}
          >
            PNG
          </span>
        </div>
        <div className="img_section">
          <div className="img_section_part">
            <img
              src={WhatsappIcon}
              alt="WhatsappIcon"
              onClick={() => handleSocialShare("whatsapp")}
            />
            <img
              src={FacebookIcon}
              alt="FacebookIcon"
              onClick={() => handleSocialShare("facebook")}
            />
            <img
              src={GmailIcon}
              alt="GmailIcon"
              onClick={() => handleSocialShare("gmail")}
            />
            <img
              src={SMSIcon}
              alt="SMSIcon"
              onClick={() => handleSocialShare("sms")}
            />
            <img
              src={DiscordIcon}
              alt="DiscordIcon"
              onClick={() => handleSocialShare("discord")}
            />
          </div>
          <div className="img_section_part">
            <img
              src={LinkedinIcon}
              alt="LinkedinIcon"
              onClick={() => handleSocialShare("linkedin")}
            />
            <img
              src={MailIcon}
              alt="MailIcon"
              onClick={() => handleSocialShare("mail")}
            />
            <img
              src={MessengerIcon}
              alt="MessengerIcon"
              onClick={() => handleSocialShare("messenger")}
            />
            <img
              src={SnapchatIcon}
              alt="SnapchatIcon"
              onClick={() => handleSocialShare("snapchat")}
            />
            <img
              src={PinterestIcon}
              alt="PinterestIcon"
              onClick={() => handleSocialShare("pinterest")}
            />
          </div>
          <div className="img_section_part">
            <img
              src={InstagramIcon}
              alt="InstagramIcon"
              onClick={() => handleSocialShare("instagram")}
            />
            <img
              src={RedditIcon}
              alt="RedditIcon"
              onClick={() => handleSocialShare("reddit")}
            />
            <img
              src={TelegramIcon}
              alt="TelegramIcon"
              onClick={() => handleSocialShare("telegram")}
            />
            <img
              src={TumblrIcon}
              alt="TumblrIcon"
              onClick={() => handleSocialShare("tumblr")}
            />
            <img
              src={XIcon}
              alt="XIcon"
              onClick={() => handleSocialShare("twitter")}
            />
          </div>
        </div>
      </div>
    </>
  );
}
