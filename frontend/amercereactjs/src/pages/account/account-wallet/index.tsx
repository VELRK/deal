import AccountPageTitle from "@/components/account/AccountPageTitle";
import AccountWallet from "@/components/account/account-wallet/AccountWallet";
import PageMeta from "@/components/common/PageMeta";

const AccountWalletPage = () => {
  return (
    <>
      <PageMeta
        title={"My Wallet | 2Deal - Incense Sticks, Soaps & Food Products Store"}
        description={"2Deal - Incense Sticks, Soaps & Food Products Store"}
      />
      <AccountPageTitle />
      <AccountWallet />
    </>
  );
};

export default AccountWalletPage;
