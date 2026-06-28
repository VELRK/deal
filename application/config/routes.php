<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	https://codeigniter.com/userguide3/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There are three reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router which controller/method to use if those
| provided in the URL cannot be matched to a valid route.
|
|	$route['translate_uri_dashes'] = FALSE;
|
| This is not exactly a route, but allows you to automatically route
| controller and method names that contain dashes. '-' isn't a valid
| class or method name character, so it requires translation.
| When you set this option to TRUE, it will replace ALL dashes in the
| controller and method URI segments.
|
| Examples:	my-controller/index	-> my_controller/index
|		my-controller/my-method	-> my_controller/my_method
*/
$route['default_controller'] = 'Home';
$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;

// Additional routes
$route['home'] = 'Home/index';
$route['listing'] = 'Listing/index';
$route['listing/search'] = 'Listing/search';
// $route['about'] = 'About/index'; // Commented out - using Home/about instead
$route['blog'] = 'Blog/index';
$route['blog/post/(:any)'] = 'Blog/post/$1';
$route['blog/create'] = 'Blog/create';
$route['blog/edit/(:num)'] = 'Blog/edit/$1';
$route['blog/delete/(:num)'] = 'Blog/delete/$1';
$route['blog/manage'] = 'Blog/manage';
$route['blog/search'] = 'Blog/search';
$route['contact'] = 'Contact/index';
$route['blog-detail'] = 'Blog_detail/index';
$route['property-detail'] = 'Property_detail/index';
$route['property-detail/(:any)'] = 'Property_detail/index/$1';
// Support for old HTML file names
$route['property-details-v1'] = 'Property_detail/index';
$route['property-details-v1/(:any)'] = 'Property_detail/index/$1';
$route['property-details-v2'] = 'Property_detail/index';
$route['property-details-v2/(:any)'] = 'Property_detail/index/$1';
$route['property-details-v3'] = 'Property_detail/index';
$route['property-details-v3/(:any)'] = 'Property_detail/index/$1';
$route['property-details-v4'] = 'Property_detail/index';
$route['property-details-v4/(:any)'] = 'Property_detail/index/$1';
$route['login'] = 'Login/index';
$route['register'] = 'Register/index';

// ============================================
// Authentication API Routes
// ============================================
// All routes support both underscore and hyphen formats
// Both /auth/ and /api/auth/ prefixes work the same way

// OTP Management
$route['auth/send_otp'] = 'Auth/send_otp';
$route['auth/send-otp'] = 'Auth/send_otp';
$route['auth/verify_otp'] = 'Auth/verify_otp';
$route['auth/verify-otp'] = 'Auth/verify_otp';
$route['auth/resend_otp'] = 'Auth/resend_otp';
$route['auth/resend-otp'] = 'Auth/resend_otp';

// Profile Management
$route['auth/save_profile'] = 'Auth/save_profile';
$route['auth/save-profile'] = 'Auth/save_profile';
$route['auth/update_profile'] = 'Auth/update_profile';
$route['auth/update-profile'] = 'Auth/update_profile';
$route['auth/profile'] = 'Auth/profile';

// Session Management
$route['auth/check'] = 'Auth/check';
$route['auth/check_auth'] = 'Auth/check';
$route['auth/check-auth'] = 'Auth/check';
$route['auth/refresh_session'] = 'Auth/refresh_session';
$route['auth/refresh-session'] = 'Auth/refresh_session';
$route['auth/logout'] = 'Auth/logout';

// Phone Management
$route['auth/check_phone_exists'] = 'Auth/check_phone_exists';
$route['auth/check-phone-exists'] = 'Auth/check_phone_exists';
$route['auth/check-phone'] = 'Auth/check_phone_exists';
$route['auth/change_phone'] = 'Auth/change_phone';
$route['auth/change-phone'] = 'Auth/change_phone';
$route['auth/verify_phone_change'] = 'Auth/verify_phone_change';
$route['auth/verify-phone-change'] = 'Auth/verify_phone_change';

// Account Management
$route['auth/delete_account'] = 'Auth/delete_account';
$route['auth/delete-account'] = 'Auth/delete_account';

