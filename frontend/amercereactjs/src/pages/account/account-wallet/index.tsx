import AccountPageTitle from "@/components/account/AccountPageTitle";
import AccountWallet from "@/components/account/account-wallet/AccountWallet";
import PageMeta from "@/components/common/PageMeta";

const AccountWalletPage = () => {
  return (
    <>
      <PageMeta
        title={"My Wallet"}
        description={"Shop incense, soaps, and food products online."}
      />
      <AccountPageTitle />
      <AccountWallet />
    </>
  );
};

export default AccountWalletPage;
