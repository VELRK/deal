<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/api/Sk_Base_Api.php';

/**
 * In-app notification history for mobile apps.
 */
class Sk_Notification extends Sk_Base_Api {

    /**
     * GET /shopkart-api/notifications
     * Recent sent campaigns (title/body/media) for in-app inbox.
     */
    public function index() {
        $this->auth_required();
        $this->load->model('Sk_Notification_model');
        $this->load->helper('sk_fcm');
        $limit = min(50, max(1, (int)($this->input->get('limit') ?: 20)));
        $rows = $this->Sk_Notification_model->recent_sent($limit);
        $out = [];
        foreach ($rows as $r) {
            $media = sk_fcm_normalize_media(
                (string)($r['media_type'] ?? 'none'),
                $r['image_url'] ?? null,
                $r['video_url'] ?? null
            );
            $out[] = [
                'id'         => (int)$r['id'],
                'title'      => $r['title'],
                'body'       => $r['body'],
                'media_type' => $media['media_type'],
                'image_url'  => sk_fcm_absolute_url($media['image_url']),
                'video_url'  => sk_fcm_absolute_url($media['video_url']),
                'click_url'  => sk_fcm_absolute_url($r['click_url'] ?? null),
                'sent_at'    => $r['sent_at'] ?? $r['created_at'] ?? null,
            ];
        }
        $this->success(['notifications' => $out, 'total' => count($out)]);
    }
}