// API routes with /api/ prefix for mobile apps (same endpoints)
$route['api/auth/send_otp'] = 'Auth/send_otp';
$route['api/auth/send-otp'] = 'Auth/send_otp';
$route['api/auth/verify_otp'] = 'Auth/verify_otp';
$route['api/auth/verify-otp'] = 'Auth/verify_otp';
$route['api/auth/resend_otp'] = 'Auth/resend_otp';
$route['api/auth/resend-otp'] = 'Auth/resend_otp';
$route['api/auth/save_profile'] = 'Auth/save_profile';
$route['api/auth/save-profile'] = 'Auth/save_profile';
$route['api/auth/update_profile'] = 'Auth/update_profile';
$route['api/auth/update-profile'] = 'Auth/update_profile';
$route['api/auth/profile'] = 'Auth/profile';
$route['api/auth/check'] = 'Auth/check';
$route['api/auth/check_auth'] = 'Auth/check';
$route['api/auth/check-auth'] = 'Auth/check';
$route['api/auth/refresh_session'] = 'Auth/refresh_session';
$route['api/auth/refresh-session'] = 'Auth/refresh_session';
$route['api/auth/logout'] = 'Auth/logout';
$route['api/auth/check_phone_exists'] = 'Auth/check_phone_exists';
$route['api/auth/check-phone-exists'] = 'Auth/check_phone_exists';
$route['api/auth/check-phone'] = 'Auth/check_phone_exists';
$route['api/auth/change_phone'] = 'Auth/change_phone';
$route['api/auth/change-phone'] = 'Auth/change_phone';
$route['api/auth/verify_phone_change'] = 'Auth/verify_phone_change';
$route['api/auth/verify-phone-change'] = 'Auth/verify_phone_change';
$route['api/auth/delete_account'] = 'Auth/delete_account';
$route['api/auth/delete-account'] = 'Auth/delete_account';
$route['test-update'] = 'TestUpdate/index';

// Service Worker routes
$route['firebase-messaging-sw.js'] = 'ServiceWorker/firebase_messaging_sw';

// API routes
$route['api/enquiry_store'] = 'Api/enquiry_store';
$route['api/enquiry/store'] = 'Api/enquiry_store';
$route['api/wishlist/store'] = 'Api/wishlist_store';
$route['api/wishlist/check'] = 'Api/wishlist_check';
$route['api/track_video_play'] = 'Api/track_video_play';
$route['api/video/play'] = 'Api/track_video_play';

// Dashboard routes
$route['dashboard/wishlist'] = 'Dashboard/wishlist';
$route['dashboard/enquiries'] = 'Dashboard/enquiries';

// Admin routes (ShopKart panel — full /admin/* aliases added at end of file)
$route['admin/clear-cache'] = 'Admin/clear_cache_public';
$route['clear-cache'] = 'Admin/clear_cache_public';


$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;

// Additional routes
$route['about'] = 'About/index';
$route['properties'] = 'Home/properties';
$route['listing'] = 'Listing/index';
$route['blog'] = 'Blog/index';
$route['blog/detail/(:num)'] = 'Blog/detail/$1';
$route['blog/(:num)'] = 'Blog/detail/$1';
$route['contact'] = 'Contact/index';
$route['contact/submit'] = 'Contact/submit';
// Property routes - support both slug and ID for backward compatibility
$route['property/(:any)'] = 'Home/property_detail/$1';
$route['property-detail/(:any)'] = 'Home/property_detail/$1';
$route['privacy-policy'] = 'Home/privacy_policy';
$route['terms-conditions'] = 'Home/terms_conditions';
$route['testimonials'] = 'Home/testimonials';

// Legacy property admin routes removed — use /admin/* ShopKart panel routes (mirrored at end of file)

// API routes
$route['property/store'] = 'Property/store';
$route['contact/save'] = 'Contact/save';
$route['enquiry/save'] = 'Enquiry/save';
$route['property_search/filter'] = 'Property_search/filter';

// Mobile API routes
$route['api/mobile/home'] = 'Api_mobile/home';
$route['api/mobile/properties'] = 'Api_mobile/properties';
$route['api/mobile/properties/featured'] = 'Api_mobile/featured_properties';
$route['api/mobile/properties/latest'] = 'Api_mobile/latest_properties';
$route['api/mobile/properties/search'] = 'Api_mobile/search_properties';
$route['api/mobile/properties/(:num)'] = 'Api_mobile/property/$1';
$route['api/mobile/blogs'] = 'Api_mobile/blogs';
$route['api/mobile/blogs/(:num)'] = 'Api_mobile/blog/$1';
$route['api/mobile/categories'] = 'Api_mobile/categories';
$route['api/mobile/categories/(:num)'] = 'Api_mobile/category/$1';
$route['api/mobile/cities'] = 'Api_mobile/cities';
$route['api/mobile/cities/(:num)'] = 'Api_mobile/city/$1';
$route['api/mobile/locations'] = 'Api_mobile/locations';
$route['api/mobile/locations/(:num)'] = 'Api_mobile/location/$1';
$route['api/mobile/locations/city/(:num)'] = 'Api_mobile/locations_by_city/$1';
$route['api/mobile/banners'] = 'Api_mobile/banners';
$route['api/mobile/offer_banner'] = 'Api_mobile/offer_banner';
$route['api/mobile/offer_banners'] = 'Api_mobile/offer_banners';
$route['api/mobile/contact'] = 'Api_mobile/contact';
$route['api/mobile/enquiry'] = 'Api_mobile/enquiry';
$route['api/mobile/enquiries/customer/(:num)'] = 'Api_mobile/enquiries_by_customer/$1';
$route['api/mobile/enquiries_by_customer/(:num)'] = 'Api_mobile/enquiries_by_customer/$1';

