const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// قراءة ملف الحلقات
const episodes = JSON.parse(fs.readFileSync('src/data/episodes.json', 'utf8'));

// إنشاء مجلد الصور إذا لم يكن موجوداً
const thumbnailsDir = path.join('public', 'thumbnails');
if (!fs.existsSync(thumbnailsDir)) {
    fs.mkdirSync(thumbnailsDir, { recursive: true });
}

async function captureVideoFrame(megaUrl, episodeNumber) {
    let browser;
    try {
        console.log(`📸 جاري التقاط الحلقة ${episodeNumber}...`);

        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 720 });

        // الذهاب إلى صفحة Mega
        await page.goto(megaUrl, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        // انتظار ظهور الفيديو
        await page.waitForSelector('video', { timeout: 10000 });

        // تشغيل الفيديو والانتظار قليلاً
        await page.evaluate(() => {
            const video = document.querySelector('video');
            if (video) {
                video.currentTime = 5; // الانتقال إلى الثانية 5
                video.play();
            }
        });

        // انتظار 3 ثواني
        await new Promise(resolve => setTimeout(resolve, 3000));

        // إيقاف الفيديو
        await page.evaluate(() => {
            const video = document.querySelector('video');
            if (video) video.pause();
        });

        // أخذ screenshot للفيديو فقط
        const videoElement = await page.$('video');
        if (videoElement) {
            const outputPath = path.join(thumbnailsDir, `episode-${episodeNumber}.jpg`);
            await videoElement.screenshot({
                path: outputPath,
                type: 'jpeg',
                quality: 85
            });

            console.log(`✅ تم حفظ الحلقة ${episodeNumber}`);
            return `/thumbnails/episode-${episodeNumber}.jpg`;
        }

        return null;
    } catch (error) {
        console.error(`❌ خطأ في الحلقة ${episodeNumber}:`, error.message);
        return null;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

async function processAllEpisodes() {
    console.log('🎬 بدء استخراج صور الحلقات من Mega...');
    console.log(`📝 إجمالي الحلقات: ${episodes.length}`);
    console.log('⏱️  هذا قد يستغرق بعض الوقت...\n');

    let successCount = 0;
    let failCount = 0;

    for (const episode of episodes) {
        const thumbnail = await captureVideoFrame(
            episode.mega_link,
            episode.episode_number
        );

        if (thumbnail) {
            episode.thumbnail = thumbnail;
            successCount++;
        } else {
            failCount++;
            // استخدام صورة افتراضية
            episode.thumbnail = '/thumbnails/default.jpg';
        }

        // انتظار 2 ثانية بين كل حلقة لتجنب الحظر
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // حفظ الملف المحدث
    fs.writeFileSync(
        'src/data/episodes.json',
        JSON.stringify(episodes, null, 2),
        'utf8'
    );

    console.log('\n✅ اكتمل الاستخراج!');
    console.log(`✅ نجح: ${successCount} حلقة`);
    console.log(`❌ فشل: ${failCount} حلقة`);
    console.log('\n📁 الصور في: public/thumbnails/');
    console.log('📝 تم تحديث: src/data/episodes.json');
}

// تشغيل السكريبت
processAllEpisodes().catch(console.error);
