import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:shimmer/shimmer.dart';
import '../models/models.dart';
import '../providers/home_provider.dart';
import 'search_screen.dart';
import 'anime_details_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() =>
        Provider.of<HomeProvider>(context, listen: false).fetchHomeData());
  }

  @override
  Widget build(BuildContext context) {
    final homeProvider = Provider.of<HomeProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFF030712),
      appBar: homeProvider.isMaintenance || homeProvider.isLoading
          ? null
          : AppBar(
              title: const Text('أنمي داز',
                  style: TextStyle(fontWeight: FontWeight.bold)),
              centerTitle: true,
              backgroundColor: Colors.transparent,
              elevation: 0,
              actions: [
                IconButton(
                  onPressed: () => Navigator.push(context,
                      MaterialPageRoute(builder: (_) => const SearchScreen())),
                  icon: const Icon(Icons.search),
                ),
              ],
            ),
      body: homeProvider.isLoading
          ? const Center(child: CircularProgressIndicator(color: Colors.red))
          : homeProvider.isMaintenance
              ? _buildMaintenanceScreen(homeProvider.maintenanceMessage)
              : homeProvider.error != null
                  ? Center(child: Text('خطأ: ${homeProvider.error}'))
                  : _buildHomeContent(homeProvider.homeData!),
    );
  }

  Widget _buildMaintenanceScreen(String message) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.engineering_rounded, size: 80, color: Colors.red),
            const SizedBox(height: 24),
            const Text(
              "وضع الصيانة",
              style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.white),
            ),
            const SizedBox(height: 12),
            Text(
              message,
              textAlign: TextAlign.center,
              style: const TextStyle(color: Colors.grey, fontSize: 16),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHomeContent(MobileHomeData data) {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 1. Hero Slider (Native)
          if (data.slider.isNotEmpty)
            SizedBox(
              height: 250,
              child: PageView.builder(
                itemCount: data.slider.length,
                itemBuilder: (context, index) {
                  final anime = data.slider[index];
                  return GestureDetector(
                    onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (_) =>
                                AnimeDetailsScreen(animeId: anime.id))),
                    child: _buildHeroItem(anime),
                  );
                },
              ),
            ),

          const SizedBox(height: 24),

          // 2. Latest Episodes Section
          _buildSectionHeader("آخر الحلقات المضافة"),
          SizedBox(
            height: 180,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: data.latest.length,
              itemBuilder: (context, index) {
                final episode = data.latest[index];
                return GestureDetector(
                  onTap: () {
                    // In a native app, episodes usually go to the Anime page first
                    // or a dedicated video player. For now, we'll go to Anime details.
                    Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (_) =>
                                AnimeDetailsScreen(animeId: episode.animeId)));
                  },
                  child: _buildEpisodeCard(episode),
                );
              },
            ),
          ),

          const SizedBox(height: 24),

          // 3. Trending Section
          _buildSectionHeader("أنميات مستمرة (Ongoing)"),
          SizedBox(
            height: 240,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: data.ongoing.length,
              itemBuilder: (context, index) {
                final anime = data.ongoing[index];
                return GestureDetector(
                  onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (_) =>
                              AnimeDetailsScreen(animeId: anime.id))),
                  child: _buildAnimeCard(anime),
                );
              },
            ),
          ),

          const SizedBox(height: 80), // Space for bottom nav or ads
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          Container(width: 4, height: 20, color: Colors.red),
          const SizedBox(width: 8),
          Text(
            title,
            style: const TextStyle(
                fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          const Spacer(),
          TextButton(
              onPressed: () {},
              child: const Text('المزيد', style: TextStyle(color: Colors.red))),
        ],
      ),
    );
  }

  Widget _buildHeroItem(Anime anime) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 10),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Stack(
          children: [
            CachedNetworkImage(
              imageUrl: anime.bannerImage ?? anime.coverImage,
              height: double.infinity,
              width: double.infinity,
              fit: BoxFit.cover,
            ),
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.bottomCenter,
                  end: Alignment.topCenter,
                  colors: [
                    const Color(0xFF030712).withOpacity(0.9),
                    const Color(0xFF030712).withOpacity(0.3),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
            Positioned(
              bottom: 20,
              right: 20,
              left: 20,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: Colors.red,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      anime.type,
                      style: const TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: Colors.white),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    anime.title,
                    style: const TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      letterSpacing: 0.5,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEpisodeCard(Episode ep) {
    return Container(
      width: 140,
      margin: const EdgeInsets.only(left: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: CachedNetworkImage(
              imageUrl: ep.thumbnail,
              height: 100,
              width: 140,
              fit: BoxFit.cover,
              placeholder: (context, url) => Shimmer.fromColors(
                baseColor: Colors.grey[900]!,
                highlightColor: Colors.grey[800]!,
                child: Container(color: Colors.black),
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            ep.animeTitle ?? "Unknown",
            style: const TextStyle(
                color: Colors.red, fontSize: 10, fontWeight: FontWeight.bold),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          Text(
            ep.title,
            style: const TextStyle(
                color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildAnimeCard(Anime anime) {
    return Container(
      width: 140,
      margin: const EdgeInsets.only(left: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: CachedNetworkImage(
              imageUrl: anime.coverImage,
              height: 180,
              width: 140,
              fit: BoxFit.cover,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            anime.title,
            style: const TextStyle(
                color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