// Mobile API Authentication Routes
$route['api/mobile/send_otp'] = 'Api_mobile/send_otp';
$route['api/mobile/send-otp'] = 'Api_mobile/send_otp';
$route['api/mobile/verify_otp'] = 'Api_mobile/verify_otp';
$route['api/mobile/verify-otp'] = 'Api_mobile/verify_otp';
$route['api/mobile/resend_otp'] = 'Api_mobile/resend_otp';
$route['api/mobile/resend-otp'] = 'Api_mobile/resend_otp';
$route['api/mobile/save_profile'] = 'Api_mobile/save_profile';
$route['api/mobile/save-profile'] = 'Api_mobile/save_profile';
$route['api/mobile/update_profile'] = 'Api_mobile/update_profile';
$route['api/mobile/update-profile'] = 'Api_mobile/update_profile';
$route['api/mobile/profile'] = 'Api_mobile/profile';
$route['api/mobile/check'] = 'Api_mobile/check';
$route['api/mobile/check_auth'] = 'Api_mobile/check';
$route['api/mobile/check-auth'] = 'Api_mobile/check';
$route['api/mobile/refresh_session'] = 'Api_mobile/refresh_session';
$route['api/mobile/refresh-session'] = 'Api_mobile/refresh_session';
$route['api/mobile/logout'] = 'Api_mobile/logout';
$route['api/mobile/check_phone_exists'] = 'Api_mobile/check_phone_exists';
$route['api/mobile/check-phone-exists'] = 'Api_mobile/check_phone_exists';
$route['api/mobile/check-phone'] = 'Api_mobile/check_phone_exists';
$route['api/mobile/change_phone'] = 'Api_mobile/change_phone';
$route['api/mobile/change-phone'] = 'Api_mobile/change_phone';
$route['api/mobile/verify_phone_change'] = 'Api_mobile/verify_phone_change';
$route['api/mobile/verify-phone-change'] = 'Api_mobile/verify_phone_change';
$route['api/mobile/delete_account'] = 'Api_mobile/delete_account';
$route['api/mobile/delete-account'] = 'Api_mobile/delete_account';

// Frontend static flow routes
$route['about-us'] = 'About/index';
$route['projects'] = 'Projects/index';
$route['projects/ongoing'] = 'Projects/ongoing';
$route['projects/upcoming'] = 'Projects/upcoming';
$route['projects/upcomming'] = 'Projects/upcoming';
$route['projects/completed'] = 'Projects/completed';
$route['contactus'] = 'Contact/index';

// ============================================================
// ShopKart Admin Routes
// ============================================================
$route['shopkart'] = 'admin/Login/index';
$route['shopkart/login'] = 'admin/Login/index';
$route['shopkart/login/submit'] = 'admin/Login/submit';
$route['shopkart/logout'] = 'admin/Login/logout';
$route['shopkart/vendor/login'] = 'admin/Vendor_login/index';
$route['shopkart/vendor/login/submit'] = 'admin/Vendor_login/submit';
$route['shopkart/vendor/logout'] = 'admin/Vendor_login/logout';

// Affiliate portal (separate login)
$route['shopkart/affiliate/login'] = 'admin/Affiliate_login/index';
$route['shopkart/affiliate/login/submit'] = 'admin/Affiliate_login/submit';
$route['shopkart/affiliate/register'] = 'admin/Affiliate_login/register';
$route['shopkart/affiliate/register/submit'] = 'admin/Affiliate_login/register_submit';
$route['shopkart/affiliate/logout'] = 'admin/Affiliate_login/logout';
$route['shopkart/affiliate/forgot-password'] = 'admin/Affiliate_login/forgot_password';
$route['shopkart/affiliate/forgot-password/submit'] = 'admin/Affiliate_login/forgot_submit';
$route['shopkart/affiliate/reset-password'] = 'admin/Affiliate_login/reset_password';
$route['shopkart/affiliate/reset-password/submit'] = 'admin/Affiliate_login/reset_submit';
$route['shopkart/affiliate/dashboard'] = 'admin/Affiliate_portal/dashboard';
$route['shopkart/affiliate/commissions'] = 'admin/Affiliate_portal/commissions';
$route['shopkart/affiliate/payouts'] = 'admin/Affiliate_portal/payouts';
$route['shopkart/affiliate/kyc'] = 'admin/Affiliate_portal/kyc';
$route['shopkart/affiliate/products'] = 'admin/Affiliate_portal/products';
$route['shopkart/affiliate/profile'] = 'admin/Affiliate_portal/profile';

