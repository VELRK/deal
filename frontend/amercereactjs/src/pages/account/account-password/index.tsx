import AccountPageTitle from "@/components/account/AccountPageTitle";
import AccountChangePassword from "@/components/account/account-password/AccountChangePassword";
import PageMeta from "@/components/common/PageMeta";

const AccountPasswordPage = () => {
  return (
    <>
      <PageMeta
        title={"Change Password | Indian Ladies Fashion"}
        description={"Update your account password"}
      />
      <AccountPageTitle heading="Change Password" description="Keep your account secure" />
      <AccountChangePassword />
    </>
  );
};

export default AccountPasswordPage;
