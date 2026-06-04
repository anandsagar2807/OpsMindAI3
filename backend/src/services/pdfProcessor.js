import pdf from 'pdf-parse';
import fs from 'fs/promises';

export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);

    const pages = [];
    const avgCharsPerPage = Math.floor(data.text.length / data.numpages) || 2000;

    // Split text into pages using a heuristic approach
    // pdf-parse doesn't give per-page text directly, so we approximate
    const fullText = data.text;
    const estimatedCharsPerPage = Math.ceil(fullText.length / data.numpages);

    for (let i = 0; i < data.numpages; i++) {
      const start = i * estimatedCharsPerPage;
      const end = Math.min(start + estimatedCharsPerPage, fullText.length);
      const pageText = fullText.slice(start, end).trim();

      if (pageText.length > 0) {
        pages.push({
          pageNumber: i + 1,
          text: pageText,
          charCount: pageText.length
        });
      }
    }

    // If page splitting didn't work well, just use the full text as one page
    if (pages.length === 0 && fullText.length > 0) {
      pages.push({
        pageNumber: 1,
        text: fullText,
        charCount: fullText.length
      });
    }

    return {
      text: fullText,
      numPages: data.numpages,
      info: data.info,
      pages,
      textPreview: fullText.substring(0, 500)
    };
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF: ' + error.message);
  }
};

export const chunkText = (text, pages, chunkSize = 1000, overlap = 100) => {
  const chunks = [];
  let startIndex = 0;
  let chunkIndex = 0;

  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + chunkSize, text.length);
    const chunkText = text.slice(startIndex, endIndex).trim();

    if (chunkText.length > 0) {
      // Estimate page number based on character position
      const estimatedPage = estimatePageNumber(startIndex, pages, text.length);

      // Try to extract a section title from the first line
      const firstLine = chunkText.split('\n')[0].trim();
      const sectionTitle = firstLine.length < 80 && firstLine.length > 3
        ? firstLine
        : null;

      chunks.push({
        text: chunkText,
        chunkIndex,
        pageNumber: estimatedPage,
        sectionTitle,
        startPosition: startIndex,
        endPosition: endIndex,
        chunkSize: chunkText.length
      });
    }

    startIndex += chunkSize - overlap;
    chunkIndex++;
  }

  return chunks;
};

export const estimatePageNumber = (position, pages, totalLength) => {
  if (!pages || pages.length === 0) {
    return Math.floor(position / 2000) + 1;
  }

  const charsPerPage = totalLength / pages.length;
  return Math.min(
    Math.floor(position / charsPerPage) + 1,
    pages.length
  );
};
