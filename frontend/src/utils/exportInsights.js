import jsPDF from 'jspdf';

/**
 * Export insights data in various formats (PDF, TXT, JSON).
 *
 * @param {object} insights  - Normalised insights object (from normalizeInsights)
 * @param {object} meta      - Document metadata (originalName, totalPages, totalChunks, etc.)
 * @param {'pdf'|'txt'|'json'} format - Export format
 */
export function exportInsights(insights, meta, format = 'pdf') {
    const docName = meta?.originalName || meta?.name || 'document';
    const timestamp = new Date().toISOString().slice(0, 10);

    if (format === 'json') {
        return exportJSON(insights, meta, docName, timestamp);
    }
    if (format === 'txt') {
        return exportTXT(insights, meta, docName, timestamp);
    }
    return exportPDF(insights, meta, docName, timestamp);
}

// ─── PDF Export ────────────────────────────────────────────────────────
function exportPDF(insights, meta, docName, timestamp) {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 18;
    const contentWidth = pageWidth - 2 * margin;
    let y = margin;

    // Helper: add a new page if we're near the bottom
    const checkPage = (needed = 20) => {
        if (y + needed > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }
    };

    // Helper: wrap text to fit within contentWidth
    const wrapText = (text, maxWidth) => {
        return doc.splitTextToSize(text, maxWidth);
    };

    // ─── Header ───
    doc.setFillColor(30, 27, 75); // deep violet
    doc.rect(0, 0, pageWidth, 42, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('OpsMind AI — Document Insights', margin, 18);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 200, 230);
    doc.text(docName, margin, 28);

    doc.setFontSize(9);
    doc.setTextColor(160, 160, 200);
    doc.text(`Generated: ${timestamp}  |  Engine: ${insights.generatedBy || 'N/A'}`, margin, 35);

    y = 50;

    // ─── Statistics ───
    const stats = insights.statistics;
    if (stats || meta?.totalPages || meta?.totalChunks) {
        doc.setTextColor(100, 80, 180);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('Document Statistics', margin, y);
        y += 6;

        doc.setDrawColor(100, 80, 180);
        doc.setLineWidth(0.3);
        doc.line(margin, y, margin + contentWidth, y);
        y += 5;

        doc.setTextColor(60, 60, 60);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        const statRows = [
            ['Pages', meta?.totalPages ?? '—'],
            ['Chunks', meta?.totalChunks ?? '—'],
            ['Words', stats?.wordCount != null ? stats.wordCount.toLocaleString() : '—'],
            ['Sentences', stats?.sentenceCount ?? '—'],
            ['Paragraphs', stats?.paragraphCount ?? '—'],
            ['Reading Time', stats?.readingTimeMinutes != null ? `${stats.readingTimeMinutes} min` : '—'],
            ['Unique Words', stats?.uniqueWords ?? '—'],
            ['Lexical Density', stats?.lexicalDensity != null ? `${(stats.lexicalDensity * 100).toFixed(1)}%` : '—'],
        ];

        for (const [label, value] of statRows) {
            checkPage(6);
            doc.setFont('helvetica', 'bold');
            doc.text(`${label}:`, margin, y);
            doc.setFont('helvetica', 'normal');
            doc.text(String(value), margin + 40, y);
            y += 5;
        }
        y += 4;
    }

    // ─── Summary ───
    if (insights.summary) {
        checkPage(20);
        doc.setTextColor(100, 80, 180);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('Summary', margin, y);
        y += 6;

        doc.setDrawColor(100, 80, 180);
        doc.line(margin, y, margin + contentWidth, y);
        y += 5;

        doc.setTextColor(50, 50, 50);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const summaryLines = wrapText(insights.summary, contentWidth);
        for (const line of summaryLines) {
            checkPage(5);
            doc.text(line, margin, y);
            y += 4.5;
        }
        y += 4;
    }

    // ─── Key Topics ───
    if (insights.keyTopics && insights.keyTopics.length > 0) {
        checkPage(20);
        doc.setTextColor(50, 100, 200);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('Key Topics', margin, y);
        y += 6;

        doc.setDrawColor(50, 100, 200);
        doc.line(margin, y, margin + contentWidth, y);
        y += 5;

        doc.setTextColor(50, 50, 50);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const topicsText = insights.keyTopics.join('  •  ');
        const topicLines = wrapText(topicsText, contentWidth);
        for (const line of topicLines) {
            checkPage(5);
            doc.text(line, margin, y);
            y += 4.5;
        }
        y += 4;
    }

    // ─── Key Points ───
    if (insights.keyPoints && insights.keyPoints.length > 0) {
        checkPage(20);
        doc.setTextColor(30, 150, 100);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('Key Points', margin, y);
        y += 6;

        doc.setDrawColor(30, 150, 100);
        doc.line(margin, y, margin + contentWidth, y);
        y += 5;

        doc.setTextColor(50, 50, 50);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        for (const point of insights.keyPoints) {
            checkPage(10);
            const bulletLines = wrapText(`• ${point}`, contentWidth - 4);
            for (const line of bulletLines) {
                checkPage(5);
                doc.text(line, margin + 2, y);
                y += 4.5;
            }
            y += 1;
        }
        y += 3;
    }

    // ─── Action Items ───
    if (insights.actionItems && insights.actionItems.length > 0) {
        checkPage(20);
        doc.setTextColor(200, 150, 30);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('Action Items', margin, y);
        y += 6;

        doc.setDrawColor(200, 150, 30);
        doc.line(margin, y, margin + contentWidth, y);
        y += 5;

        doc.setTextColor(50, 50, 50);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        for (const item of insights.actionItems) {
            checkPage(10);
            const bulletLines = wrapText(`• ${item}`, contentWidth - 4);
            for (const line of bulletLines) {
                checkPage(5);
                doc.text(line, margin + 2, y);
                y += 4.5;
            }
            y += 1;
        }
        y += 3;
    }

    // ─── Important Terms ───
    if (insights.importantTerms && insights.importantTerms.length > 0) {
        checkPage(20);
        doc.setTextColor(200, 50, 80);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('Important Terms', margin, y);
        y += 6;

        doc.setDrawColor(200, 50, 80);
        doc.line(margin, y, margin + contentWidth, y);
        y += 5;

        doc.setTextColor(50, 50, 50);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        for (const term of insights.importantTerms) {
            checkPage(6);
            const label = typeof term === 'object' ? `${term.term} (×${term.count})` : `${term}`;
            doc.text(`• ${label}`, margin + 2, y);
            y += 5;
        }
        y += 3;
    }

    // ─── Sections ───
    if (insights.sections && insights.sections.length > 0) {
        checkPage(20);
        doc.setTextColor(80, 80, 160);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('Document Sections', margin, y);
        y += 6;

        doc.setDrawColor(80, 80, 160);
        doc.line(margin, y, margin + contentWidth, y);
        y += 5;

        for (const section of insights.sections) {
            checkPage(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(60, 60, 120);
            doc.setFontSize(11);
            doc.text(section.heading || 'Untitled Section', margin, y);
            y += 5;

            if (section.preview) {
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(80, 80, 80);
                doc.setFontSize(9);
                const previewLines = wrapText(section.preview, contentWidth - 4);
                for (const line of previewLines) {
                    checkPage(5);
                    doc.text(line, margin + 2, y);
                    y += 4;
                }
            }
            y += 3;
        }
    }

    // ─── Footer ───
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.setFont('helvetica', 'normal');
        doc.text(
            `OpsMind AI  |  Page ${i} of ${totalPages}  |  ${docName}  |  ${timestamp}`,
            margin,
            pageHeight - 8
        );
    }

    // Save
    const filename = `${docName.replace(/[^a-zA-Z0-9._-]/g, '_')}_insights_${timestamp}.pdf`;
    doc.save(filename);
}

