// تحديث جميع الحلقات بصورة موحدة لسلام دانك
const fs = require('fs');

const episodes = JSON.parse(fs.readFileSync('src/data/episodes.json', 'utf8'));

// صورة كرة سلة لسلام دانك
const slamDunkImage = "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80";

episodes.forEach(episode => {
    episode.thumbnail = slamDunkImage;
});

fs.writeFileSync('src/data/episodes.json', JSON.stringify(episodes, null, 2), 'utf8');

console.log(`✅ تم تحديث ${episodes.length} حلقة بصورة موحدة!`);
console.log('🎨 الآن كل حلقة ستعرض صورة كرة السلة مع رقم الحلقة فوقها');
