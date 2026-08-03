import AccountPageTitle from "@/components/account/AccountPageTitle";
import AccountAddresses from "@/components/account/account-addresses/AccountAddresses";
import PageMeta from "@/components/common/PageMeta";

const AccountAddressesPage = () => {
  return (
    <>
      <PageMeta
        title={"My Address | 2Deal - Incense Sticks, Soaps & Food Products Store"}
        description={"2Deal - Incense Sticks, Soaps & Food Products Store"}
      />
      <AccountPageTitle />
      <AccountAddresses />
    </>
  );
};

export default AccountAddressesPage;
