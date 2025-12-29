import 'dart:io';
import 'package:flutter/material.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:provider/provider.dart';
import 'screens/main_navigation.dart';
import 'providers/home_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  if (Platform.isAndroid || Platform.isIOS) {
    await MobileAds.instance.initialize();
  }

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => HomeProvider()),
      ],
      child: const AnimeDazeApp(),
    ),
  );
}

class AnimeDazeApp extends StatelessWidget {
  const AnimeDazeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'أنمي داز',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        primarySwatch: Colors.red,
        scaffoldBackgroundColor: const Color(0xFF030712), // bg-slate-950
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF030712),
          elevation: 0,
        ),
      ),
      home: const HomeScreen(),
    );
  }
}
