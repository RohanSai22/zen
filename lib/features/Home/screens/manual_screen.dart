import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ManualScreen extends StatefulWidget {
  final String userId;

  const ManualScreen({super.key, required this.userId});

  @override
  ManualScreenState createState() => ManualScreenState();
}

class ManualScreenState extends State<ManualScreen> {
  TextEditingController descriptionController = TextEditingController();
  String accountType = 'Sales';
  String transactionType = 'Credit';

  Future<void> postTransaction() async {
    String description = descriptionController.text;

    var apiUrl = Uri.parse('YOUR_BACKEND_API_URL/api/addTransaction');

    Map<String, dynamic> transactionData = {
      'userId': widget.userId, // Use the userId passed to the widget
      'description': description,
      'transactionType': transactionType,
      'accountType': accountType,
      // Add other transaction data here
    };

    try {
      var response = await http.post(
        apiUrl,
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(transactionData),
      );

      if (response.statusCode == 200) {
        // Transaction posted successfully
        showSuccessDialog();
      } else {
        // Error occurred while posting transaction
        handlePostError(response.statusCode.toString());
      }
    } catch (error) {
      handleException(error.toString());
    }
  }

  void showSuccessDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Transaction Added Successfully'),
          actions: <Widget>[
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('OK'),
            ),
          ],
        );
      },
    );
  }

  void handlePostError(String errorMessage) {
    // Error occurred while posting transaction
    debugPrint('Failed to add transaction. Error: $errorMessage');
    // Handle error scenario
  }

  void handleException(String error) {
    debugPrint('Error: $error');
    // Handle other exceptions if necessary
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Manual'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Description:'),
            TextField(
              controller: descriptionController,
              decoration: const InputDecoration(
                hintText: 'Enter description',
              ),
            ),
            const SizedBox(height: 20),
            const Text('Account Type:'),
            DropdownButton<String>(
              value: accountType,
              onChanged: (String? newValue) {
                if (newValue != null) {
                  setState(() {
                    accountType = newValue;
                  });
                }
              },
              items: <String>[
                'Sales',
                'Cost of Goods Sold',
                'Bank Account',
                'Cash'
              ].map<DropdownMenuItem<String>>((String value) {
                return DropdownMenuItem<String>(
                  value: value,
                  child: Text(value),
                );
              }).toList(),
            ),
            const SizedBox(height: 20),
            const Text('Transaction Type:'),
            DropdownButton<String>(
              value: transactionType,
              onChanged: (String? newValue) {
                if (newValue != null) {
                  setState(() {
                    transactionType = newValue;
                  });
                }
              },
              items: <String>['Credit', 'Debit']
                  .map<DropdownMenuItem<String>>((String value) {
                return DropdownMenuItem<String>(
                  value: value,
                  child: Text(value),
                );
              }).toList(),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                postTransaction();
              },
              child: const Text('Post Transaction'),
            ),
          ],
        ),
      ),
    );
  }
}
