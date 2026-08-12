import AccountPageTitle from "@/components/account/AccountPageTitle";
import AccountWalletTopup from "@/components/account/account-wallet/AccountWalletTopup";
import PageMeta from "@/components/common/PageMeta";

const AccountWalletTopupPage = () => {
  return (
    <>
      <PageMeta
        title={"Top Up Wallet"}
        description={"Shop incense, soaps, and food products online."}
      />
      <AccountPageTitle />
      <AccountWalletTopup />
    </>
  );
};

export default AccountWalletTopupPage;
