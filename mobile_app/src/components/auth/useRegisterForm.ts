import { useState } from 'react';
import { Alert } from 'react-native';
import { registerUser } from '../../services/api';
import { useAppStore } from '../../store/useAppStore';

interface UseRegisterFormProps {
  onSuccess?: () => void;
}

export function useRegisterForm({ onSuccess }: UseRegisterFormProps = {}) {
  const { setCurrentUser, refreshUserData } = useAppStore();

  // Form State
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePromo, setAgreePromo] = useState(true);

  // Preference pills
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['sports']);

  // Loading
  const [submitting, setSubmitting] = useState(false);

  // Password matching status
  const isMatch = confirmPassword.length > 0 && password === confirmPassword;
  const isMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const toggleGenre = (genreKey: string) => {
    if (selectedGenres.includes(genreKey)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genreKey));
    } else {
      setSelectedGenres([...selectedGenres, genreKey]);
    }
  };

  const handleRegister = async () => {
    if (!username.trim()) {
      Alert.alert('تنبيه', 'يرجى إدخال اسم المستخدم الفريد (Handle)');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('تنبيه', 'يرجى إدخال بريد إلكتروني صحيح');
      return;
    }
    if (password.length < 6) {
      Alert.alert('تنبيه', 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('تنبيه', 'كلمتا المرور غير متطابقتين');
      return;
    }
    if (!agreeTerms) {
      Alert.alert('تنبيه', 'يرجى الموافقة على شروط الخدمة وسياسة الخصوصية للمتابعة');
      return;
    }

    setSubmitting(true);
    try {
      const res = await registerUser({
        name: displayName.trim() || username.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
        genres: selectedGenres,
      });

      if (res.user) {
        setCurrentUser(res.user);
        refreshUserData();
        Alert.alert(
          'أهلاً بك في ANIME DAZE! 🚀',
          'تم إنشاء حسابك بنجاح. استمتع بمشاهدة أسطورية ومزامنة فورية.',
          [{ text: 'ابدأ الاستكشاف', onPress: () => onSuccess?.() }]
        );
      } else {
        Alert.alert('خطأ', res.error || 'تعذر إتمام التسجيل');
      }
    } catch (err: any) {
      Alert.alert('خطأ', err.message || 'حدث خطأ في الاتصال');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocialRegister = (provider: string) => {
    Alert.alert(
      `التسجيل عبر ${provider}`,
      `سيتم ربط حسابك في ${provider} ومزامنة تقدمك وقائمتك السحابية فوراً.`,
      [
        {
          text: 'متابعة',
          onPress: async () => {
            setSubmitting(true);
            const socialName = `${provider} Otaku`;
            await registerUser({
              name: socialName,
              username: `${provider.toLowerCase()}_user_${Math.floor(Math.random() * 1000)}`,
              email: `${provider.toLowerCase()}@animedaze.app`,
              password: 'social_secure_pass',
            });
            setSubmitting(false);
            onSuccess?.();
          },
        },
        { text: 'إلغاء', style: 'cancel' },
      ]
    );
  };

  return {
    displayName,
    setDisplayName,
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    agreeTerms,
    setAgreeTerms,
    agreePromo,
    setAgreePromo,
    selectedGenres,
    toggleGenre,
    submitting,
    isMatch,
    isMismatch,
    handleRegister,
    handleSocialRegister,
  };
}
