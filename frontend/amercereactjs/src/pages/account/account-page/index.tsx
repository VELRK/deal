import AccountPageTitle from "@/components/account/AccountPageTitle";
import AccountDashboard from "@/components/account/account-page/AccountDashboard";
import PageMeta from "@/components/common/PageMeta";

const AccountPage = () => {
  return (
    <>
      <PageMeta
        title={"My Account"}
        description={"Shop incense, soaps, and food products online."}
      />
      <AccountPageTitle />
      <AccountDashboard />
    </>
  );
};

export default AccountPage;
