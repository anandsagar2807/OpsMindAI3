import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { analyzeSkills } from '../services/skillsAnalysisService.js';

// Configure multer for operational knowledge analysis uploads (5MB limit, PDF/DOCX/TXT)
const skillsUploadStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/skills/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const skillsFileFilter = (req, file, cb) => {
    const allowedMimes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
    ];
    const allowedExtensions = ['.pdf', '.docx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedMimes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error(`Unsupported file type: ${ext}. Only PDF, DOCX, and TXT files are allowed.`), false);
    }
};

const skillsUpload = multer({
    storage: skillsUploadStorage,
    fileFilter: skillsFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    }
});

// Ensure upload directory exists
const ensureUploadDir = async () => {
    const dir = 'uploads/skills/';
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir, { recursive: true });
    }
};

/**
 * POST /api/skills/analyze
 * Accepts SOP document and compliance standards (as files or text) + optional query
 * Returns structured operational knowledge analysis
 */
export const analyzeSkillsHandler = async (req, res) => {
    await ensureUploadDir();

    // Use multer to handle potential file uploads
    skillsUpload.fields([
        { name: 'sopDocument', maxCount: 1 },
        { name: 'standardsDocument', maxCount: 1 },
    ])(req, res, async (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    success: false,
                    message: 'File too large. Maximum file size is 5MB.',
                });
            }
            return res.status(400).json({
                success: false,
                message: err.message || 'File upload error',
            });
        }

        try {
            const sopFile = req.files?.sopDocument?.[0] || null;
            const standardsFile = req.files?.standardsDocument?.[0] || null;
            const sopText = req.body?.sopText || '';
            const standardsText = req.body?.standardsText || '';
            const query = req.body?.query || '';

            // Validate that at least SOP content is provided
            if (!sopFile && !sopText.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide an SOP document — either upload a file or paste the content.',
                });
            }

            // Validate that at least compliance standards content is provided
            if (!standardsFile && !standardsText.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide compliance standards — either upload a file or paste the content.',
                });
            }

            const results = await analyzeSkills({
                sopFile,
                standardsFile,
                sopText,
                standardsText,
                query,
            });

            // Clean up uploaded files after processing
            const cleanupFiles = async () => {
                const filesToClean = [sopFile, standardsFile].filter(Boolean);
                for (const f of filesToClean) {
                    try {
                        await fs.unlink(f.path);
                    } catch (e) {
                        // Ignore cleanup errors
                    }
                }
            };
            cleanupFiles().catch(() => { });

            return res.status(200).json({
                success: true,
                data: results,
            });
        } catch (error) {
            console.error('Operational knowledge analysis error:', error);

            // Clean up uploaded files on error too
            const cleanupFiles = async () => {
                const filesToClean = [req.files?.sopDocument?.[0], req.files?.standardsDocument?.[0]].filter(Boolean);
                for (const f of filesToClean) {
                    try {
                        await fs.unlink(f.path);
                    } catch (e) { }
                }
            };
            cleanupFiles().catch(() => { });

            return res.status(500).json({
                success: false,
                message: error.message || 'Operational knowledge analysis failed. Please try again.',
            });
        }
    });
};