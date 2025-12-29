import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/home_provider.dart';
import 'package:url_launcher/url_launcher.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  final String currentVersion = "1.0.0";

  void _checkForUpdates(BuildContext context, HomeProvider provider) async {
    final latest = provider.latestVersion;
    if (latest != currentVersion) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text("تحديث جديد متوفر"),
          content: Text("إصدار جديد ($latest) متاح الآن. هل ترغب في التحديث؟"),
          actions: [
            TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text("لاحقاً")),
            ElevatedButton(
              onPressed: () async {
                final url = Uri.parse(provider.updateUrl);
                if (await canLaunchUrl(url)) {
                  await launchUrl(url);
                }
              },
              child: const Text("تحديث الآن"),
            ),
          ],
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("أنت تستخدم أحدث إصدار")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final homeProvider = Provider.of<HomeProvider>(context);

    return Scaffold(
      backgroundColor: const Color(0xFF030712),
      appBar: AppBar(
        title: const Text("الملف الشخصي",
            style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
        child: Column(
          children: [
            const CircleAvatar(
              radius: 55,
              backgroundColor: Colors.white12,
              child: Icon(Icons.person_rounded, size: 60, color: Colors.white),
            ),
            const SizedBox(height: 20),
            const Text(
              "مرحباً بك!",
              style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.bold,
                  color: Colors.white),
            ),
            const SizedBox(height: 8),
            Text(
              "سجل دخولك لمزامنة قائمة المشاهدة",
              style: TextStyle(color: Colors.white.withOpacity(0.5)),
            ),
            const SizedBox(height: 40),
            _buildOption(Icons.favorite_rounded, "قائمة المشاهدة", () {}),
            _buildOption(Icons.history_rounded, "سجل المشاهدة", () {}),
            _buildOption(Icons.system_update_rounded, "تحقق من التحديثات",
                () => _checkForUpdates(context, homeProvider)),
            _buildOption(Icons.settings_outlined, "الإعدادات", () {}),
            _buildOption(Icons.info_outline_rounded, "عن التطبيق", () {}),
            const SizedBox(height: 40),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 18),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16)),
                  elevation: 0,
                ),
                child: const Text("تسجيل الدخول",
                    style:
                        TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              ),
            ),
            const SizedBox(height: 24),
            Text(
              "الإصدار $currentVersion",
              style:
                  TextStyle(color: Colors.white.withOpacity(0.2), fontSize: 12),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOption(IconData icon, String title, VoidCallback onTap) {
    return ListTile(
      leading: Icon(icon, color: Colors.red),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
      trailing: const Icon(Icons.arrow_forward_ios, size: 16),
      onTap: onTap,
    );
  }
}
