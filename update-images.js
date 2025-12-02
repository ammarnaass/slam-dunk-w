// سكريبت لتحديث صور الحلقات بصور كرة سلة متنوعة
const fs = require('fs');

const episodes = JSON.parse(fs.readFileSync('src/data/episodes.json', 'utf8'));

// روابط صور كرة سلة عالية الجودة من Unsplash
const basketballImages = [
    "https://images.unsplash.com/photo-1546519638-68e109498ffc",
    "https://images.unsplash.com/photo-1608245449230-4ac19066d2d0",
    "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4",
    "https://images.unsplash.com/photo-1519861531473-920026393112",
    "https://images.unsplash.com/photo-1577223625816-7546f13df25d",
    "https://images.unsplash.com/photo-1515523110800-9415d13b84a8",
    "https://images.unsplash.com/photo-1627627256672-027a4613d028",
    "https://images.unsplash.com/photo-1504450758481-7338eba7524a",
    "https://images.unsplash.com/photo-1546519638-68e109498ffc",
    "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4"
];

// تحديث كل حلقة بصورة
episodes.forEach((episode, index) => {
    const imageIndex = index % basketballImages.length;
    episode.thumbnail = `${basketballImages[imageIndex]}?w=800&q=80`;
});

// حفظ الملف
fs.writeFileSync('src/data/episodes.json', JSON.stringify(episodes, null, 2), 'utf8');

console.log(`✅ تم تحديث صور ${episodes.length} حلقة بنجاح!`);
