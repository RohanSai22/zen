// ignore_for_file: use_build_context_synchronously

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:zen/constants/global_variables.dart';

import '../../../models/user_model.dart';

class SignUp extends StatelessWidget {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController phoneController = TextEditingController();
  final TextEditingController nameController = TextEditingController();

  SignUp({super.key});

  Future<void> registerUser(BuildContext context) async {
    String email = emailController.text;
    String password = passwordController.text;
    String phone = phoneController.text;
    String name = nameController.text;

    User user = User(
      email: email,
      password: password,
      phone: phone,
      name: name,
      id: '',
      type: '',
      address: '',
      token: '',
    );
    // Send user data to the backend for registration
    http.Response response = await http
        .post(Uri.parse('$uri/signup'), // Replace with your backend URL
            body: user.toJson(),
            headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        });
        Navigator.pushNamed(context, '/home');
    if (response.statusCode == 200) {
      // User registered successfully, navigate to home page
      Navigator.pushNamed(context, '/home');
    } else if (response.statusCode == 400) {
      // User already exists, show a message
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('User already exists'),
        ),
      );
    } else {
      // Handle other error cases
      const ScaffoldMessenger(
        child: SnackBar(
          content: Text('Error registering user'),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Sign Up'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            TextFormField(
              controller: emailController,
              decoration: const InputDecoration(
                labelText: 'Email',
              ),
            ),
            TextFormField(
              controller: nameController,
              decoration: const InputDecoration(
                labelText: 'Name',
              ),
            ),
            TextFormField(
              controller: passwordController,
              decoration: const InputDecoration(
                labelText: 'Password',
              ),
              obscureText: true,
            ),
            TextFormField(
              controller: phoneController,
              decoration: const InputDecoration(
                labelText: 'Phone Number',
              ),
              keyboardType: TextInputType.phone,
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                // Call API to register user
                registerUser(context);
              },
              child: const Text('Sign Up'),
            ),
          ],
        ),
      ),
    );
  }
}
