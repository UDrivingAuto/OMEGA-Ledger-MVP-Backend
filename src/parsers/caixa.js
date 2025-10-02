const fs = require('fs');
const os = require('os');
const path = require('path');
const sharp = require('sharp');
const { fromPath } = require("pdf2pic");
const { createWorker } = require('tesseract.js');

async function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ----------------- EXTRAÇÃO PDF → IMAGENS -----------------
async function extractImagesFromPdf(pdfPath, outDir) {

    await ensureDir(outDir);

    const convert = fromPath(pdfPath, {
        density: 300,         // qualidade da renderização
        saveFilename: "page",
        savePath: outDir,
        format: "png",
        width: 2000,
        height: 2000
    });

    // -1 = todas as páginas
    const pages = await convert.bulk(-1);
    console.log("Imagens extraídas:", imgFiles);
    const files = pages.map(p => p.path);

    if (files.length === 0) throw new Error('Nenhuma imagem extraída do PDF.');

    return files;

}

// ----------------- PRÉ-PROCESSAMENTO -----------------
async function preprocessImage(inputPath, outputPath) {

    if (!fs.existsSync(inputPath)) {
        throw new Error(`Arquivo de entrada não existe: ${inputPath}`);
    }

    try {

        await sharp(inputPath)
            .grayscale()
            .normalize()
            .sharpen()
            .toFile(outputPath);

    } catch (err) {
        console.error("Erro no preprocessImage:", err);
        throw err;
    }
    
}


// ----------------- OCR (Tesseract) -----------------
async function createTesseractWorker(lang = 'por') {

    const worker = createWorker();

    await worker.load();
    await worker.loadLanguage(lang);
    await worker.initialize(lang);

    return worker;

}

async function ocrImage(worker, imagePath) {

    const { data } = await worker.recognize(imagePath);
    const lines = data.text.split('\n').map(l => l.trim()).filter(Boolean);

    return lines;

}

// ----------------- PARSER DE TRANSAÇÕES -----------------
const dateRegex = /\b([0-3]?\d)[\/\-]([0-1]?\d)[\/\-](\d{2}|\d{4})\b/;
const amountRegex = /R\$?\s?([0-9]{1,3}(?:[.,][0-9]{3})*(?:[.,][0-9]{2}))/;

function normalizeCurrency(raw) {

    let s = raw.replace(/[^\d,.-]/g, '');

    const lastComma = s.lastIndexOf(',');
    const lastDot = s.lastIndexOf('.');

    if (lastComma > lastDot) {
        s = s.replace(/\./g, '').replace(',', '.');
    } else {
        s = s.replace(/,/g, '');
    }

    return parseFloat(s);

}

function extractTransactions(lines) {

    const txs = [];

    for (const line of lines) {

        const dateMatch = line.match(dateRegex);
        const amountMatch = line.match(amountRegex);

        if (dateMatch && amountMatch) {

            const date = dateMatch[0];
            const amountRaw = amountMatch[1];
            const amount = normalizeCurrency(amountRaw);

            const idxDate = line.indexOf(date);
            const idxAmount = line.lastIndexOf(amountMatch[0]);
            const description = line.slice(idxDate + date.length, idxAmount).trim();

            txs.push({ date, description, amount, rawLine: line });

        }

    }

    return txs;

}

// ----------------- FUNÇÃO PRINCIPAL -----------------
async function extrairCreditosCaixa(pdfPath) {

    console.log("Processando:", pdfPath);

    const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ocr-extrato-'));
    const imgsDir = path.join(tmpRoot, 'imgs');
    const preDir = path.join(tmpRoot, 'pre');

    await ensureDir(imgsDir);
    await ensureDir(preDir);

    const imgFiles = await extractImagesFromPdf(pdfPath, imgsDir);
    const worker = await createTesseractWorker('por');

    const allTransactions = [];

    for (let i = 0; i < imgFiles.length; i++) {

        const pre = path.join(preDir, `page-${i + 1}.png`);
        await preprocessImage(imgFiles[i], pre);

        const lines = await ocrImage(worker, pre);
        const txs = extractTransactions(lines);

        allTransactions.push(...txs);

    }

    await worker.terminate();

    console.log(allTransactions);
    //return allTransactions;
}

module.exports = { extrairCreditosCaixa };