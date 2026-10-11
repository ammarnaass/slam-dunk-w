const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');
const path = require('path');

// URLs لجميع حلقات سلام دانك على الموقع
const episodeUrls = [];
for (let i = 1; i <= 101; i++) {
    if (i === 18) continue; // الحلقة 18 غير موجودة
    let url;
    if (i === 1) {
        url = 'https://madaraytcz.blogspot.com/2020/04/1.html';
    } else if (i === 2) {
        url = 'https://madaraytcz.blogspot.com/2020/04/2_15.html';
    } else if (i === 3) {
        url = 'https://madaraytcz.blogspot.com/2020/04/3.html';
    } else if (i >= 4 && i <= 35) {
        url = `https://madaraytcz.blogspot.com/2020/04/${i}.html`;
    } else if (i >= 36 && i <= 101) {
        url = `https://madaraytcz.blogspot.com/2020/05/${i}.html`;
    }
    episodeUrls.push({ number: i, url });
}

// إنشاء مجلد الصور
const thumbnailsDir = path.join('public', 'thumbnails');
if (!fs.existsSync('public')) fs.mkdirSync('public');
if (!fs.existsSync(thumbnailsDir)) fs.mkdirSync(thumbnailsDir);

// تحميل صورة من URL
function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(fs.createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => resolve(filepath));
            } else {
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
            }
        }).on('error', reject);
    });
}

async function extractEpisodeImage(url, episodeNumber) {
    let browser;
    try {
        console.log(`🔍 استخراج صورة الحلقة ${episodeNumber}...`);

        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        // البحث عن صورة الحلقة
        const imageUrl = await page.evaluate(() => {
            // البحث في المحتوى الرئيسي
            const postBody = document.querySelector('.post-body');
            if (!postBody) return null;

            // البحث عن صورة
            const img = postBody.querySelector('img');
            if (img) {
                return img.src;
            }

            // محاولة إيجاد صورة في أي مكان
            const anyImg = document.querySelector('article img, .entry-content img');
            return anyImg ? anyImg.src : null;
        });

        if (imageUrl && !imageUrl.includes('blogger') && !imageUrl.includes('logo')) {
            // تحميل الصورة
            const filename = `episode-${episodeNumber}.jpg`;
            const filepath = path.join(thumbnailsDir, filename);

            await downloadImage(imageUrl, filepath);
            console.log(`✅ تم حفظ صورة الحلقة ${episodeNumber}`);

            return `/thumbnails/${filename}`;
        }

        return null;
    } catch (error) {
        console.error(`❌ خطأ في الحلقة ${episodeNumber}:`, error.message);
        return null;
    } finally {
        if (browser) await browser.close();
    }
}

async function main() {
    console.log('🚀 بدء استخراج صور الحلقات من الموقع...\n');

    const episodes = JSON.parse(fs.readFileSync('src/data/episodes.json', 'utf8'));

    for (const { number, url } of episodeUrls.slice(0, 10)) { // أول 10 للاختبار
        const thumbnail = await extractEpisodeImage(url, number);

        if (thumbnail) {
            const episode = episodes.find(ep => ep.episode_number === number);
            if (episode) {
                episode.thumbnail = thumbnail;
            }
        }

        // انتظار ثانية بين كل طلب
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // حفظ التحديثات
    fs.writeFileSync('src/data/episodes.json', JSON.stringify(episodes, null, 2));

    console.log('\n✅ اكتمل الاستخراج!');
    console.log('📁 الصور محفوظة في: public/thumbnails/');
}

main().catch(console.error);
