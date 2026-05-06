import html2canvas from "html2canvas";

export async function captureNode(node, options = {}) {
  const origInputs = node.querySelectorAll("input");
  const origTextareas = node.querySelectorAll("textarea");
  const origSelects = node.querySelectorAll("select");

  const inputValues = Array.from(origInputs).map((el) => ({
    value: el.value,
    styles: window.getComputedStyle(el),
  }));

  const textareaValues = Array.from(origTextareas).map((el) => el.value);
  const selectValues = Array.from(origSelects).map((el) => {
    const selected = el.options[el.selectedIndex];
    return selected ? selected.text : "";
  });

  return html2canvas(node, {
    useCORS: true,
    scale: 2,
    backgroundColor: "whitesmoke",
    scrollX: 0,
    scrollY: -window.scrollY,
    width: node.scrollWidth,
    height: node.scrollHeight,
    windowWidth: node.scrollWidth,
    windowHeight: node.scrollHeight,
    ...options,
    onclone: (clonedDoc, clonedEl) => {
      const clonedInputs = clonedEl.querySelectorAll("input");
      clonedInputs.forEach((input, i) => {
        const data = inputValues[i];
        if (!data) return;

        const span = clonedDoc.createElement("span");
        span.textContent = data.value || "";

        const s = data.styles;
        span.style.cssText = `
          display: inline-flex;
          align-items: center;
          width: ${s.width};
          min-height: ${s.height};
          padding: ${s.padding};
          margin: ${s.margin};
          font-size: ${s.fontSize};
          font-family: ${s.fontFamily};
          font-weight: ${s.fontWeight};
          color: ${s.color};
          background-color: ${s.backgroundColor};
          border: ${s.border};
          border-radius: ${s.borderRadius};
          box-sizing: ${s.boxSizing};
          line-height: ${s.lineHeight === "normal" ? "normal" : s.lineHeight};
          overflow: visible;
          white-space: nowrap;
        `;
        input.parentNode.replaceChild(span, input);
      });

      const clonedTextareas = clonedEl.querySelectorAll("textarea");
      clonedTextareas.forEach((ta, i) => {
        const value = textareaValues[i];
        if (value === undefined) return;

        const origTa = origTextareas[i];
        const div = clonedDoc.createElement("div");
        div.textContent = value;

        const s = window.getComputedStyle(origTa);
        div.style.cssText = `
          width: ${s.width};
          min-height: ${s.height};
          padding: ${s.padding};
          margin: ${s.margin};
          font-size: ${s.fontSize};
          font-family: ${s.fontFamily};
          font-weight: ${s.fontWeight};
          color: ${s.color};
          background-color: ${s.backgroundColor};
          border: ${s.border};
          border-radius: ${s.borderRadius};
          box-sizing: ${s.boxSizing};
          line-height: ${s.lineHeight};
          text-align: ${s.textAlign};
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow: visible;
        `;
        ta.parentNode.replaceChild(div, ta);
      });

      const clonedSelects = clonedEl.querySelectorAll("select");
      clonedSelects.forEach((sel, i) => {
        const origSel = origSelects[i];
        if (!origSel) return;

        const span = clonedDoc.createElement("span");
        span.textContent = selectValues[i] || "";

        const s = window.getComputedStyle(origSel);
        span.style.cssText = `
          display: inline-flex;
          align-items: center;
          width: ${s.width};
          min-height: ${s.height};
          padding: ${s.padding};
          margin: ${s.margin};
          font-size: ${s.fontSize};
          font-family: ${s.fontFamily};
          font-weight: ${s.fontWeight};
          color: ${s.color};
          background-color: ${s.backgroundColor};
          border: ${s.border};
          border-radius: ${s.borderRadius};
          box-sizing: ${s.boxSizing};
          line-height: ${s.lineHeight === "normal" ? "normal" : s.lineHeight};
          overflow: visible;
          white-space: nowrap;
        `;
        sel.parentNode.replaceChild(span, sel);
      });

      // Call user's onclone if provided
      if (options.onclone) {
        options.onclone(clonedDoc, clonedEl);
      }
    },
  });
}
