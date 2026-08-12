import AccountPageTitle from "@/components/account/AccountPageTitle";
import AccountRoyalty from "@/components/account/account-royalty/AccountRoyalty";
import PageMeta from "@/components/common/PageMeta";

const AccountRoyaltyPage = () => {
  return (
    <>
      <PageMeta
        title={"Royalty Points"}
        description={"View and track your royalty points separately from wallet balance."}
      />
      <AccountPageTitle />
      <AccountRoyalty />
    </>
  );
};

export default AccountRoyaltyPage;
