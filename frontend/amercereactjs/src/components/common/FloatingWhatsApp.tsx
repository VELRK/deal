import { useSiteSettings } from "@/hooks/useApi";

export default function FloatingWhatsApp() {
  const { settings } = useSiteSettings();

  if (!settings || !settings.whatsapp_enabled || !settings.whatsapp_number) {
    return null;
  }

  const message = "Hello! I have a query regarding a product on your store.";
  const waUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-wa-btn"
      title="Chat with us on WhatsApp"
    >
      <style>{`
        .floating-wa-btn {
          position: fixed;
          bottom: 30px;
          left: 30px;
          width: 60px;
          height: 60px;
          background-color: #25d366;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
          z-index: 9999;
          text-decoration: none !important;
        }
        .floating-wa-btn:hover {
          transform: scale(1.1);
          background-color: #20ba5a;
          color: white;
          box-shadow: 0 6px 16px rgba(0,0,0,0.3);
        }
        @media (max-width: 768px) {
          .floating-wa-btn {
            bottom: 20px;
            left: 20px;
            width: 50px;
            height: 50px;
            font-size: 26px;
          }
        }
      `}</style>
      <i className="bi bi-whatsapp"></i>
    </a>
  );
}