// Admin — Affiliates & wallets
$route['shopkart/affiliates'] = 'admin/Affiliates/index';
$route['shopkart/affiliates/add'] = 'admin/Affiliates/add';
$route['shopkart/affiliates/store'] = 'admin/Affiliates/store';
$route['shopkart/affiliates/view/(:num)'] = 'admin/Affiliates/view/$1';
$route['shopkart/affiliates/edit/(:num)'] = 'admin/Affiliates/edit/$1';
$route['shopkart/affiliates/update/(:num)'] = 'admin/Affiliates/update/$1';
$route['shopkart/affiliates/approve/(:num)'] = 'admin/Affiliates/approve/$1';
$route['shopkart/affiliates/reject/(:num)'] = 'admin/Affiliates/reject/$1';
$route['shopkart/affiliates/verify_kyc/(:num)'] = 'admin/Affiliates/verify_kyc/$1';
$route['shopkart/affiliates/check_promo'] = 'admin/Affiliates/check_promo';
$route['shopkart/affiliates/settings'] = 'admin/Affiliates/settings';
$route['shopkart/affiliates/toggle_discount/(:num)'] = 'admin/Affiliates/toggle_discount/$1';
$route['shopkart/affiliates/delete/(:num)'] = 'admin/Affiliates/delete/$1';
$route['shopkart/affiliates/export'] = 'admin/Affiliates/export';

$route['shopkart/affiliate-payouts'] = 'admin/Affiliate_payouts/index';
$route['shopkart/affiliate-payouts/approve/(:num)'] = 'admin/Affiliate_payouts/approve/$1';
$route['shopkart/affiliate-payouts/pay/(:num)'] = 'admin/Affiliate_payouts/pay/$1';
$route['shopkart/affiliate-payouts/reject/(:num)'] = 'admin/Affiliate_payouts/reject/$1';
$route['shopkart/affiliate-payouts/settlement'] = 'admin/Affiliate_payouts/settlement';
$route['shopkart/affiliate-payouts/export'] = 'admin/Affiliate_payouts/export';

$route['shopkart/customer-wallets'] = 'admin/Customer_wallets/index';
$route['shopkart/customer-wallets/view/(:num)'] = 'admin/Customer_wallets/view/$1';
$route['shopkart/customer-wallets/add_funds/(:num)'] = 'admin/Customer_wallets/add_funds/$1';
$route['shopkart/customer-wallets/settings'] = 'admin/Customer_wallets/settings';

$route['shopkart/affiliate-reports'] = 'admin/Affiliate_reports/index';
$route['shopkart/affiliate-reports/export'] = 'admin/Affiliate_reports/export';

$route['shopkart/affiliate-requests'] = 'admin/Affiliate_requests/index';
$route['shopkart/affiliate-requests/approve/(:num)'] = 'admin/Affiliate_requests/approve/$1';
$route['shopkart/affiliate-requests/reject/(:num)'] = 'admin/Affiliate_requests/reject/$1';

