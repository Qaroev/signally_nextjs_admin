import { Box, Button, Container, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { NextLink } from '@mantine/next';
import { showNotification } from '@mantine/notifications';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { Edit, Trash } from 'tabler-icons-react';
import Page from '../../components/others/Page';
import { BaseTable } from '../../components/tables/BaseTable';
import Layout from '../../layouts';
import { Signal } from '../../models/model.signal';
import { apiDeleteSignal } from '../../models_services/firestore_service';
import { useAppSelector } from '../../models_store/_store';
import { fDateTimeSuffix } from '../../utils/formatTime';

export default function SignalsIndexPage() {
  function TableActions(id: string) {
    const router = useRouter();
    const modals = useModals();

    const handleDelete = async (modalId: string) => {
      modals.closeModal(modalId);
      try {
        await apiDeleteSignal(id);
        showNotification({ title: 'Success', message: 'Signal deleted', autoClose: 6000 });
      } catch (error) {
        showNotification({ color: 'red', title: 'Error', message: 'There was an error deleting the signal', autoClose: 6000 });
      }
    };

    const openDeleteModal = () => {
      const modalId = modals.openModal({
        title: 'Are you sure you want to proceed?',
        centered: true,
        children: (
          <>
            <Text size='sm'>Delete this signal? This action cannot be undone.</Text>
            <Box className='mt-6 flex justify-end'>
              <Button variant='outline' className='w-min mx-2' fullWidth onClick={() => modals.closeModal(modalId)} mt='md'>
                No don't delete it
              </Button>

              <Button className=' w-min btn-delete mx-2' fullWidth onClick={() => handleDelete(modalId)} mt='md'>
                Delete signal
              </Button>
            </Box>
          </>
        )
      });
    };

    return (
      <Box className='flex'>
        <Edit className='cursor-pointer text-yellow-400 mr-4' onClick={() => router.push(`/signals/${id}`)} />{' '}
        <Trash className='cursor-pointer text-red-400' onClick={openDeleteModal} />
      </Box>
    );
  }

  const columns = React.useMemo<ColumnDef<Signal>[]>(
    () => [
      {
        header: 'Created',
        accessorKey: 'timestampCreated',
        cell: (row) => fDateTimeSuffix(row.getValue() as any),
        sortable: true
      },
      {
        header: 'Date',
        accessorKey: 'signalDatetime',
        cell: (row) => fDateTimeSuffix(row.getValue() as any),
        sortable: true
      },
      {
        accessorKey: 'type',
        header: () => <span>Type</span>,
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'symbol',
        header: () => <span>Symbol</span>,
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'isActive',
        header: () => <span>Active</span>,
        cell: (info) => getStringFromBoolean(info.getValue() as any),
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'isFree',
        header: () => <span>Free</span>,
        cell: (info) => getStringFromBoolean(info.getValue() as any),
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'entry',
        header: () => 'Entry',
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'stopLoss',
        header: () => <span>Stop Loss</span>,
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'takeProfit1',
        header: 'Take Profit 1',
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'takeProfit2',
        header: 'Take Profit 2',
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'comment',
        header: 'Comment',
        footer: (props) => props.column.id
      },
      {
        accessorKey: 'id',
        header: 'Actions',
        cell: (info) => TableActions(info.getValue() as string),
        enableSorting: false,
        footer: (props) => props.column.id
      }
    ],
    []
  );

  const { signals } = useAppSelector((state) => state.firestore);

  return (
    <Page title='Contact'>
      <Container size='xl' className=''>
        <Box className='flex text-center justify-between items-center mt-20 mb-20'>
          <Text className='text-4xl font-semibold leading-10'>Signals</Text>
          <NextLink href='/signals/create'>
            <Button type='submit' variant='white' className='btn bg-yellow-500'>
              New signal
            </Button>
          </NextLink>
        </Box>

        <BaseTable data={signals} columns={columns} />
      </Container>
    </Page>
  );
}

SignalsIndexPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout variant='admin'>{page}</Layout>;
};

function getStringFromBoolean(value: boolean) {
  console.log(value);
  if (value === undefined || value === null) return 'No';
  return value ? 'Yes' : 'No';
}
