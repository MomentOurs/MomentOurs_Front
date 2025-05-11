export type SignUpStackParamList = {
    SignUp1: undefined;
    SignUp2: { email: string; password: string };
    SignUp3: {
      email: string;
      password: string;
      name: string;
      nickname: string;
    };
    VerifyEmail: {
      email: string;
      password: string;
      name: string;
      nickname: string;
      birthDate: string;
      selectedGender: string;
      mbti: string;
    };
    LoginScreen: undefined;
  };