$route['shopkart/dashboard'] = 'admin/Dashboard/index';
// Vendors (multi-vendor)
$route['shopkart/vendors'] = 'admin/Vendors/index';
$route['shopkart/vendors/add'] = 'admin/Vendors/add';
$route['shopkart/vendors/store'] = 'admin/Vendors/store';
$route['shopkart/vendors/edit/(:num)'] = 'admin/Vendors/edit/$1';
$route['shopkart/vendors/update/(:num)'] = 'admin/Vendors/update/$1';
$route['shopkart/vendors/view/(:num)'] = 'admin/Vendors/view/$1';
$route['shopkart/vendors/delete/(:num)'] = 'admin/Vendors/delete/$1';
$route['shopkart/vendors/approve/(:num)'] = 'admin/Vendors/approve/$1';
$route['shopkart/vendors/reject/(:num)'] = 'admin/Vendors/reject/$1';
$route['shopkart/vendors/suspend/(:num)'] = 'admin/Vendors/suspend/$1';
$route['shopkart/vendors/activate/(:num)'] = 'admin/Vendors/activate/$1';
$route['shopkart/vendors/login_as/(:num)'] = 'admin/Vendors/login_as/$1';
$route['shopkart/vendors/stop_impersonate'] = 'admin/Vendors/stop_impersonate';
$route['shopkart/vendors/export'] = 'admin/Vendors/export';
$route['shopkart/vendors/reset_password/(:num)'] = 'admin/Vendors/reset_password/$1';
// Stores
$route['shopkart/stores/edit/(:num)'] = 'admin/Stores/edit/$1';
$route['shopkart/stores/edit'] = 'admin/Stores/edit';
$route['shopkart/stores/update/(:num)'] = 'admin/Stores/update/$1';
// Wallet
$route['shopkart/wallet'] = 'admin/Wallet/index';
$route['shopkart/wallet/vendor/(:num)'] = 'admin/Wallet/vendor/$1';
$route['shopkart/wallet/add_funds/(:num)'] = 'admin/Wallet/add_funds/$1';
// Roles
$route['shopkart/roles'] = 'admin/Roles/index';
$route['shopkart/roles/permissions/(:num)'] = 'admin/Roles/permissions/$1';
$route['shopkart/roles/assign_admin'] = 'admin/Roles/assign_admin';
// Products
$route['shopkart/products'] = 'admin/Products/index';
$route['shopkart/products/add'] = 'admin/Products/add';
$route['shopkart/products/store'] = 'admin/Products/store';
$route['shopkart/products/edit/(:num)'] = 'admin/Products/edit/$1';
$route['shopkart/products/update/(:num)'] = 'admin/Products/update/$1';
$route['shopkart/products/delete/(:num)'] = 'admin/Products/delete/$1';
$route['shopkart/products/toggle/(:num)'] = 'admin/Products/toggle/$1';
$route['shopkart/products/delete_image/(:num)/(:num)'] = 'admin/Products/delete_image/$1/$2';
$route['shopkart/products/subcategories/(:num)'] = 'admin/Products/subcategories_by_category/$1';
// Brands
$route['shopkart/brands'] = 'admin/Brands/index';
$route['shopkart/brands/store'] = 'admin/Brands/store';
$route['shopkart/brands/edit/(:num)'] = 'admin/Brands/edit/$1';
$route['shopkart/brands/update/(:num)'] = 'admin/Brands/update/$1';
$route['shopkart/brands/delete/(:num)'] = 'admin/Brands/delete/$1';
// Categories
$route['shopkart/categories'] = 'admin/Categories/index';
$route['shopkart/categories/store'] = 'admin/Categories/store';
$route['shopkart/categories/edit/(:num)'] = 'admin/Categories/edit/$1';
$route['shopkart/categories/update/(:num)'] = 'admin/Categories/update/$1';
$route['shopkart/categories/delete/(:num)'] = 'admin/Categories/delete/$1';
// Mega menu titles
$route['shopkart/categories/title_store'] = 'admin/Categories/title_store';
$route['shopkart/categories/title_update/(:num)'] = 'admin/Categories/title_update/$1';
$route['shopkart/categories/title_delete/(:num)'] = 'admin/Categories/title_delete/$1';
// Subcategories
$route['shopkart/subcategories/store'] = 'admin/Categories/sub_store';
$route['shopkart/subcategories/edit/(:num)'] = 'admin/Categories/sub_edit/$1';
$route['shopkart/subcategories/update/(:num)'] = 'admin/Categories/sub_update/$1';
$route['shopkart/subcategories/delete/(:num)'] = 'admin/Categories/sub_delete/$1';
// Banners
$route['shopkart/banners'] = 'admin/Banners/index';
$route['shopkart/banners/store'] = 'admin/Banners/store';
$route['shopkart/banners/edit/(:num)'] = 'admin/Banners/edit/$1';
$route['shopkart/banners/update/(:num)'] = 'admin/Banners/update/$1';
$route['shopkart/banners/toggle/(:num)'] = 'admin/Banners/toggle/$1';
$route['shopkart/banners/delete/(:num)'] = 'admin/Banners/delete/$1';
// Orders
$route['shopkart/orders'] = 'admin/Orders/index';
$route['shopkart/orders/view/(:num)'] = 'admin/Orders/view/$1';
$route['shopkart/orders/update_status/(:num)'] = 'admin/Orders/update_status/$1';
$route['shopkart/orders/invoice/(:num)'] = 'admin/Orders/invoice/$1';
$route['shopkart/orders/send_invoice/(:num)'] = 'admin/Orders/send_invoice/$1';
// Customers
$route['shopkart/customers'] = 'admin/Customers/index';
$route['shopkart/customers/view/(:num)'] = 'admin/Customers/view/$1';
$route['shopkart/customers/toggle/(:num)'] = 'admin/Customers/toggle/$1';
// Promo
$route['shopkart/promo'] = 'admin/Promo/index';
$route['shopkart/promo/store'] = 'admin/Promo/store';
$route['shopkart/promo/edit/(:num)'] = 'admin/Promo/edit/$1';
$route['shopkart/promo/update/(:num)'] = 'admin/Promo/update/$1';
$route['shopkart/promo/delete/(:num)'] = 'admin/Promo/delete/$1';
// Reports
$route['shopkart/reports'] = 'admin/Reports/index';
$route['shopkart/reports/export'] = 'admin/Reports/export';
$route['shopkart/coupon-report'] = 'admin/CouponReport/index';
// Settings
$route['shopkart/settings'] = 'admin/Settings/index';
$route['shopkart/settings/update'] = 'admin/Settings/update';
// Reviews (admin)
$route['shopkart/wishlists'] = 'admin/Wishlists/index';
$route['shopkart/wishlists/delete/(:num)'] = 'admin/Wishlists/delete/$1';
$route['shopkart/wishlists/delete_user/(:num)'] = 'admin/Wishlists/delete_user/$1';

