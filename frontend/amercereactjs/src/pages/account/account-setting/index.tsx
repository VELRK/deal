import AccountPageTitle from "@/components/account/AccountPageTitle";
import AccountSetting from "@/components/account/account-setting/AccountSetting";
import PageMeta from "@/components/common/PageMeta";

const AccountSettingPage = () => {
  return (
    <>
      <PageMeta
        title={"Setting | 2Deal - Incense Sticks, Soaps & Food Products Store"}
        description={"2Deal - Incense Sticks, Soaps & Food Products Store"}
      />
      <AccountPageTitle />
      <AccountSetting />
    </>
  );
};

export default AccountSettingPage;
