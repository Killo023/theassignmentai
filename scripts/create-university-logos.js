const fs = require('fs');
const { createCanvas } = require('canvas');

// University data
const universities = [
  { name: 'MIT', shortName: 'MIT', color: '#8A2BE2' },
  { name: 'Stanford', shortName: 'STANFORD', color: '#B22222' },
  { name: 'Harvard', shortName: 'HARVARD', color: '#C41E3A' },
  { name: 'Yale', shortName: 'YALE', color: '#00356B' },
  { name: 'UC Berkeley', shortName: 'BERKELEY', color: '#003262' }
];

// Function to create a university logo
function createUniversityLogo(university) {
  const canvas = createCanvas(150, 80);
  const ctx = canvas.getContext('2d');
  
  // Set background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 150, 80);
  
  // Add border
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, 150, 80);
  
  // Add university color accent
  ctx.fillStyle = university.color;
  ctx.fillRect(0, 0, 150, 8);
  
  // Add university name
  ctx.fillStyle = '#374151';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(university.shortName, 75, 45);
  
  // Add "University" text
  ctx.font = '10px Arial';
  ctx.fillStyle = '#6B7280';
  ctx.fillText('UNIVERSITY', 75, 60);
  
  return canvas.toBuffer('image/png');
}

// Create logos directory if it doesn't exist
const logosDir = './public/images/universities';
if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

// Generate all university logos
universities.forEach(university => {
  const logoBuffer = createUniversityLogo(university);
  const filename = `logo-${university.name.toLowerCase().replace(' ', '-')}.png`;
  const filepath = `${logosDir}/${filename}`;
  
  fs.writeFileSync(filepath, logoBuffer);
  console.log(`✅ Created: ${filename}`);
});

console.log('\n🎓 All university logos created successfully!');
console.log('📁 Logos saved in: public/images/universities/'); 