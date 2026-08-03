import AccountPageTitle from "@/components/account/AccountPageTitle";
import AccountOrders from "@/components/account/account-orders/AccountOrders";
import PageMeta from "@/components/common/PageMeta";

const AccountOrdersPage = () => {
  return (
    <>
      <PageMeta
        title={"Your Orders | 2Deal - Incense Sticks, Soaps & Food Products Store"}
        description={"2Deal - Incense Sticks, Soaps & Food Products Store"}
      />
      <AccountPageTitle />
      <AccountOrders />
    </>
  );
};

export default AccountOrdersPage;
