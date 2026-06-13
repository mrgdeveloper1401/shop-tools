'use client';
import { FC, Suspense, useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';

import BaseDrawer from '../BaseDrawer/BaseDrawer';
import PrimaryButton from '../../PrimaryButton/Primary.button';
import BaseTable from '../../tables/BaseTable/Base.table';

import {
  getOrderItemApi,
  IOrderItem,
} from '@/data/server_request/dashboard/orders';
import { OrderItemsColumnsData } from './OrderItemsShowButtonDrawer.table';
import s from './OrderItemsShowButtonDrawer.module.css';

interface IOrderItemsShowButtonDrawerProps {
  orderId: number;
}
const OrderItemsShowButtonDrawer: FC<IOrderItemsShowButtonDrawerProps> = ({
  orderId,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [allItemsData, setAllItemsData] = useState<IOrderItem[]>();
  const [isLoading, setIsLoading] = useState(true);

  const callGetOneOrderItemsApi = async () => {
    try {
      const result = await getOrderItemApi(orderId);
      setAllItemsData(result);
    } catch (error) {
      // console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (opened) callGetOneOrderItemsApi();
  }, [opened]);

  return (
    <>
      <BaseDrawer
        lockScroll={true}
        size="xl"
        title="مشاهده سفارشات"
        opened={opened}
        onClose={close}
        position="right"
      >
        <form className={s.form_container}>
          <div className={s.form}>
            <Suspense>
              <BaseTable
                loadingCount={3}
                isLoading={isLoading}
                columns={OrderItemsColumnsData}
                data={allItemsData as any}
              />
            </Suspense>
          </div>
          <div className={s.buttonContainer}>
            <PrimaryButton onClick={close} size="lg" variant="primary">
              تایید
            </PrimaryButton>
          </div>
        </form>
      </BaseDrawer>
      <PrimaryButton onClick={open}>مشاهده سفارشات</PrimaryButton>
    </>
  );
};
export default OrderItemsShowButtonDrawer;
