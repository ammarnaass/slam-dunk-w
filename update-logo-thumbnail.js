const fs = require('fs');

const episodes = JSON.parse(fs.readFileSync('src/data/episodes.json', 'utf8'));

// المسار الجديد للصورة
const newThumbnail = "/logoep.jpg";

episodes.forEach(episode => {
    episode.thumbnail = newThumbnail;
});

fs.writeFileSync('src/data/episodes.json', JSON.stringify(episodes, null, 2), 'utf8');

console.log(`✅ تم تحديث ${episodes.length} حلقة لتستخدم الصورة ${newThumbnail}`);
