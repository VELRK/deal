import AccountPageTitle from "@/components/account/AccountPageTitle";
import AccountDashboard from "@/components/account/account-page/AccountDashboard";
import PageMeta from "@/components/common/PageMeta";

const AccountPage = () => {
  return (
    <>
      <PageMeta
        title={"My Account | 2Deal - Incense Sticks, Soaps & Food Products Store"}
        description={"2Deal - Incense Sticks, Soaps & Food Products Store"}
      />
      <AccountPageTitle />
      <AccountDashboard />
    </>
  );
};

export default AccountPage;
