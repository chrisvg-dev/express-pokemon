const styles = require('../document.style');
const fonts = require('../pdf.style');

const PdfPrinter = require('pdfmake');
const fs = require('fs');

const pdfMaker = (content) => {
    let pdfDefinition = {
        content: content,
        styles: styles
    };    
    const pdfPrinter = new PdfPrinter(fonts);
    let pdfDoc = pdfPrinter.createPdfKitDocument(pdfDefinition);
    pdfDoc.pipe(fs.createWriteStream('pdf/pdfPokemon.pdf'));
    pdfDoc.end();
};

const renderContent = (pokemon, data) => {
    let content = [
        {
            text: pokemon, style: 'header'
        },
        JSON.stringify(data.abilities),
        JSON.stringify(data.forms),
    ];
    return content;
};

module.exports = {
    pdfMaker, renderContent
};