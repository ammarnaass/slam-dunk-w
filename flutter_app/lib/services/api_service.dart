import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/models.dart';

class ApiService {
  // Use your live URL
  static const String baseUrl = "https://slam-dunk-w.vercel.app/api/mobile/v1";

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
