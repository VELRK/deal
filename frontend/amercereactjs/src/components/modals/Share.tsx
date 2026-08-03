export default function Share({ registerModalElement }: { registerModalElement?: (el: HTMLElement | null) => void }) {
  return (
  <div ref={registerModalElement} className="modal modalCentered fade modal-share" id="share">
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-heading d-flex align-items-center justify-content-between">
        <h4 className="title-pop">Share</h4>
        <span className="cs-pointer d-flex link" data-bs-dismiss="modal">
          <i className="icon-X2 fs-24" />
        </span>
      </div>
      <div className="modal-main">
        <ul className="tf-social-icon-2 hv-dark mb-20">
          <li>
            <a href="https://www.facebook.com/">
              <i className="icon icon-FacebookLogo" />
            </a>
          </li>
          <li>
            <a href="https://x.com/">
              <i className="icon icon-XLogo" />
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/">
              <i className="icon icon-InstagramLogo" />
            </a>
          </li>
          <li>
            <a href="https://www.tiktok.com/">
              <i className="icon icon-TiktokLogo" />
            </a>
          </li>
        </ul>
        <div className="wrap-code btn-coppy-text">
          <p className="coppyText cl-text-2" id="coppyText">
            http://themesflat.com
          </p>
          <div className="btn-action-copy tf-btn">Copy</div>
        </div>
      </div>
    </div>
  </div>
</div>

  )
}
