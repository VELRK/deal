import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { userAPI, type RoyaltyCartInfo } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";

export default function WalletHeaderIcon() {
  const { isLoggedIn } = useAuthStore();
  const location = useLocation();
  const [balance, setBalance] = useState<number | null>(null);
  const [royalty, setRoyalty] = useState<RoyaltyCartInfo | null>(null);

  const refresh = useCallback(() => {
    if (!isLoggedIn) {
      setBalance(null);
      setRoyalty(null);
      return;
    }
    userAPI
      .getWallet()
      .then((res) => {
        if (!res.data?.success || !res.data.data) return;
        const d = res.data.data as {
          balance?: number;
          royalty?: RoyaltyCartInfo;
        };
        setBalance(typeof d.balance === "number" ? d.balance : 0);
        if (d.royalty) setRoyalty(d.royalty);
      })
      .catch(() => {
        userAPI
          .getRoyalty()
          .then((r) => {
            const roy = r.data?.data as RoyaltyCartInfo | undefined;
            setRoyalty(roy ?? null);
            setBalance(0);
          })
          .catch(() => {
            setBalance(null);
            setRoyalty(null);
          });
      });
  }, [isLoggedIn]);

  useEffect(() => {
    refresh();
  }, [refresh, location.pathname]);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible") refresh();
    };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [refresh]);

  const royaltyPts = Number(royalty?.points ?? 0);
  const royaltyRm = Number(royalty?.balance_rm ?? 0);
  const showWallet = balance !== null && balance > 0;
  const showRoyalty = !showWallet && royaltyPts > 0;
  const href = showRoyalty ? "/account-royalty" : "/account-wallet";

  return (
    <Link
      to={href}
      onClick={(e) => {
        if (!isLoggedIn) {
          e.preventDefault();
          useModalStore.getState().openModal("signIn", { redirect: href });
        }
      }}
      className="nav-icon-item link d-flex align-items-center gap-2"
      style={{
        color: "#222",
        transition: "color 0.2s, background-color 0.2s",
        textDecoration: "none",
        padding: "6px 12px",
        borderRadius: "20px",
        backgroundColor: "rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.04)";
      }}
      title={showRoyalty ? "Royalty points" : "Wallet"}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="wallet-svg-icon"
      >
        {showRoyalty ? (
          <>
            <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9" />
          </>
        ) : (
          <>
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
            <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
          </>
        )}
      </svg>
      {showWallet && (
        <span style={{ fontSize: "14px", fontWeight: 600 }}>
          RM {balance!.toFixed(2)}
        </span>
      )}
      {showRoyalty && (
        <span style={{ fontSize: "14px", fontWeight: 600 }}>
          {royaltyPts} pts
          <span style={{ fontWeight: 500, opacity: 0.75, marginLeft: 4 }}>
            (RM {royaltyRm.toFixed(1).replace(/\.0$/, "")})
          </span>
        </span>
      )}
      {balance !== null && !showWallet && !showRoyalty && (
        <span style={{ fontSize: "14px", fontWeight: 600 }}>RM 0.00</span>
      )}
    </Link>
  );
}
