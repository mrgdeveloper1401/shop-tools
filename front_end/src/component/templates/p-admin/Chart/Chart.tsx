'use client';
import { Suspense, useEffect, useState } from 'react';
import { useChartForm } from '@/hooks/formik/admin-dashboard/useChartFormik';
import dynamic from 'next/dynamic';

const DatePicker = dynamic(() => import('react-multi-date-picker'), {
  ssr: false,
});
import DatePanel from 'react-multi-date-picker/plugins/date_panel';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

import BaseTable from '@/component/modules/tables/BaseTable/Base.table';

import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
} from 'recharts';

import {
  convertToJalali,
  dateConvertRangeUtils,
  getPastDate,
} from '@/utils/dateConvertUtils';
import { getChartApi, IChart } from '@/data/server_request/dashboard/orders';
import { ChartColumnsData } from './Chart.table';

import styles from './Chart.module.css';

const Chart = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allChart, setAllChart] = useState<IChart[]>([]);

  const submitHandler = () => {};
  const { values, setFieldValue } = useChartForm(submitHandler);

  const today = getPastDate(1);
  const lastWeek = getPastDate(17);

  const callGetOrderApi = async () => {
    try {
      const result = await getChartApi(
        values?.start_date ? values?.start_date : lastWeek,
        values?.end_date ? values.end_date : today,
      );
      setAllChart(result);
    } catch (error) {
      // console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    callGetOrderApi();
  }, [values.start_date, values.end_date]);

  return (
    <section className={styles.secctionListCard}>
      <div className={styles.RegisterMain}>
        <div className={styles.nameSection}>
          <span>نمودار فروش</span>
        </div>
        <div className="my-28">
          <SaleBarChart data={allChart} setFieldValue={setFieldValue} />
        </div>
        <Suspense>
          <BaseTable
            loadingCount={3}
            isLoading={isLoading}
            columns={ChartColumnsData}
            data={allChart as any}
          />
        </Suspense>
      </div>
    </section>
  );
};
export default Chart;

const SaleBarChart = ({
  data,
  setFieldValue,
}: {
  data: any;
  setFieldValue: any;
}) => {
  if (!data) {
    return null;
  }
  const sortedData = [...data]
    .sort((a, b) => a.sale_date.localeCompare(b.sale_date))
    .map((item) => ({
      ...item,
      sale_date_fa: convertToJalali(item.sale_date),
    }));

  const timeHandler = (date: any) => {
    dateConvertRangeUtils(date, setFieldValue, 'start_date', 'end_date');
  };
  return (
    <div style={{ width: '100%', height: 300 }} className="my-42">
      <div className={styles.datePicker}>
        <DatePicker
          style={{
            width: '100%',
            height: '50px',
            border: 'none',
            outline: 'none',
            padding: '0.5rem',
            textAlign: 'center',
            background: '#e2e8f0',
            borderRadius: '10px',
            color: 'black',
          }}
          className={styles.datePicker}
          plugins={[<DatePanel position="left" />]}
          range
          calendar={persian}
          locale={persian_fa}
          calendarPosition="bottom-center"
          onChange={timeHandler}
          placeholder="تاریخ شروع تا پایان"
          dateSeparator=" تا "
        />
      </div>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>نمودار فروش</h2>

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={sortedData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="sale_date_fa" name="تاریخ فروش" />

          <YAxis
            yAxisId="left"
            orientation="left"
            tickFormatter={(val) => val.toLocaleString('fa-IR')}
            label={{
              value: 'مقدار فروش (تومان)',
              angle: -90,
              position: 'insideLeft',
            }}
          />

          <Tooltip
            formatter={(
              value: number | undefined,
              name: string | undefined,
            ) => [value?.toLocaleString('fa-IR') ?? '0', name]}
            labelFormatter={(label) => `تاریخ: ${label}`}
          />

          <Legend />

          <Bar
            yAxisId="left"
            dataKey="total_amount"
            barSize={20}
            fill="#7950F2"
            name="مقدار کل فروش (تومان)"
          />

          <Line
            yAxisId="right"
            type="monotone"
            dataKey="total_quantity"
            stroke="#7950F2"
            name="تعداد فروش"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
