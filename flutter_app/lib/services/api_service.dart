import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/models.dart';

class ApiService {
  // 1. For Android Emulator: Use 10.0.2.2 instead of localhost
  // static const String baseUrl = "http://10.0.2.2:3000/api/mobile/v1";

  // 2. For Physical Device: Use your PC's IP address (run `ipconfig` to find it)
  // static const String baseUrl = "http://192.168.8.101:3001/api/mobile/v1";

  // 3. For Production (Vercel)
  static const String baseUrl = "https://slam-dunk-w.vercel.app/api/mobile/v1";

  // CHANGE THIS: Select the URL appropriate for your testing environment.
  // Currently defaulting to Vercel, but if deployment failed, use Option 1 or 2.

  Future<MobileHomeData> getHomeData() async {
    final response = await http.get(Uri.parse("$baseUrl/home"));

    if (response.statusCode == 200) {
      final Map<String, dynamic> result = json.decode(response.body);
      if (result['success'] == true) {
        return MobileHomeData.fromJson(result['data']);
      }
      throw Exception(result['error'] ?? 'Failed to load home data');
    } else {
      throw Exception('Failed to load home data: ${response.statusCode}');
    }
  }

  Future<Anime> getAnimeDetails(String id) async {
    final response = await http.get(Uri.parse("$baseUrl/animes/$id"));

    if (response.statusCode == 200) {
      final Map<String, dynamic> result = json.decode(response.body);
      if (result['success'] == true) {
        return Anime.fromJson(result['data']);
      }
      throw Exception(result['error'] ?? 'Failed to load anime details');
    } else {
      throw Exception('Failed to load anime details');
    }
  }

  Future<List<Episode>> getAnimeEpisodes(String id) async {
    final response = await http.get(Uri.parse("$baseUrl/animes/$id/episodes"));

    if (response.statusCode == 200) {
      final Map<String, dynamic> result = json.decode(response.body);
      if (result['success'] == true) {
        final List data = result['data'];
        return data.map((i) => Episode.fromJson(i)).toList();
      }
      throw Exception(result['error'] ?? 'Failed to load episodes');
    } else {
      throw Exception('Failed to load episodes');
    }
  }

  Future<List<Anime>> searchAnimes(String query) async {
    final response = await http.get(Uri.parse("$baseUrl/search?q=$query"));

    if (response.statusCode == 200) {
      final Map<String, dynamic> result = json.decode(response.body);
      if (result['success'] == true) {
        final List data = result['data'];
        return data.map((i) => Anime.fromJson(i)).toList();
      }
      throw Exception(result['error'] ?? 'Search failed');
    } else {
      throw Exception('Search failed');
    }
  }
}
