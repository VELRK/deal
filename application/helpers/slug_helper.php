<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Generate SEO-friendly slug from string
 * 
 * @param string $string The string to convert to slug
 * @return string The generated slug
 */
if (!function_exists('generate_slug')) {
    function generate_slug($string) {
        // Convert to lowercase
        $string = strtolower($string);
        
        // Replace spaces and underscores with hyphens
        $string = preg_replace('/[\s_]+/', '-', $string);
        
        // Remove special characters except hyphens
        $string = preg_replace('/[^a-z0-9\-]/', '', $string);
        
        // Remove multiple consecutive hyphens
        $string = preg_replace('/-+/', '-', $string);
        
        // Trim hyphens from start and end
        $string = trim($string, '-');
        
        return $string;
    }
}

/**
 * Generate unique slug for property
 * 
 * @param string $name Property name
 * @param int $exclude_id Property ID to exclude (for updates)
 * @return string Unique slug
 */
if (!function_exists('generate_unique_slug')) {
    function generate_unique_slug($name, $exclude_id = null) {
        $CI =& get_instance();
        $CI->load->database();
        
        $base_slug = generate_slug($name);
        $slug = $base_slug;
        $counter = 1;
        
        // Check if slug exists
        $CI->db->where('slug', $slug);
        if ($exclude_id) {
            $CI->db->where('id !=', $exclude_id);
        }
        $exists = $CI->db->get('properties')->row();
        
        // If slug exists, append number until unique
        while ($exists) {
            $slug = $base_slug . '-' . $counter;
            $CI->db->where('slug', $slug);
            if ($exclude_id) {
                $CI->db->where('id !=', $exclude_id);
            }
            $exists = $CI->db->get('properties')->row();
            $counter++;
        }
        
        return $slug;
    }
}

/**
 * Get property URL using slug (falls back to ID if slug not available)
 * 
 * @param object $property Property object
 * @return string Property URL
 */
if (!function_exists('property_url')) {
    function property_url($property) {
        if (is_object($property)) {
            // Use slug if available, otherwise use ID
            if (!empty($property->slug)) {
                return base_url('property/' . $property->slug);
            } elseif (isset($property->id)) {
                return base_url('property/' . $property->id);
            }
        } elseif (is_array($property)) {
            // Handle array format
            if (!empty($property['slug'])) {
                return base_url('property/' . $property['slug']);
            } elseif (isset($property['id'])) {
                return base_url('property/' . $property['id']);
            }
        }
        return base_url('property/');
    }
}

/**
 * Format price in Lakh/Crore format
 * 
 * @param float|int|string $price The price to format
 * @return string Formatted price string (e.g., "₹1.5 Crore", "₹25 Lakh", "₹50,000")
 */
if (!function_exists('format_price_indian')) {
    function format_price_indian($price) {
        // Convert to float if string
        $price = floatval($price);
        
        // If price is 0 or empty, return 0
        if ($price <= 0) {
            return '₹0';
        }
        
        // 1 Crore = 1,00,00,000 (10,000,000)
        // 1 Lakh = 1,00,000 (100,000)
        
        if ($price >= 10000000) {
            // Format in Crore
            $crore = $price / 10000000;
            // Round to 1 decimal place if needed
            if ($crore == floor($crore)) {
                return '₹' . number_format($crore, 0) . ' Crore';
            } else {
                return '₹' . number_format($crore, 1) . ' Crore';
            }
        } elseif ($price >= 100000) {
            // Format in Lakh
            $lakh = $price / 100000;
            // Round to 1 decimal place if needed
            if ($lakh == floor($lakh)) {
                return '₹' . number_format($lakh, 0) . ' Lakh';
            } else {
                return '₹' . number_format($lakh, 1) . ' Lakh';
            }
        } else {
            // Format as regular number for amounts less than 1 Lakh
            return '₹' . number_format($price, 0);
        }
    }
}