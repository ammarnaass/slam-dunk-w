import 'package:flutter/material.dart';
import '../models/models.dart';
import '../services/api_service.dart';

class HomeProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();

  MobileHomeData? _homeData;
  bool _isLoading = false;
  String? _error;

  MobileHomeData? get homeData => _homeData;
  bool get isLoading => _isLoading;
  String? get error => _error;

  bool get isMaintenance => _homeData?.settings.apiApp.isMaintenance ?? false;
  String get maintenanceMessage =>
      _homeData?.settings.apiApp.maintenanceMessage ?? "";
  String get latestVersion =>
      _homeData?.settings.apiApp.latestVersion ?? "1.0.0";
  String get updateUrl => _homeData?.settings.apiApp.updateUrl ?? "";

  Future<void> fetchHomeData() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _homeData = await _apiService.getHomeData();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
