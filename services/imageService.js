const fs = require('fs');
const { createCanvas } = require('canvas');
const path = require('path');

module.exports.generateSummaryImage = async (data) => {
    const { totalCountries, topCountries, lastRefreshed } = data;
    // Create canvas
    const width = 1000;
    const height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1e3a8a');
    gradient.addColorStop(1, '#3b82f6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Country Data Summary', width / 2, 60);

    // Total countries
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Total Countries: ${totalCountries}`, width / 2, 120);

    // Divider line
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 150);
    ctx.lineTo(700, 150);
    ctx.stroke();

    // Top 5 countries header
    ctx.font = 'bold 28px Arial';
    ctx.fillText('Top 5 Countries by GDP', width / 2, 200);

    // List top countries
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    let yPosition = 250;

    topCountries.forEach((country, index) => {
        const gdpFormatted = country.estimated_gdp
            ? `$${parseFloat(country.estimated_gdp).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
            : 'N/A';

        ctx.fillStyle = '#fbbf24';
        ctx.fillText(`${index + 1}.`, 150, yPosition);

        ctx.fillStyle = '#ffffff';
        ctx.fillText(country.name, 200, yPosition);

        ctx.fillStyle = '#86efac';
        ctx.fillText(gdpFormatted, 800, yPosition);

        yPosition += 60;
    });

    // Last refreshed timestamp
    ctx.fillStyle = '#d1d5db';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    const formattedDate = lastRefreshed
        ? new Date(lastRefreshed).toLocaleString()
        : 'Never';
    ctx.fillText(`Last Refreshed: ${formattedDate}`, width / 2, height - 30);

    // Save image
    const cacheDir = path.join(__dirname, '../../cache');
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
    }

    const imagePath = path.join(cacheDir, 'summary.png');
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(imagePath, buffer);

    return imagePath;
}

module.exports.getImagePath = () => {
    return path.join(__dirname, '../../cache/summary.png');
};

module.exports.imageExists = () => {
    const imagePath = module.exports.getImagePath();
    return fs.existsSync(imagePath);
};