import AccountPageTitle from "@/components/account/AccountPageTitle";
import AccountWalletTopup from "@/components/account/account-wallet/AccountWalletTopup";
import PageMeta from "@/components/common/PageMeta";

const AccountWalletTopupPage = () => {
  return (
    <>
      <PageMeta
        title={"Top Up Wallet | 2Deal - Incense Sticks, Soaps & Food Products Store"}
        description={"2Deal - Incense Sticks, Soaps & Food Products Store"}
      />
      <AccountPageTitle />
      <AccountWalletTopup />
    </>
  );
};

export default AccountWalletTopupPage;
