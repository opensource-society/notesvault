<?php
// Simple JWT implementation for PHP
class JWT {
    public static function encode($payload, $key, $alg = 'HS256') {
        $header = json_encode(['typ' => 'JWT', 'alg' => $alg]);
        $payload = json_encode($payload);
        
        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $key, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }
    
    public static function decode($jwt, $key, $allowedAlgs = ['HS256']) {
        $tokenParts = explode('.', $jwt);
        if (count($tokenParts) != 3) {
            throw new Exception('Invalid token format');
        }
        
        list($base64UrlHeader, $base64UrlPayload, $base64UrlSignature) = $tokenParts;
        
        $signature = base64_decode(str_replace(['-', '_'], ['+', '/'], $base64UrlSignature));
        $header = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $base64UrlHeader)));
        $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $base64UrlPayload)));
        
        if (empty($header->alg) || !in_array($header->alg, $allowedAlgs)) {
            throw new Exception('Algorithm not allowed');
        }
        
        $expectedSignature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $key, true);
        if (!hash_equals($signature, $expectedSignature)) {
            throw new Exception('Invalid signature');
        }
        
        if (isset($payload->exp) && $payload->exp < time()) {
            throw new Exception('Token has expired');
        }
        
        return $payload;
    }
}
?>