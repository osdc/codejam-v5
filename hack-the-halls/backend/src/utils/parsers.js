import JSZip from "jszip";
import fs, { readFileSync } from "fs";
import xml2js from "xml2js";
import mammoth from "mammoth";
import { PDFExtract } from "pdf.js-extract";
const pdfExtract = new PDFExtract();

export async function pptxParser(filePath) {
  try {
    // Read the file
    const data = fs.readFileSync(filePath);
    const zip = new JSZip();
    const content = await zip.loadAsync(data);
    const slideFiles = Object.keys(content.files)
      .filter((name) => name.startsWith("ppt/slides/slide"))
      .sort((a, b) => {
        const slideNumberA = parseInt(
          a.replace("ppt/slides/slide", "").replace(".xml", "")
        );
        const slideNumberB = parseInt(
          b.replace("ppt/slides/slide", "").replace(".xml", "")
        );
        return slideNumberA - slideNumberB;
      });
    let Text = "";
    for (let i = 0; i < slideFiles.length; i++) {
      const slideXml = await content.file(slideFiles[i]).async("text");
      const result = await xml2js.parseStringPromise(slideXml);
      let slideText = "";
      const shapes = result["p:sld"]["p:cSld"][0]["p:spTree"][0]["p:sp"] || [];
      shapes.forEach((shape) => {
        if (shape["p:txBody"]) {
          const textElements = shape["p:txBody"][0]["a:p"] || [];
          textElements.forEach((textElement) => {
            const textRuns = textElement["a:r"] || [];
            textRuns.forEach((textRun) => {
              const text = textRun["a:t"]?.[0];
              if (text) {
                slideText += text.trim() + " ";
              }
            });
          });
        }
      });

      Text += slideText.trim() + "\n\n";
    }
    return Text;
  } catch (error) {
    console.error("Error extracting text:", error);
  }
}

export async function pdfParser(filePath) {
  try {
    // Extract text from PDF
    const data = await pdfExtract.extract(filePath, {});

    // Combine text from all pages
    const fullText = data.pages
      .map((page) =>
        // For each page, join all text elements with spaces
        page.content.map((item) => item.str).join(" ")
      )
      .join("\n\n"); // Add double newline between pages

    return fullText;
  } catch (error) {
    console.error("Error extracting text:", error);
    throw error;
  }
}

export async function docxParser(filePath) {
  try {
    // Read the .docx file as a buffer
    const fileBuffer = fs.readFileSync(filePath);

    // Extract text using mammoth
    const { value: text } = await mammoth.extractRawText({
      buffer: fileBuffer,
    });
    console.log("Extracted Text:", text);
  } catch (error) {
    console.error("Error extracting text:", error);
  }
}
