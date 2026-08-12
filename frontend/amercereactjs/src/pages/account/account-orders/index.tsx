import AccountPageTitle from "@/components/account/AccountPageTitle";
import AccountOrders from "@/components/account/account-orders/AccountOrders";
import PageMeta from "@/components/common/PageMeta";

const AccountOrdersPage = () => {
  return (
    <>
      <PageMeta
        title={"Your Orders"}
        description={"Shop incense, soaps, and food products online."}
      />
      <AccountPageTitle />
      <AccountOrders />
    </>
  );
};

export default AccountOrdersPage;
