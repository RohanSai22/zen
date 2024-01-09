import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:zen/constants/global_variables.dart';

class SignIn extends StatelessWidget {
  final TextEditingController emailPhoneController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  SignIn({Key? key}) : super(key: key);

  Future<void> signIn(BuildContext context) async {
    String emailPhone = emailPhoneController.text;
    String password = passwordController.text;

    // Send user data to the backend for authentication
     http.Response response = await http.post(
      Uri.parse('$uri/signin'), // Replace with your backend URL
      body: jsonEncode({
        "email": emailPhone,
        "phone": emailPhone,
        "password": password,
      }),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
    );
    Navigator.pushNamed(context, '/home');

    if (response.statusCode == 200) {
      Navigator.pushNamed(context, '/home');
    } else if (response.statusCode == 404) {
      const ScaffoldMessenger(child: SnackBar(
          content: Text('Email/Number entered does not exist'),
        ),
      );
    } else if (response.statusCode == 401) {
      // Entered password is incorrect
      const ScaffoldMessenger(child:
        SnackBar(
          content: Text('Entered password is incorrect'),
        ),
      );
    } else {
      // Handle other error cases
      const ScaffoldMessenger(child:
        SnackBar(
          content: Text('Error signing in'),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Sign In'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextFormField(
              controller: emailPhoneController,
              decoration: const InputDecoration(
                labelText: 'Email or Phone Number',
              ),
            ),
            TextFormField(
              controller: passwordController,
              decoration: const InputDecoration(
                labelText: 'Password',
              ),
              obscureText: true,
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                // Call API for sign-in
                signIn(context);
              },
              child: const Text('Sign In'),
            ),
          ],
        ),
      ),
    );
  }
}
