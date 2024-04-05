<?php
require 'vendor/autoload.php';

use GuzzleHttp\Client;
use GuzzleHttp\Promise;
use GuzzleHttp\Utils;

// Retrieve POST data
$postData = json_decode(file_get_contents('php://input'), true);

// ****** add api key here ********
// $apiKey = '';
$validation_code = $postData['userinput'];


// Instantiate Guzzle client with base URI and API key as default headers
$client = new Client([
    'base_uri' => 'https://api.openai.com/v1/',
    'headers' => [
        'Authorization' => 'Bearer ' . $apiKey,
        'Content-Type' => 'application/json', 
    ]
]);

// Create promises for each request
$promises = [
    'langResponse' => $client->postAsync('chat/completions', [
        'json' => [
            'model' => 'gpt-3.5-turbo',
            'messages' => [
                [
                    'role' => 'user',
                    'content' => "In one word, what coding language is $validation_code  written in."
                ]
            ],
            'max_tokens' => 1000
        ]
    ]),
    'errorResponse' => $client->postAsync('chat/completions', [
        'json' => [
            'model' => 'gpt-3.5-turbo',
            'messages' => [
                [
                    'role' => 'user',
                    'content' => "In only one word true or false, are there errors in this code: $validation_code "
                ]
            ],
            'max_tokens' => 1000
        ]
    ]),
    'correctedResponse' => $client->postAsync('chat/completions', [
        'json' => [
            'model' => 'gpt-3.5-turbo',
            'messages' => [
                [
                    'role' => 'user',
                    'content' => "Correct errors in this code with inline comments about changes: $validation_code "
                ]
            ],
            'max_tokens' => 1000
        ]
    ])
];



// Wait for all promises to complete
$responses = Promise\Utils::settle($promises)->wait();

// function dd($ob) {
//     echo "<pre>" . print_r($ob, true) . "</pre>";
//     die();
// }

// dd($responses['langResponse']['value']->getBody()->getContents());

// Handle responses
$langResponse = $responses['langResponse']['value'];
$errorResponse = $responses['errorResponse']['value'];
$correctedResponse = $responses['correctedResponse']['value'];

// Handle responses as needed
$langResponseBody = $langResponse->getBody()->getContents();
$errorResponseBody = $errorResponse->getBody()->getContents();
$correctedResponseBody = $correctedResponse->getBody()->getContents();

// dd($langResponseBody);

echo json_encode([
    'langResponse' => json_decode($langResponseBody),
    'errorResponse' => json_decode($errorResponseBody),
    'correctedResponse' => json_decode($correctedResponseBody)
]);
?>