$route['shopkart/reviews'] = 'admin/Reviews/index';
$route['shopkart/reviews/approve/(:num)'] = 'admin/Reviews/approve/$1';
$route['shopkart/reviews/reject/(:num)']  = 'admin/Reviews/reject/$1';
$route['shopkart/reviews/delete/(:num)']  = 'admin/Reviews/delete/$1';
// Contacts (admin)
$route['shopkart/contacts'] = 'admin/Contacts/index';
$route['shopkart/contacts/mark_read/(:num)'] = 'admin/Contacts/mark_read/$1';
$route['shopkart/contacts/delete/(:num)'] = 'admin/Contacts/delete/$1';
// Blogs (admin)
$route['shopkart/blogs'] = 'admin/Blogs/index';
$route['shopkart/blogs/store'] = 'admin/Blogs/store';
$route['shopkart/blogs/edit/(:num)'] = 'admin/Blogs/edit/$1';
$route['shopkart/blogs/update/(:num)'] = 'admin/Blogs/update/$1';
$route['shopkart/blogs/toggle/(:num)'] = 'admin/Blogs/toggle/$1';
$route['shopkart/blogs/delete/(:num)'] = 'admin/Blogs/delete/$1';
// SEO Manager
$route['shopkart/seo'] = 'admin/Seo/index';
$route['shopkart/seo/edit_page/(:num)'] = 'admin/Seo/edit_page/$1';
$route['shopkart/seo/update_page/(:num)'] = 'admin/Seo/update_page/$1';
$route['shopkart/seo/update_global'] = 'admin/Seo/update_global';
// Testimonials (admin)
$route['shopkart/testimonials'] = 'admin/Testimonials/index';
$route['shopkart/testimonials/store'] = 'admin/Testimonials/store';
$route['shopkart/testimonials/edit/(:num)'] = 'admin/Testimonials/edit/$1';
$route['shopkart/testimonials/update/(:num)'] = 'admin/Testimonials/update/$1';
$route['shopkart/testimonials/toggle/(:num)'] = 'admin/Testimonials/toggle/$1';
$route['shopkart/testimonials/delete/(:num)'] = 'admin/Testimonials/delete/$1';

