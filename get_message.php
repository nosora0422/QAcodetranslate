<?php
require 'vendor/autoload.php';

use GuzzleHttp\Client;
$postData = json_decode(file_get_contents('php://input'), true);


// ****** add api key here ********
// $apiKey = '';

$lagnuage = $postData['firstOption'];
$userInput= $postData['userinput'];


$client = new Client([
    'base_uri' => 'https://api.openai.com/v1/',
    'headers' => [
        'Authorization' => 'Bearer ' . $apiKey,
        'Content-Type' => 'application/json', 
    ]
]);

$response = $client->request('POST', 'chat/completions', [
    'json' => [
        'model' => 'gpt-3.5-turbo',
        'messages' => [
            [
                'role' => 'user',
                'content' => "Can you translate this code below to $lagnuage? $userInput"
            ]
        ],
        'max_tokens' => 1000
    ]
]);

$body = $response->getBody()->getContents();

echo $body;
?>