class Anime {
  final String id;
  final String title;
  final String description;
  final String coverImage;
  final String? bannerImage;
  final String type;
  final String status;
  final int totalEpisodes;
  final String? releaseYear;
  final List<String> genres;

  Anime({
    required this.id,
    required this.title,
    required this.description,
    required this.coverImage,
    this.bannerImage,
    required this.type,
    required this.status,
    required this.totalEpisodes,
    this.releaseYear,
    required this.genres,
  });

  factory Anime.fromJson(Map<String, dynamic> json) {
    return Anime(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      coverImage: json['coverImage'],
      bannerImage: json['bannerImage'],
      type: json['type'],
      status: json['status'],
      totalEpisodes: json['totalEpisodes'],
      releaseYear: json['releaseYear'],
      genres: List<String>.from(json['genres'] ?? []),
    );
  }
}

class Episode {
  final String id;
  final String animeId;
  final String title;
  final String description;
  final int episodeNumber;
  final String thumbnail;
  final String duration;
  final String megaLink;
  final String? animeTitle;
  final String? animeCover;

  Episode({
    required this.id,
    required this.animeId,
    required this.title,
    required this.description,
    required this.episodeNumber,
    required this.thumbnail,
    required this.duration,
    required this.megaLink,
    this.animeTitle,
    this.animeCover,
  });

  factory Episode.fromJson(Map<String, dynamic> json) {
    return Episode(
      id: json['id'],
      animeId: json['animeId'],
      title: json['title'],
      description: json['description'],
      episodeNumber: json['episode_number'],
      thumbnail: json['thumbnail'],
      duration: json['duration'],
      megaLink: json['mega_link'],
      animeTitle: json['animeTitle'],
      animeCover: json['animeCover'],
    );
  }
}

class Settings {
  final String siteName;
  final bool isAdmobEnabled;
  final String? admobAppId;
  final String? bannerId;
  final String? interstitialId;
  final ApiAppSettings apiApp;

  Settings({
    required this.siteName,
    required this.isAdmobEnabled,
    this.admobAppId,
    this.bannerId,
    this.interstitialId,
    required this.apiApp,
  });

  factory Settings.fromJson(Map<String, dynamic> json) {
    return Settings(
      siteName: json['siteName'] ?? "أنمي داز",
      isAdmobEnabled: json['admob']?['isEnabled'] ?? false,
      admobAppId: json['admob']?['appId'],
      bannerId: json['admob']?['bannerId'],
      interstitialId: json['admob']?['interstitialId'],
      apiApp: ApiAppSettings.fromJson(json['apiApp'] ?? {}),
    );
  }
}

class ApiAppSettings {
  final bool isMaintenance;
  final String maintenanceMessage;
  final String latestVersion;
  final String updateUrl;

  ApiAppSettings({
    required this.isMaintenance,
    required this.maintenanceMessage,
    required this.latestVersion,
    required this.updateUrl,
  });

  factory ApiAppSettings.fromJson(Map<String, dynamic> json) {
    return ApiAppSettings(
      isMaintenance: json['isMaintenance'] ?? false,
      maintenanceMessage: json['maintenanceMessage'] ?? "Maintenance mode...",
      latestVersion: json['latestVersion'] ?? "1.0.0",
      updateUrl: json['updateUrl'] ?? "",
    );
  }
}

class MobileHomeData {
  final List<Anime> slider;
  final List<Episode> latest;
  final List<Anime> ongoing;
  final List<HomeSection> sections;
  final Settings settings;

  MobileHomeData({
    required this.slider,
    required this.latest,
    required this.ongoing,
    required this.sections,
    required this.settings,
  });

  factory MobileHomeData.fromJson(Map<String, dynamic> json) {
    return MobileHomeData(
      slider: (json['slider'] as List).map((i) => Anime.fromJson(i)).toList(),
      latest: (json['latest'] as List).map((i) => Episode.fromJson(i)).toList(),
      ongoing: (json['ongoing'] as List).map((i) => Anime.fromJson(i)).toList(),
      sections: (json['sections'] as List)
          .map((i) => HomeSection.fromJson(i))
          .toList(),
      settings: Settings.fromJson(json['settings'] ?? {}),
    );
  }
}

class HomeSection {
  final String title;
  final List<Anime> items;

  HomeSection({required this.title, required this.items});

  factory HomeSection.fromJson(Map<String, dynamic> json) {
    return HomeSection(
      title: json['title'],
      items: (json['items'] as List).map((i) => Anime.fromJson(i)).toList(),
    );
  }
}