// ============================================================
// ShopKart REST API Routes
// ============================================================
// Auth
$route['shopkart-api/register']['POST']    = 'api/Sk_Auth/register';
$route['shopkart-api/login']['POST']       = 'api/Sk_Auth/login';
$route['shopkart-api/otp-request']['POST'] = 'api/Sk_Auth/otp_request';
$route['shopkart-api/otp-verify']['POST']  = 'api/Sk_Auth/otp_verify';
$route['shopkart-api/forgot-password']['POST'] = 'api/Sk_Auth/forgot_password';
$route['shopkart-api/forgot-password/verify']['POST'] = 'api/Sk_Auth/verify_reset_code';
$route['shopkart-api/reset-password']['POST'] = 'api/Sk_Auth/reset_password';
// Products
$route['shopkart-api/products']['GET'] = 'api/Sk_Product/index';
$route['shopkart-api/product/(:any)']['GET'] = 'api/Sk_Product/show/$1';
$route['shopkart-api/categories']['GET'] = 'api/Sk_Category/index';
$route['shopkart-api/nav-menu']['GET']   = 'api/Sk_NavMenu/index';
$route['shopkart-api/banners']['GET']             = 'api/Sk_Banner/index';
$route['shopkart-api/offer-banner']['GET']        = 'api/Sk_Banner/offer';
$route['shopkart-api/collection-banners']['GET']  = 'api/Sk_Banner/collection';
$route['shopkart-api/search']['GET'] = 'api/Sk_Product/search';
// Cart
$route['shopkart-api/cart']['GET'] = 'api/Sk_Cart/index';
$route['shopkart-api/cart/add']['POST'] = 'api/Sk_Cart/add';
$route['shopkart-api/cart/update']['POST'] = 'api/Sk_Cart/update';
$route['shopkart-api/cart/remove']['POST'] = 'api/Sk_Cart/remove';
$route['shopkart-api/cart/clear']['POST'] = 'api/Sk_Cart/clear';
// Wishlist
$route['shopkart-api/wishlist']['GET'] = 'api/Sk_User/wishlist';
$route['shopkart-api/wishlist/toggle']['POST'] = 'api/Sk_User/wishlist_toggle';
// Orders
$route['shopkart-api/checkout']['POST'] = 'api/Sk_Order/checkout';
$route['shopkart-api/orders']['GET'] = 'api/Sk_Order/index';
$route['shopkart-api/order/(:num)']['GET']          = 'api/Sk_Order/show/$1';
$route['shopkart-api/order/(:num)/cancel']['POST']   = 'api/Sk_Order/cancel/$1';
// Promo
$route['shopkart-api/apply-coupon']['POST'] = 'api/Sk_Promo/apply';
// Payment
$route['shopkart-api/payment/create-order']['POST'] = 'api/Sk_Payment/create_order';
$route['shopkart-api/payment/verify']['POST'] = 'api/Sk_Payment/verify';
// User profile
$route['shopkart-api/user/profile']['GET'] = 'api/Sk_User/profile';
$route['shopkart-api/user/profile']['PUT'] = 'api/Sk_User/update_profile';
$route['shopkart-api/user/dashboard']['GET']              = 'api/Sk_User/dashboard';
$route['shopkart-api/user/change-password']['POST']       = 'api/Sk_User/change_password';
$route['shopkart-api/user/addresses']['GET']              = 'api/Sk_User/addresses';
$route['shopkart-api/user/addresses']['POST']             = 'api/Sk_User/save_address';
$route['shopkart-api/user/addresses/(:num)']['DELETE']    = 'api/Sk_User/delete_address/$1';
$route['shopkart-api/user/wallet']['GET']                   = 'api/Sk_User/wallet';
// Newsletter
$route['shopkart-api/newsletter']['POST'] = 'api/Sk_User/newsletter';
// Testimonials (public)
$route['shopkart-api/testimonials']['GET'] = 'api/Sk_Testimonial/index';
// Reviews (public)
$route['shopkart-api/product/(:num)/reviews']['GET'] = 'api/Sk_Review/get_by_product/$1';
$route['shopkart-api/reviews']['POST']                = 'api/Sk_Review/store';
// Public site settings
$route['shopkart-api/site-settings']['GET'] = 'api/Sk_Settings/index';
$route['shopkart-api/seo/page/(:any)']['GET'] = 'api/Sk_Seo/page/$1';
$route['shopkart-api/seo']['GET'] = 'api/Sk_Seo/page';
$route['shopkart-api/seo/global']['GET'] = 'api/Sk_Seo/global_config';
// Contact form
$route['shopkart-api/contact']['POST'] = 'api/Sk_Contact/store';
// Blogs (public)
$route['shopkart-api/blogs']['GET']          = 'api/Sk_Blog/index';
$route['shopkart-api/blog/(:any)']['GET']    = 'api/Sk_Blog/show/$1';

