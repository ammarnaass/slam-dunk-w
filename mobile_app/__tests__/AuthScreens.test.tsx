import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { RegisterScreen } from '../src/screens/RegisterScreen';
import { LoginScreen } from '../src/screens/LoginScreen';
import { VipScreen } from '../src/screens/VipScreen';
import { SettingsScreen } from '../src/screens/SettingsScreen';
import { OfflineScreen } from '../src/screens/OfflineScreen';

jest.mock('../src/services/api', () => ({
  registerUser: jest.fn().mockResolvedValue({
    user: { id: 'usr_1', name: 'عمار', email: 'ammar@test.com', role: 'user' },
  }),
  loginUser: jest.fn().mockResolvedValue({
    user: { id: 'usr_1', name: 'عمار', email: 'ammar@test.com', role: 'user' },
  }),
  API_BASE_URL: 'http://localhost:3000/api/mobile/v1',
  setApiBaseUrl: jest.fn(),
}));

describe('Stitch Android Screen Suite Tests', () => {
  it('renders RegisterScreen with all Arabic form fields and badges', async () => {
    let renderer: any;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<RegisterScreen />);
    });
    const tree = renderer.toJSON();
    expect(tree).toBeDefined();

    // Verify key textual anchors from anime_daze_2 design
    const str = JSON.stringify(tree);
    expect(str).toContain('إنشاء حساب جديد في');
    expect(str).toContain('انضم لمجتمع الأوتاكو الأكبر عربياً');
    expect(str).toContain('حفظ التقدم والمفضلة');
    expect(str).toContain('تنزيل بجودات متعددة');
    expect(str).toContain('تنبيهات فورية ومخصصة');
    expect(str).toContain('إنشاء الحساب والمتابعة');
  });

  it('renders LoginScreen with cinema banner and fast social auth', async () => {
    let renderer: any;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<LoginScreen />);
    });
    const tree = renderer.toJSON();
    expect(tree).toBeDefined();

    const str = JSON.stringify(tree);
    expect(str).toContain('أهلاً بك مجدداً في ANIME DAZE');
    expect(str).toContain('بوابة الأوتـاكو');
    expect(str).toContain('مزامنة فورية');
    expect(str).toContain('تسجيل الدخول');
    expect(str).toContain('المتابعة كزائر بدون حساب');
  });

  it('renders VipScreen with perks and bento grid', async () => {
    const testPlans = [
      {
        id: 'plan-test-1',
        name: 'باقة VIP السنوية',
        price: 29.99,
        duration: '365',
        description: 'وفر 37%',
        isActive: true,
        isPopular: true,
        features: ['4K Ultra HD', 'بدون إعلانات'],
      },
    ];
    let renderer: any;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<VipScreen initialPlans={testPlans} />);
    });
    const tree = renderer.toJSON();
    expect(tree).toBeDefined();

    const str = JSON.stringify(tree);
    expect(str).toContain('باقات ANIME DAZE VIP');
    expect(str).toContain('حلقة تمت مشاهدتها');
    expect(str).toContain('باقة VIP السنوية');
    expect(str).toContain('29.99');
    expect(str).toContain('إنشاء خطة اشتراك جديدة عبر API');
  });

  it('renders SettingsScreen with streaming quality selection', async () => {
    let renderer: any;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<SettingsScreen />);
    });
    const tree = renderer.toJSON();
    expect(tree).toBeDefined();

    const str = JSON.stringify(tree);
    expect(str).toContain('الإعدادات العامة');
    expect(str).toContain('جودة التشغيل الافتراضية للبث');
    expect(str).toContain('تلقائي ذكي');
    expect(str).toContain('1080p FHD');
  });

  it('renders OfflineScreen with radar and local playback trigger', async () => {
    let renderer: any;
    await ReactTestRenderer.act(async () => {
      renderer = ReactTestRenderer.create(<OfflineScreen />);
    });
    const tree = renderer.toJSON();
    expect(tree).toBeDefined();

    const str = JSON.stringify(tree);
    expect(str).toContain('وضع عدم الاتصال نشط');
    expect(str).toContain('لا يوجد اتصال بالإنترنت!');
    expect(str).toContain('استعراض الحلقات المنزلة');
  });
});
