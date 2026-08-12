import AccountPageTitle from "@/components/account/AccountPageTitle";
import AccountAddresses from "@/components/account/account-addresses/AccountAddresses";
import PageMeta from "@/components/common/PageMeta";

const AccountAddressesPage = () => {
  return (
    <>
      <PageMeta
        title={"My Address"}
        description={"Shop incense, soaps, and food products online."}
      />
      <AccountPageTitle />
      <AccountAddresses />
    </>
  );
};

export default AccountAddressesPage;