// Affiliate app API
$route['shopkart-api/affiliate/login']['POST'] = 'api/Sk_Affiliate_auth/login';
$route['shopkart-api/affiliate/register']['POST'] = 'api/Sk_Affiliate_auth/register';
$route['shopkart-api/affiliate/profile']['GET'] = 'api/Sk_Affiliate_auth/profile';
$route['shopkart-api/affiliate/dashboard']['GET'] = 'api/Sk_Affiliate_auth/dashboard';
$route['shopkart-api/affiliate/commissions']['GET'] = 'api/Sk_Affiliate_auth/commissions';
$route['shopkart-api/affiliate/payouts']['GET'] = 'api/Sk_Affiliate_auth/payouts';
$route['shopkart-api/affiliate/payouts/request']['POST'] = 'api/Sk_Affiliate_auth/request_payout';
$route['shopkart-api/affiliate/check-promo']['GET'] = 'api/Sk_Affiliate_auth/check_promo';
$route['shopkart-api/affiliate/track']['POST'] = 'api/Sk_Affiliate_auth/track_click';
$route['shopkart-api/affiliate/forgot-password']['POST'] = 'api/Sk_Affiliate_auth/forgot_password';
$route['shopkart-api/affiliate/forgot-password/verify']['POST'] = 'api/Sk_Affiliate_auth/verify_reset_code';
$route['shopkart-api/affiliate/reset-password']['POST'] = 'api/Sk_Affiliate_auth/reset_password';
$route['shopkart-api/affiliate/profile']['PUT'] = 'api/Sk_Affiliate_auth/update_profile';
$route['shopkart-api/affiliate/change-password/request']['POST'] = 'api/Sk_Affiliate_auth/request_password_code';
$route['shopkart-api/affiliate/change-password']['POST'] = 'api/Sk_Affiliate_auth/change_password';

// v1 eCommerce API routes
$route['api/v1/auth/register']['post'] = 'api/v1/Auth/register';
$route['api/v1/auth/login']['post'] = 'api/v1/Auth/login';
$route['api/v1/auth/forgot-password']['post'] = 'api/v1/Auth/forgot_password';
$route['api/v1/products']['get'] = 'api/v1/Product/index';
$route['api/v1/products']['post'] = 'api/v1/Product/create';
$route['api/v1/search']['get'] = 'api/v1/Product/index';
$route['api/v1/user/profile']['get'] = 'api/v1/User/profile';
$route['api/v1/user/addresses']['get'] = 'api/v1/User/addresses';
$route['api/v1/user/addresses']['post'] = 'api/v1/User/addresses';
$route['api/v1/user/wishlist']['get'] = 'api/v1/User/wishlist';
$route['api/v1/user/wishlist']['post'] = 'api/v1/User/wishlist';
$route['api/v1/cart/items']['get'] = 'api/v1/Cart/items';
$route['api/v1/cart/items']['post'] = 'api/v1/Cart/items';
$route['api/v1/cart/merge-guest']['post'] = 'api/v1/Cart/merge_guest';
$route['api/v1/orders']['post'] = 'api/v1/Order/place';
$route['api/v1/orders/(:num)']['get'] = 'api/v1/Order/summary/$1';
$route['api/v1/orders/(:num)/status']['patch'] = 'api/v1/Order/update_status/$1';
$route['api/v1/payments/razorpay/order/(:num)']['post'] = 'api/v1/Payment/razorpay_order/$1';
$route['api/v1/payments/cod/(:num)']['post'] = 'api/v1/Payment/cod/$1';
$route['api/v1/payments/razorpay/webhook']['post'] = 'api/v1/Payment/webhook_razorpay';
$route['api/v1/shipping/quote']['get'] = 'api/v1/Ops/shipping_quote';
$route['api/v1/reviews']['get'] = 'api/v1/Ops/review';
$route['api/v1/reviews']['post'] = 'api/v1/Ops/review';
$route['api/v1/coupons/apply']['post'] = 'api/v1/Ops/coupon_apply';
$route['api/v1/notifications/order-email']['post'] = 'api/v1/Ops/notify_order_email';
$route['api/v1/admin/dashboard']['get'] = 'api/v1/Ops/admin_dashboard';
$route['api/v1/admin/users']['get'] = 'api/v1/Ops/admin_dashboard';
$route['api/v1/admin/products']['get'] = 'api/v1/Product/index';
$route['api/v1/admin/orders']['get'] = 'api/v1/Ops/admin_dashboard';
$route['api/v1/admin/banners']['get'] = 'api/v1/Ops/admin_dashboard';
$route['api/v1/admin/offers']['get'] = 'api/v1/Ops/admin_dashboard';
$route['api/v1/admin/coupons']['get'] = 'api/v1/Ops/admin_dashboard';
$route['api/v1/analytics/reports']['get'] = 'api/v1/Ops/analytics_reports';

// Mirror shopkart admin routes under /admin (clean admin URLs)
$admin_route_aliases = [];
foreach ($route as $pattern => $target) {
    if (strpos($pattern, 'shopkart') === 0) {
        $admin_pattern = 'admin' . substr($pattern, 8);
        if (!isset($route[$admin_pattern])) {
            $admin_route_aliases[$admin_pattern] = $target;
        }
    }
}
$route = array_merge($route, $admin_route_aliases);
