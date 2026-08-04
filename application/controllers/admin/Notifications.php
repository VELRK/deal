<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Notifications extends Sk_Base {

    public function __construct() {
        parent::__construct();
        $this->load->model('Sk_Notification_model');
        $this->load->helper('sk_fcm');
        $this->Sk_Notification_model->ensure_schema();
    }

    public function index() {
        $status = trim((string)$this->input->get('status', true));
        $page   = max(1, (int)$this->input->get('page'));
        $limit  = 25;
        $offset = ($page - 1) * $limit;

        $list = $this->Sk_Notification_model->list_notifications(
            $limit,
            $offset,
            $status !== '' ? $status : null
        );

        $data['title']           = 'Push Notifications';
        $data['rows']            = $list['rows'];
        $data['total']           = $list['total'];
        $data['page']            = $page;
        $data['limit']           = $limit;
        $data['status']          = $status;
        $data['token_count']     = $this->Sk_Notification_model->token_count();
        $data['fcm_configured']  = sk_fcm_is_configured();
        $data['firebase_web']    = sk_fcm_web_config();
        $this->render('notifications/index', $data);
    }

    public function create() {
        $data['title']          = 'Compose Notification';
        $data['row']            = null;
        $data['fcm_configured'] = sk_fcm_is_configured();
        $data['token_count']    = $this->Sk_Notification_model->token_count();
        $this->render('notifications/form', $data);
    }

    public function view($id) {
        $row = $this->Sk_Notification_model->get((int)$id);
        if (!$row) {
            $this->session->set_flashdata('error', 'Notification not found.');
            redirect('shopkart/notifications');
            return;
        }
        $data['title'] = 'Notification #' . $row['id'];
        $data['row']   = $row;
        $data['logs']  = $this->Sk_Notification_model->logs_for((int)$id, 100);
        $data['fcm_configured'] = sk_fcm_is_configured();
        $this->render('notifications/view', $data);
    }

    public function store() {
        $payload = $this->_collect_form();
        if (!empty($payload['error'])) {
            $this->session->set_flashdata('error', $payload['error']);
            redirect('shopkart/notifications/create');
            return;
        }

        $action = $this->input->post('action'); // draft | send_test | send_all
        $id = $this->Sk_Notification_model->create($payload['data']);
        $row = $this->Sk_Notification_model->get($id);

        if ($action === 'draft' || !$row) {
            $this->session->set_flashdata('success', 'Draft saved.');
            redirect('shopkart/notifications/view/' . $id);
            return;
        }

        $this->_dispatch($row, $action);
    }

    public function send($id) {
        $row = $this->Sk_Notification_model->get((int)$id);
        if (!$row) {
            $this->session->set_flashdata('error', 'Notification not found.');
            redirect('shopkart/notifications');
            return;
        }
        $action = $this->input->post('action') ?: 'send_all';
        // Allow override audience for test from view form
        if ($this->input->post('audience')) {
            $row['audience'] = $this->input->post('audience');
            $row['audience_value'] = $this->input->post('audience_value');
            $this->Sk_Notification_model->update_row((int)$id, [
                'audience'       => $row['audience'],
                'audience_value' => $row['audience_value'],
            ]);
        }
        $this->_dispatch($row, $action);
    }

    private function _dispatch(array $row, string $action): void {
        if (!sk_fcm_is_configured()) {
            $this->session->set_flashdata(
                'error',
                'Firebase Admin service account is not configured. Add deal-bc4c4 credentials to application/config/firebase.php (see firebase.php.example). Draft was kept.'
            );
            redirect('shopkart/notifications/view/' . $row['id']);
            return;
        }

        if ($action === 'send_test') {
            $row['audience'] = 'token';
            $tok = trim((string)$this->input->post('test_token'));
            if ($tok === '') {
                $tok = trim((string)($row['audience_value'] ?? ''));
            }
            if ($tok === '' && $row['audience'] === 'token') {
                $tok = trim((string)($row['audience_value'] ?? ''));
            }
            // Also allow test by user id
            $testUser = (int)$this->input->post('test_user_id');
            if ($tok === '' && $testUser > 0) {
                $row['audience'] = 'user';
                $row['audience_value'] = (string)$testUser;
            } else {
                $row['audience'] = 'token';
                $row['audience_value'] = $tok;
            }
            if ($row['audience'] === 'token' && trim((string)$row['audience_value']) === '') {
                $this->session->set_flashdata('error', 'Enter a device token (or user id) for test send.');
                redirect('shopkart/notifications/view/' . $row['id']);
                return;
            }
        } elseif ($action === 'send_all') {
            $row['audience'] = 'all';
            $row['audience_value'] = null;
        }

        $targets = $this->Sk_Notification_model->tokens_for_audience(
            $row['audience'],
            $row['audience_value'] ?? null
        );
        if (empty($targets)) {
            $this->Sk_Notification_model->update_row((int)$row['id'], [
                'status'      => 'failed',
                'result_json' => json_encode(['error' => 'No device tokens matched audience.']),
            ]);
            $this->session->set_flashdata('error', 'No device tokens matched. Ask the app to register FCM tokens first.');
            redirect('shopkart/notifications/view/' . $row['id']);
            return;
        }

        $result = sk_fcm_send_many($row, $targets);
        $status = (!empty($result['error']) || ($result['ok'] ?? 0) < 1) ? 'failed' : 'sent';
        if (($result['ok'] ?? 0) > 0 && ($result['fail'] ?? 0) > 0) {
            $status = 'sent'; // partial success still mark sent
        }

        $this->Sk_Notification_model->update_row((int)$row['id'], [
            'audience'       => $row['audience'],
            'audience_value' => $row['audience_value'],
            'status'         => $status,
            'sent_at'        => date('Y-m-d H:i:s'),
            'result_json'    => json_encode([
                'ok'    => $result['ok'] ?? 0,
                'fail'  => $result['fail'] ?? 0,
                'error' => $result['error'] ?? null,
            ], JSON_UNESCAPED_UNICODE),
        ]);

        if (!empty($result['error'])) {
            $this->session->set_flashdata('error', $result['error']);
        } else {
            $okCount = (int)($result['ok'] ?? 0);
            $failCount = (int)($result['fail'] ?? 0);
            $hint = '';
            if ($failCount > 0 && !empty($result['logs'])) {
                foreach ($result['logs'] as $log) {
                    $blob = (string)($log['response'] ?? '');
                    if (stripos($blob, 'SenderId mismatch') !== false) {
                        $hint = 'SenderId mismatch: device token is from another Firebase project '
                            . '(often the Flutter **dev** flavor → deal-dev-a090d). '
                            . 'Rebuild with **prod** flavor, get a fresh FCM token from deal-bc4c4 '
                            . '(package com.twodeal.consumer), then retry.';
                        break;
                    }
                }
            }
            if ($okCount < 1 && $hint !== '') {
                $this->session->set_flashdata('error', $hint);
            } else {
                $msg = 'Sent: ' . $okCount . ' ok, ' . $failCount . ' failed.';
                if ($hint !== '') {
                    $msg .= ' ' . $hint;
                }
                $this->session->set_flashdata($failCount > 0 && $okCount < 1 ? 'error' : 'success', $msg);
            }
        }
        redirect('shopkart/notifications/view/' . $row['id']);
    }

    /**
     * @return array{error?:string,data?:array}
     */
    private function _collect_form(): array {
        $title = trim((string)$this->input->post('title', true));
        $body  = trim((string)$this->input->post('body', true));
        if ($title === '' || $body === '') {
            return ['error' => 'Title and body are required.'];
        }

        $mediaType = (string)$this->input->post('media_type');
        $imageUrl  = trim((string)$this->input->post('image_url', true));
        $videoUrl  = trim((string)$this->input->post('video_url', true));
        $clickUrl  = trim((string)$this->input->post('click_url', true));

        $uploadedImage = $this->_upload_media('image_file', 'notifications', 'jpg|jpeg|png|gif|webp');
        if ($uploadedImage) {
            $imageUrl = $uploadedImage;
        }
        $uploadedVideo = $this->_upload_media('video_file', 'notifications', 'mp4|webm|mov');
        if ($uploadedVideo) {
            $videoUrl = $uploadedVideo;
        }

        $media = sk_fcm_normalize_media($mediaType, $imageUrl, $videoUrl);
        if ($media['media_type'] === 'image' && empty($media['image_url'])) {
            return ['error' => 'Image URL or upload required for image-only mode.'];
        }
        if ($media['media_type'] === 'video' && empty($media['video_url'])) {
            return ['error' => 'Video URL or upload required for video-only mode.'];
        }
        if ($media['media_type'] === 'both' && (empty($media['image_url']) || empty($media['video_url']))) {
            return ['error' => 'Both image and video are required for both mode.'];
        }

        $audience = (string)$this->input->post('audience');
        if (!in_array($audience, ['all', 'user', 'token'], true)) {
            $audience = 'all';
        }
        $audienceValue = trim((string)$this->input->post('audience_value', true));

        return [
            'data' => [
                'title'          => $title,
                'body'           => $body,
                'media_type'     => $media['media_type'],
                'image_url'      => $media['image_url'],
                'video_url'      => $media['video_url'],
                'click_url'      => $clickUrl !== '' ? $clickUrl : null,
                'audience'       => $audience,
                'audience_value' => $audienceValue !== '' ? $audienceValue : null,
                'status'         => 'draft',
                'created_by'     => (int)($this->admin['id'] ?? 0) ?: null,
                'created_at'     => date('Y-m-d H:i:s'),
            ],
        ];
    }

    private function _upload_media(string $field, string $dir, string $allowed): ?string {
        if (empty($_FILES[$field]['name'])) {
            return null;
        }
        $path = FCPATH . 'assets/uploads/' . $dir . '/';
        if (!is_dir($path)) {
            mkdir($path, 0755, true);
        }
        $config = [
            'upload_path'   => $path,
            'allowed_types' => $allowed,
            'max_size'      => 51200, // 50MB for short videos
            'file_name'     => uniqid($dir . '_'),
        ];
        $this->load->library('upload');
        $this->upload->initialize($config);
        if ($this->upload->do_upload($field)) {
            return 'assets/uploads/' . $dir . '/' . $this->upload->data('file_name');
        }
        return null;
    }
}
