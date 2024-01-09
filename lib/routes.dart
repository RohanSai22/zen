import 'package:flutter/material.dart';
import 'package:zen/features/Authentication/screens/auth_screen.dart';
import 'package:zen/features/Authentication/widgets/forgot_password.dart';
import 'package:zen/features/Authentication/widgets/sign_in.dart';
import 'package:zen/features/Authentication/widgets/sign_up.dart';
import 'package:zen/features/Home/screens/home_scree.dart';
import 'package:zen/features/SplashScreen/splash_screen.dart';
// Replace 'home_screen.dart' with your actual home screen file

class RouteGenerator {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
          case '/':
            return MaterialPageRoute(builder: (_) => const SplashScreen());
          case AuthScreen.routeName:
            return MaterialPageRoute(builder: (_) => const AuthScreen());
          case '/signin':
            return MaterialPageRoute(builder: (_) => SignIn());
          case '/signup':
            return MaterialPageRoute(builder: (_) => SignUp());
          case '/home':
            return MaterialPageRoute(builder: (_) => const HomeScreen());
          case '/forgot_password':
            return MaterialPageRoute(builder: (_) => const ForgotPassword());
       
        default:
        return MaterialPageRoute(builder: (_) => const UnknownScreen());
    }
  }
}

class UnknownScreen extends StatelessWidget {
  const UnknownScreen({super.key});
  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text('Unknown Screen'),
      ),
    );
  }
}
