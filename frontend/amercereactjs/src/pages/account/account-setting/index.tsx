import AccountPageTitle from "@/components/account/AccountPageTitle";
import AccountSetting from "@/components/account/account-setting/AccountSetting";
import PageMeta from "@/components/common/PageMeta";

const AccountSettingPage = () => {
  return (
    <>
      <PageMeta
        title={"Setting"}
        description={"Shop incense, soaps, and food products online."}
      />
      <AccountPageTitle />
      <AccountSetting />
    </>
  );
};

export default AccountSettingPage;
