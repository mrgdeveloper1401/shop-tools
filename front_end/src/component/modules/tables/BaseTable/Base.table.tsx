import { useRef } from 'react';
import { Flex, Table, TableProps, Skeleton } from '@mantine/core';

import styles from './Base.table.module.css';

interface Column {
  key: string;
  header: string;
  render?: (value: any) => React.ReactNode;
  hasFilter?: React.ReactNode | null;
}

interface BaseTableProps extends Omit<TableProps, 'children' | 'data'> {
  columns: Column[];
  data: any[];
  minWidth?: number;
  isLoading?: boolean;
  loadingCount?: number;
  emptyState?: React.ReactNode;
}

const BaseTable = ({
  columns,
  data,
  minWidth = 1200,
  isLoading,
  loadingCount,
  emptyState,
  ...tableProps
}: BaseTableProps) => {
  const loadingRows = (
    <>
      {[...Array(loadingCount)].map((_, index) => (
        <Table.Tr classNames={{ tr: styles.tr }} key={`loading-${index + 1}`}>
          {columns.map((column) => (
            <Table.Td key={column.key}>
              <Skeleton radius={4} bg="#f1f3f5" height={20} />
            </Table.Td>
          ))}
        </Table.Tr>
      ))}
    </>
  );
  const renderContent = () => {
    if (isLoading) {
      return loadingRows;
    }
    if (!data || data.length === 0) {
      return (
        <Table.Tr style={{ height: '45vh' }}>
          <Table.Td colSpan={columns.length} style={{ height: '100%' }}>
            <Flex
              justify="center"
              align="center"
              gap="md"
              direction="column"
              style={{
                minHeight: '200px',
                width: '100%',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="169"
                height="169"
                viewBox="0 0 169 169"
                fill="none"
              >
                <path
                  d="M127.424 57.3732C131.826 57.3732 136.13 56.0676 139.791 53.6217C143.451 51.1757 146.304 47.6992 147.989 43.6317C149.674 39.5642 150.115 35.0885 149.256 30.7705C148.397 26.4524 146.277 22.4861 143.164 19.373C140.051 16.2598 136.084 14.1398 131.766 13.2809C127.448 12.422 122.973 12.8628 118.905 14.5476C114.838 16.2324 111.361 19.0855 108.915 22.7462C106.469 26.4068 105.164 30.7105 105.164 35.1132C105.164 41.0169 107.509 46.6788 111.683 50.8534C115.858 55.0279 121.52 57.3732 127.424 57.3732Z"
                  fill="#CDD5DF"
                />
                <path
                  d="M127.424 12.8532C122.972 12.8426 118.62 14.1699 114.932 16.663C111.244 19.1561 108.39 22.6999 106.74 26.8347C105.091 30.9695 104.722 35.5045 105.682 39.8515C106.641 44.1985 108.885 48.1569 112.122 51.2132L143.524 19.8112C141.455 17.6167 138.96 15.8676 136.191 14.6712C133.423 13.4747 130.439 12.8561 127.424 12.8532Z"
                  fill="#EEF2F6"
                />
                <path
                  d="M91.0234 51.2133H7.02344C6.09518 51.2133 5.20494 50.8445 4.54856 50.1881C3.89219 49.5318 3.52344 48.6415 3.52344 47.7133V26.7133C3.52344 25.785 3.89219 24.8948 4.54856 24.2384C5.20494 23.582 6.09518 23.2133 7.02344 23.2133H91.0234"
                  fill="#CDD5DF"
                />
                <path
                  d="M91.0234 51.2133H7.02344C6.09518 51.2133 5.20494 50.8445 4.54856 50.1881C3.89219 49.5318 3.52344 48.6415 3.52344 47.7133V26.7133C3.52344 25.785 3.89219 24.8948 4.54856 24.2384C5.20494 23.582 6.09518 23.2133 7.02344 23.2133H91.0234"
                  stroke="#121926"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M127.424 57.3732C131.826 57.3732 136.13 56.0676 139.791 53.6217C143.451 51.1757 146.304 47.6992 147.989 43.6317C149.674 39.5642 150.115 35.0885 149.256 30.7705C148.397 26.4524 146.277 22.4861 143.164 19.373C140.051 16.2598 136.084 14.1398 131.766 13.2809C127.448 12.422 122.973 12.8628 118.905 14.5476C114.838 16.2324 111.361 19.0855 108.915 22.7462C106.469 26.4068 105.164 30.7105 105.164 35.1132C105.164 41.0169 107.509 46.6788 111.683 50.8534C115.858 55.0279 121.52 57.3732 127.424 57.3732Z"
                  stroke="#121926"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M143.167 50.8632L164.524 72.2202"
                  stroke="#121926"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.5234 121.213C11.9079 121.213 13.2613 120.803 14.4124 120.033C15.5636 119.264 16.4608 118.171 16.9906 116.892C17.5204 115.613 17.659 114.205 17.3889 112.848C17.1188 111.49 16.4522 110.242 15.4732 109.263C14.4942 108.284 13.2469 107.618 11.8891 107.348C10.5312 107.078 9.12374 107.216 7.84465 107.746C6.56557 108.276 5.47232 109.173 4.70315 110.324C3.93398 111.475 3.52344 112.829 3.52344 114.213C3.52344 116.07 4.26094 117.85 5.57369 119.163C6.88644 120.476 8.66692 121.213 10.5234 121.213Z"
                  fill="#CDD5DF"
                  stroke="#121926"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.5234 156.213C11.9079 156.213 13.2613 155.803 14.4124 155.033C15.5636 154.264 16.4608 153.171 16.9906 151.892C17.5204 150.613 17.659 149.205 17.3889 147.848C17.1188 146.49 16.4522 145.242 15.4732 144.263C14.4942 143.284 13.2469 142.618 11.8891 142.348C10.5312 142.078 9.12374 142.216 7.84465 142.746C6.56557 143.276 5.47232 144.173 4.70315 145.324C3.93398 146.475 3.52344 147.829 3.52344 149.213C3.52344 151.07 4.26094 152.85 5.57369 154.163C6.88644 155.476 8.66692 156.213 10.5234 156.213Z"
                  fill="#CDD5DF"
                  stroke="#121926"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M31.5234 114.213H108.523"
                  stroke="#121926"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.5234 86.2131C11.9079 86.2131 13.2613 85.8026 14.4124 85.0334C15.5636 84.2643 16.4608 83.171 16.9906 81.8919C17.5204 80.6128 17.659 79.2054 17.3889 77.8475C17.1188 76.4896 16.4522 75.2424 15.4732 74.2634C14.4942 73.2844 13.2469 72.6177 11.8891 72.3476C10.5312 72.0775 9.12374 72.2162 7.84465 72.746C6.56557 73.2758 5.47232 74.173 4.70315 75.3242C3.93398 76.4753 3.52344 77.8287 3.52344 79.2131C3.52344 81.0697 4.26094 82.8501 5.57369 84.1629C6.88644 85.4756 8.66692 86.2131 10.5234 86.2131Z"
                  fill="#CDD5DF"
                  stroke="#121926"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M31.5234 79.2133H108.523"
                  stroke="#121926"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M31.5234 149.213H108.523"
                  stroke="#121926"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-DanaMedium text-[16px] text-title">
                {emptyState ? emptyState : 'موردی یافت نشد'}
              </span>
            </Flex>
          </Table.Td>
        </Table.Tr>
      );
    }
    return rows;
  };

  const rows =
    Array.isArray(data) &&
    data.map((item, index) => (
      <Table.Tr classNames={{ tr: styles.tr }} key={index}>
        {columns.map((column) => (
          <Table.Td key={column.key}>
            {column.render ? column.render(item) : item[column.key]}
          </Table.Td>
        ))}
      </Table.Tr>
    ));

  const tableRef = useRef<HTMLDivElement | null>(null);
  let isDown = false;
  let startX: number;
  let scrollLeft: number;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tableRef.current) return;
    isDown = true;
    startX = e.pageX - tableRef.current.offsetLeft;
    scrollLeft = tableRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown = false;
  };

  const handleMouseUp = () => {
    isDown = false;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDown || !tableRef.current) return;
    e.preventDefault();
    const x = e.pageX - tableRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    tableRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      ref={tableRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className={styles.TableContainer}
    >
      <Table
        highlightOnHover
        stickyHeaderOffset={0}
        verticalSpacing="md"
        horizontalSpacing="lg"
        classNames={{ table: styles.table }}
        {...tableProps}
      >
        <Table.Thead classNames={{ thead: styles.thead }}>
          <Table.Tr>
            {columns.map((column) => (
              <Table.Th classNames={{ th: styles.th }} key={column.key}>
                <Flex align="center" justify="center" gap="xs" pos="relative">
                  {column.header}
                  {column.hasFilter ?? null}
                </Flex>
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{renderContent()}</Table.Tbody>
      </Table>
    </div>
  );
};
export default BaseTable;
