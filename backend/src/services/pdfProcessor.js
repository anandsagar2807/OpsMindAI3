import pdf from 'pdf-parse';
import fs from 'fs/promises';

export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);

    return {
      text: data.text,
      numPages: data.numpages,
      info: data.info
    };
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

export const chunkText = (text, chunkSize = 1000, overlap = 100) => {
  const chunks = [];
  let startIndex = 0;
  let chunkIndex = 0;

  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + chunkSize, text.length);
    const chunk = text.slice(startIndex, endIndex);

    chunks.push({
      text: chunk.trim(),
      chunkIndex: chunkIndex,
      startPosition: startIndex,
      endPosition: endIndex,
      chunkSize: chunk.length
    });

    startIndex += chunkSize - overlap;
    chunkIndex++;
  }

  return chunks;
};

export const estimatePageNumber = (text, chunkStartPosition, totalText) => {
  const avgCharsPerPage = 2000;
  return Math.floor(chunkStartPosition / avgCharsPerPage) + 1;
};