// ─── TXT Export ────────────────────────────────────────────────────────
function exportTXT(insights, meta, docName, timestamp) {
    const lines = [];

    lines.push('═══════════════════════════════════════════════════════════════');
    lines.push(`  OpsMind AI — Document Insights`);
    lines.push('═══════════════════════════════════════════════════════════════');
    lines.push(`  Document:  ${docName}`);
    lines.push(`  Generated: ${timestamp}`);
    lines.push(`  Engine:    ${insights.generatedBy || 'N/A'}`);
    lines.push('');

    // Statistics
    const stats = insights.statistics;
    if (stats || meta?.totalPages || meta?.totalChunks) {
        lines.push('── Document Statistics ──────────────────────────────────────');
        lines.push(`  Pages:          ${meta?.totalPages ?? '—'}`);
        lines.push(`  Chunks:         ${meta?.totalChunks ?? '—'}`);
        lines.push(`  Words:          ${stats?.wordCount != null ? stats.wordCount.toLocaleString() : '—'}`);
        lines.push(`  Sentences:      ${stats?.sentenceCount ?? '—'}`);
        lines.push(`  Paragraphs:     ${stats?.paragraphCount ?? '—'}`);
        lines.push(`  Reading Time:   ${stats?.readingTimeMinutes != null ? `${stats.readingTimeMinutes} min` : '—'}`);
        lines.push(`  Unique Words:   ${stats?.uniqueWords ?? '—'}`);
        lines.push(`  Lexical Density:${stats?.lexicalDensity != null ? `${(stats.lexicalDensity * 100).toFixed(1)}%` : '—'}`);
        lines.push('');
    }

    // Summary
    if (insights.summary) {
        lines.push('── Summary ─────────────────────────────────────────────────');
        lines.push(insights.summary);
        lines.push('');
    }

    // Key Topics
    if (insights.keyTopics?.length) {
        lines.push('── Key Topics ──────────────────────────────────────────────');
        insights.keyTopics.forEach(t => lines.push(`  • ${t}`));
        lines.push('');
    }

    // Key Points
    if (insights.keyPoints?.length) {
        lines.push('── Key Points ──────────────────────────────────────────────');
        insights.keyPoints.forEach(p => lines.push(`  • ${p}`));
        lines.push('');
    }

    // Action Items
    if (insights.actionItems?.length) {
        lines.push('── Action Items ────────────────────────────────────────────');
        insights.actionItems.forEach(a => lines.push(`  • ${a}`));
        lines.push('');
    }

    // Important Terms
    if (insights.importantTerms?.length) {
        lines.push('── Important Terms ─────────────────────────────────────────');
        insights.importantTerms.forEach(t => {
            const label = typeof t === 'object' ? `${t.term} (×${t.count})` : t;
            lines.push(`  • ${label}`);
        });
        lines.push('');
    }

    // Sections
    if (insights.sections?.length) {
        lines.push('── Document Sections ───────────────────────────────────────');
        insights.sections.forEach(s => {
            lines.push(`  ${s.heading || 'Untitled Section'}`);
            if (s.preview) lines.push(`    ${s.preview}`);
        });
        lines.push('');
    }

    lines.push('═══════════════════════════════════════════════════════════════');
    lines.push('  Generated by OpsMind AI — https://opsmind.ai');
    lines.push('═══════════════════════════════════════════════════════════════');

    const content = lines.join('\n');
    const filename = `${docName.replace(/[^a-zA-Z0-9._-]/g, '_')}_insights_${timestamp}.txt`;
    downloadBlob(content, filename, 'text/plain');
}

// ─── JSON Export ────────────────────────────────────────────────────────
function exportJSON(insights, meta, docName, timestamp) {
    const payload = {
        metadata: {
            documentName: docName,
            generatedAt: timestamp,
            generatedBy: insights.generatedBy || 'N/A',
            totalPages: meta?.totalPages ?? null,
            totalChunks: meta?.totalChunks ?? null,
        },
        insights: {
            summary: insights.summary,
            keyTopics: insights.keyTopics,
            keyPoints: insights.keyPoints,
            actionItems: insights.actionItems,
            importantTerms: insights.importantTerms,
            sections: insights.sections,
            statistics: insights.statistics,
        },
    };

    const content = JSON.stringify(payload, null, 2);
    const filename = `${docName.replace(/[^a-zA-Z0-9._-]/g, '_')}_insights_${timestamp}.json`;
    downloadBlob(content, filename, 'application/json');
}

// ─── Helper: trigger browser download ──────────────────────────────────
function downloadBlob(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}