# 2DEAL Push Notifications — Flutter Guide

Firebase Cloud Messaging (FCM) for the mobile app. Admin can send **text only**, **image only**, **video only**, or **image + video**.

**Base URL**

```text
https://superfinelabels.in/deal/shopkart-api
```

**Firebase project:** `deal-bc4c4`

---

## 1. Media rules

| `media_type` | System tray | App data payload |
|--------------|-------------|------------------|
| `none` | Title + body | Same |
| `image` | Title + body + image | `image_url` |
| `video` | Title + body (no video in tray) | `video_url` — app must play/open |
| `both` | Title + body + image | `image_url` + `video_url` |

FCM does **not** attach video to the OS notification. Always read `data.video_url` when `media_type` is `video` or `both`.

All `data` values from FCM are **strings**.

---

## 2. Firebase options (Flutter)

```dart
FirebaseOptions(
  apiKey: 'AIzaSyDVLXhBh4qBJbNOezmNmqfr4cPR2R27Cvo',
  appId: '1:189494181575:web:dce824b331eae998e848e2', // use Android/iOS appId from Console for native apps
  messagingSenderId: '189494181575',
  projectId: 'deal-bc4c4',
  storageBucket: 'deal-bc4c4.firebasestorage.app',
);
```

Add **Android** and **iOS** apps in Firebase Console and use those `appId` / `google-services.json` / `GoogleService-Info.plist`. The web `appId` above is for web clients only.

Packages (typical):

```yaml
dependencies:
  firebase_core: ^3.0.0
  firebase_messaging: ^15.0.0
  flutter_local_notifications: ^17.0.0  # optional foreground display
```

---

## 3. Register device token (required)

After login and `FirebaseMessaging.instance.getToken()`:

```http
POST /shopkart-api/user/device-token
Authorization: Bearer <jwt>
Content-Type: application/json
```

**Input**

```json
{
  "token": "fcm_device_token_here",
  "platform": "android"
}
```

`platform`: `android` | `ios` | `web`

**Output**

```json
{
  "success": true,
  "message": "Device token registered.",
  "data": {
    "token": "fcm_device_token_here",
    "platform": "android"
  }
}
```

Re-register when the token refreshes (`onTokenRefresh`).

---

## 4. Unregister on logout

```http
POST /shopkart-api/user/device-token/remove
Authorization: Bearer <jwt>
Content-Type: application/json
```

```json
{ "token": "fcm_device_token_here" }
```

(`DELETE /user/device-token` with the same JSON body also works.)

---

## 5. Handle incoming message

Example `data` map from FCM:

```json
{
  "notification_id": "12",
  "media_type": "both",
  "title": "Flash sale",
  "body": "Tonight only",
  "image_url": "https://superfinelabels.in/deal/assets/uploads/notifications/….jpg",
  "video_url": "https://superfinelabels.in/deal/assets/uploads/notifications/….mp4",
  "click_url": "https://superfinelabels.in/deal/shop-default"
}
```

**Flutter sketch**

```dart
void handleMessage(RemoteMessage message) {
  final data = message.data;
  final mediaType = data['media_type'] ?? 'none';
  final imageUrl = data['image_url'];
  final videoUrl = data['video_url'];
  final clickUrl = data['click_url'];

  // Show title/body from message.notification or data

  if (mediaType == 'image' || mediaType == 'both') {
    if (imageUrl != null && imageUrl.isNotEmpty) {
      // Show image in inbox / detail screen
    }
  }
  if (mediaType == 'video' || mediaType == 'both') {
    if (videoUrl != null && videoUrl.isNotEmpty) {
      // Open player / WebView / url_launcher
    }
  }
  if (clickUrl != null && clickUrl.isNotEmpty) {
    // Navigate deep link
  }
}
```

Wire:

- `FirebaseMessaging.onMessage` (foreground)
- `FirebaseMessaging.onMessageOpenedApp` (tap)
- `getInitialMessage()` (cold start from tap)

---

## 6. In-app inbox (optional)

```http
GET /shopkart-api/notifications?limit=20
Authorization: Bearer <jwt>
```

**Output**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "notifications": [
      {
        "id": 12,
        "title": "Flash sale",
        "body": "Tonight only",
        "media_type": "image",
        "image_url": "https://…/banner.jpg",
        "video_url": null,
        "click_url": null,
        "sent_at": "2026-08-04 12:00:00"
      }
    ],
    "total": 1
  }
}
```

---

## 7. Admin test flow

1. App logs in → registers FCM token.
2. Admin → **Notifications** → Compose.
3. Pick media mode (text / image / video / both).
4. Paste the device token into **Send test** (or use user id).
5. Confirm delivery on the phone + check Delivery logs.

Sending requires Firebase **Admin service account** in `application/config/firebase.php` (not only the web apiKey). See `firebase.php.example`.

---

## 8. Checklist

1. Native Firebase Android/iOS apps added for `deal-bc4c4`.
2. JWT sent on token register.
3. Token re-registered on refresh.
4. Handle `media_type` for image vs video vs both.
5. Do not expect OS tray to play video — use `data.video_url`.
